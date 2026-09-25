/*
 * Social feed: latest Facebook Page + Instagram posts, normalised into one list.
 *
 * HOW THE REAL INTEGRATION WORKS
 * ------------------------------
 * Meta does not allow reading arbitrary public profiles. Both networks only
 * expose posts for accounts you own, through the Graph API:
 *
 *   Facebook  GET /{page-id}/posts        needs a Page access token
 *   Instagram GET /{ig-user-id}/media     needs an IG Business/Creator account
 *                                         linked to that same Page
 *
 * Setup is ONE env var — the Page and Instagram ids are discovered from the
 * token automatically (see resolveAccounts), so nothing else must be looked up:
 *
 *   META_ACCESS_TOKEN   access token (User OR Page token both work) — REQUIRED
 *   FB_PAGE_ID          optional — only if auto-discovery picks the wrong Page
 *   IG_USER_ID          optional — only to override the discovered IG account
 *   IG_DISCOVER_USERNAME optional — also pull a public Business account's posts
 *   SOCIAL_CACHE_TTL    optional, seconds (default 900 = 15 min)
 *
 * DEMO MODE
 * ---------
 * With no token configured the endpoint serves the sample posts at the bottom
 * of this file, flagged `demo: true`, so the whole feature is visible and
 * testable before the client has connected anything. The UI labels that state
 * explicitly — these are illustrative posts, not real ones from any account.
 */

import { curatedPosts } from './curated-posts.js'

const GRAPH = 'https://graph.facebook.com/v21.0'

/* Serverless instances are reused between invocations, so a module-scope cache
   keeps us far below Meta's rate limits. */
let cache = { at: 0, payload: null }

const ttlMs = () => (Number(process.env.SOCIAL_CACHE_TTL) || 900) * 1000

function isConfigured() {
  // A token alone is enough: the Page id and Instagram id are discovered from
  // it (see resolveAccounts), so the client only ever pastes ONE value.
  return Boolean(process.env.META_ACCESS_TOKEN)
}

async function getJson(url) {
  const res = await fetch(url)
  const body = await res.json().catch(() => ({}))
  if (!res.ok || body.error) {
    const msg = body?.error?.message || `HTTP ${res.status}`
    throw new Error(msg)
  }
  return body
}

/*
 * Work out which Page and Instagram account the token can read, so the client
 * does not have to look up numeric ids by hand. Explicit env vars always win;
 * otherwise we discover them from the token — handling BOTH a User token
 * (via /me/accounts) and a Page token (via /me). The result is cached for a few
 * hours because these ids never change between posts.
 */
let accounts = { at: 0, data: null }
const ACCOUNTS_TTL = 6 * 60 * 60 * 1000

async function resolveAccounts(token, force = false) {
  const envPage = process.env.FB_PAGE_ID || null
  const envIg = process.env.IG_USER_ID || null

  // Both supplied by hand — nothing to discover.
  if (envPage && envIg) return { pageId: envPage, igUserId: envIg, pageToken: token }

  if (!force && accounts.data && Date.now() - accounts.at < ACCOUNTS_TTL) {
    return accounts.data
  }

  let pageId = envPage
  let igUserId = envIg
  let pageToken = token

  // Path 1: a User access token can list the Pages it manages, each of which
  // carries its own Page token and its linked Instagram account.
  try {
    const body = await getJson(
      `${GRAPH}/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${token}`
    )
    const pages = body.data || []
    const page = envPage ? pages.find((p) => p.id === envPage) : pages[0]
    if (page) {
      pageId = page.id
      pageToken = page.access_token || token
      if (!igUserId) igUserId = page.instagram_business_account?.id || null
    }
  } catch {
    // Not a user token (or missing pages_show_list) — try the Page-token path.
  }

  // Path 2: a Page access token resolves /me to the Page itself.
  if (!pageId || !igUserId) {
    try {
      const me = await getJson(
        `${GRAPH}/me?fields=id,instagram_business_account{id,username}&access_token=${token}`
      )
      if (me.id) {
        pageId = pageId || me.id
        if (!igUserId) igUserId = me.instagram_business_account?.id || null
      }
    } catch {
      // Leave whatever we have; explicit env ids (if any) still apply.
    }
  }

  const data = { pageId, igUserId, pageToken }
  accounts = { at: Date.now(), data }
  return data
}

/** Trim a caption to a card-friendly length without cutting mid-word. */
function excerpt(text, max = 220) {
  if (!text) return ''
  const clean = String(text).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, clean.lastIndexOf(' ', max)).trimEnd() + '…'
}

async function fetchFacebook(token, pageId) {
  const fields =
    'id,message,created_time,permalink_url,full_picture,reactions.summary(total_count).limit(0),comments.summary(total_count).limit(0)'
  const url = `${GRAPH}/${pageId}/posts?fields=${fields}&limit=8&access_token=${token}`
  const { data = [] } = await getJson(url)
  return data
    // Link-only posts with no text and no image make poor cards.
    .filter((p) => p.message || p.full_picture)
    .map((p) => ({
      id: `fb_${p.id}`,
      network: 'facebook',
      text: excerpt(p.message),
      image: p.full_picture || null,
      permalink: p.permalink_url,
      postedAt: p.created_time,
      likes: p.reactions?.summary?.total_count ?? null,
      comments: p.comments?.summary?.total_count ?? null
    }))
}

async function fetchInstagram(token, igUserId) {
  const fields =
    'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp,like_count,comments_count'
  const url = `${GRAPH}/${igUserId}/media?fields=${fields}&limit=8&access_token=${token}`
  const { data = [] } = await getJson(url)
  return data.map((m) => ({
    id: `ig_${m.id}`,
    network: 'instagram',
    text: excerpt(m.caption),
    // Videos expose a still in thumbnail_url; media_url would be the mp4.
    image: m.media_type === 'VIDEO' ? m.thumbnail_url || null : m.media_url || null,
    permalink: m.permalink,
    postedAt: m.timestamp,
    likes: m.like_count ?? null,
    comments: m.comments_count ?? null
  }))
}

/*
 * Posts from SOMEONE ELSE'S public Instagram, via the business_discovery edge.
 *
 * This is the only way Meta lets you read an account you do not own, and it is
 * still not a free-for-all:
 *   - the request is made AS your own IG account, with your own token;
 *   - the target must be a Business or Creator account (personal profiles are
 *     invisible to this edge, which is why most profiles cannot be read);
 *   - it needs instagram_basic + instagram_manage_insights.
 *
 * Set IG_DISCOVER_USERNAME to e.g. the manufacturer's official account to
 * surface their posts alongside (or instead of) the client's own.
 */
async function fetchInstagramDiscovery(token, igUserId, username) {
  const media = 'media.limit(8){caption,media_type,media_url,thumbnail_url,permalink,timestamp}'
  const url =
    `${GRAPH}/${igUserId}?fields=business_discovery.username(${encodeURIComponent(username)})` +
    `{username,${media}}&access_token=${token}`
  const body = await getJson(url)
  const found = body?.business_discovery
  if (!found) throw new Error(`business_discovery returned nothing for @${username}`)
  return (found.media?.data || []).map((m) => ({
    id: `igd_${m.id}`,
    network: 'instagram',
    author: found.username || username,
    text: excerpt(m.caption),
    image: m.media_type === 'VIDEO' ? m.thumbnail_url || null : m.media_url || null,
    permalink: m.permalink,
    postedAt: m.timestamp
  }))
}

/*
 * Curated posts: real permalinks, resolved through Open Graph tags.
 *
 * Instagram and Facebook both serve og:image / og:title / og:description on a
 * public post URL without authentication — that is how every link preview in
 * every chat app works. Reading them needs no token and touches no feed, so it
 * stays inside Meta's terms while still showing genuine posts.
 *
 * Caveat worth knowing: Meta's CDN image URLs are signed and expire after a
 * while. For anything that has to survive months, set `image` in
 * curated-posts.js to a local copy instead.
 */
const entities = (t = '') =>
  t
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')

function readOg(html, prop) {
  // Attribute order varies between the two networks, so try both arrangements.
  const patterns = [
    new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']*)["']`, 'i'),
    new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+property=["']og:${prop}["']`, 'i')
  ]
  for (const re of patterns) {
    const m = html.match(re)
    if (m) return entities(m[1])
  }
  return null
}

/** Instagram's og:description is "N likes, M comments - Name on DATE: \"caption\"". */
function parseIgDescription(desc) {
  if (!desc) return { text: '', likes: null, comments: null }
  const counts = desc.match(/([\d,.]+)\s+likes?,\s*([\d,.]+)\s+comments?/i)
  const num = (v) => (v ? Number(v.replace(/[,.]/g, '')) : null)
  const quoted = desc.match(/[:\-]\s*["“]([\s\S]+)["”]\s*$/)
  return {
    text: quoted ? quoted[1] : desc,
    likes: counts ? num(counts[1]) : null,
    comments: counts ? num(counts[2]) : null
  }
}

async function fetchCurated(entries) {
  const results = await Promise.allSettled(
    entries.map(async (entry, i) => {
      const network = /instagram\.com/i.test(entry.url) ? 'instagram' : 'facebook'
      let og = {}

      // Entry already carries its own copy + image: nothing to look up. This is
      // the normal case now that Instagram serves a login wall to servers, and
      // it keeps the endpoint fast instead of timing out on every refresh.
      if (entry.text && entry.image) {
        return {
          id: `cur_${i}`,
          network,
          curated: true,
          author: entry.author || null,
          text: excerpt(entry.text),
          image: entry.image,
          permalink: entry.url,
          postedAt: entry.date || null,
          likes: entry.likes ?? null,
          comments: entry.comments ?? null
        }
      }

      try {
        // A crawler UA is what makes Meta serve the preview tags.
        const res = await fetch(entry.url, {
          headers: {
            'User-Agent': 'facebookexternalhit/1.1',
            'Accept-Language': 'bg,en;q=0.8'
          },
          redirect: 'follow'
        })
        const html = await res.text()
        og = {
          image: readOg(html, 'image'),
          title: readOg(html, 'title'),
          description: readOg(html, 'description')
        }
      } catch {
        // A fetch failure is not fatal: an entry that supplies its own text and
        // image still renders perfectly well.
      }

      const parsed =
        network === 'instagram' ? parseIgDescription(og.description) : { text: og.description }

      const text = entry.text || parsed.text || ''
      const image = entry.image || og.image || null
      if (!text && !image) throw new Error(`no usable metadata for ${entry.url}`)

      return {
        id: `cur_${i}`,
        network,
        curated: true,
        author: entry.author || (og.title || '').split('(')[0].trim() || null,
        text: excerpt(text),
        image,
        permalink: entry.url,
        postedAt: entry.date || null,
        likes: entry.likes ?? parsed.likes ?? null,
        comments: entry.comments ?? parsed.comments ?? null
      }
    })
  )

  const posts = []
  const errors = []
  results.forEach((r, i) => {
    if (r.status === 'fulfilled') posts.push(r.value)
    else errors.push({ network: 'curated', message: `${entries[i].url}: ${r.reason?.message}` })
  })
  return { posts, errors }
}

/**
 * Returns { posts, demo, sources, errors }.
 *
 * One network failing never takes the section down — whatever succeeded is
 * still returned, and the failure is reported in `errors` for debugging.
 */
export async function getSocialPosts({ limit = 6, force = false } = {}) {
  if (!force && cache.payload && Date.now() - cache.at < ttlMs()) {
    return { ...cache.payload, cached: true }
  }

  // Hand-picked real posts need no token, so they are tried first.
  if (curatedPosts.length) {
    const { posts, errors } = await fetchCurated(curatedPosts)
    if (posts.length) {
      // Keep the order given in curated-posts.js unless dates are supplied.
      if (posts.every((p) => p.postedAt)) {
        posts.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))
      }
      const payload = { demo: false, sources: ['curated'], errors, posts: posts.slice(0, limit) }
      cache = { at: Date.now(), payload }
      return { ...payload, cached: false }
    }
  }

  if (!isConfigured()) {
    const payload = {
      demo: true,
      sources: [],
      errors: [],
      posts: demoPosts.slice(0, limit)
    }
    cache = { at: Date.now(), payload }
    return { ...payload, cached: false }
  }

  const token = process.env.META_ACCESS_TOKEN
  // One value in, both ids out — the client never looks these up by hand.
  const acct = await resolveAccounts(token, force)
  const pageToken = acct.pageToken || token
  const jobs = []
  if (acct.pageId) {
    jobs.push(['facebook', fetchFacebook(pageToken, acct.pageId)])
  }
  if (acct.igUserId) {
    jobs.push(['instagram', fetchInstagram(pageToken, acct.igUserId)])
  }
  // Optional: a second Instagram source, read from a public Business account.
  if (acct.igUserId && process.env.IG_DISCOVER_USERNAME) {
    jobs.push([
      'instagram-discovery',
      fetchInstagramDiscovery(pageToken, acct.igUserId, process.env.IG_DISCOVER_USERNAME)
    ])
  }

  const settled = await Promise.allSettled(jobs.map(([, p]) => p))

  const posts = []
  const sources = []
  const errors = []

  // Token set but no account could be resolved — surface why, for debugging.
  if (!jobs.length) {
    errors.push({
      network: 'setup',
      message:
        'Токенът не върна нито Facebook страница, нито Instagram акаунт. ' +
        'Проверете, че токенът е за правилната страница и че Instagram е Business/Creator акаунт, свързан с нея.'
    })
  }

  settled.forEach((result, i) => {
    const network = jobs[i][0]
    if (result.status === 'fulfilled') {
      sources.push(network)
      posts.push(...result.value)
    } else {
      errors.push({ network, message: result.reason?.message || 'unknown error' })
    }
  })

  // Newest first across both networks.
  posts.sort((a, b) => new Date(b.postedAt) - new Date(a.postedAt))

  const payload = { demo: false, sources, errors, posts: posts.slice(0, limit) }

  // If every source failed, keep serving the last good response rather than an
  // empty section; only cache a result that actually has something in it.
  if (!posts.length && cache.payload?.posts?.length) {
    return { ...cache.payload, cached: true, errors }
  }

  cache = { at: Date.now(), payload }
  return { ...payload, cached: false }
}

/*
 * Sample posts for demo mode.
 *
 * Illustrative content written for this project — NOT real posts, and not
 * attributed to any real account. The API flags them `demo: true` and the UI
 * shows a visible notice, so they can never be mistaken for genuine activity.
 * They disappear the moment real credentials are configured.
 */
const demoPosts = [
  {
    id: 'demo_1',
    likes: 184,
    comments: 12,
    network: 'facebook',
    demo: true,
    text: 'Завършен монтаж на термопомпа въздух-вода в еднофамилна къща. Подменихме стар котел на нафта — отоплението и топлата вода вече се осигуряват от една система.',
    image: '/images/hero/air.jpg',
    permalink: null,
    postedAt: '2026-09-15T09:20:00+0300'
  },
  {
    id: 'demo_2',
    likes: 263,
    comments: 21,
    network: 'instagram',
    demo: true,
    text: 'Геотермална инсталация в процес на изграждане. Сондажите са готови, следва свързване на колекторите. #термопомпа #геотермия',
    image: '/images/hero/ground.jpg',
    permalink: null,
    postedAt: '2026-09-11T14:05:00+0300'
  },
  {
    id: 'demo_3',
    likes: 97,
    comments: 6,
    network: 'instagram',
    demo: true,
    text: 'Термопомпа вода-вода — най-високата ефективност при подходящи условия на терена.',
    image: '/images/hero/water.jpg',
    permalink: null,
    postedAt: '2026-09-04T11:40:00+0300'
  },
  {
    id: 'demo_4',
    likes: 411,
    comments: 38,
    network: 'facebook',
    demo: true,
    text: 'Често ни питат колко ток консумира една термопомпа. Накратко: от 1 kWh електроенергия се получават 3 до 5 kWh топлина. Останалото идва безплатно от околната среда.',
    image: '/images/home/heat-pumps.jpg',
    permalink: null,
    postedAt: '2026-08-28T08:15:00+0300'
  },
  {
    id: 'demo_5',
    likes: 152,
    comments: 9,
    network: 'instagram',
    demo: true,
    text: 'Вътрешно тяло, монтирано и пуснато в експлоатация. Компактно решение, което се вписва дори в малко техническо помещение.',
    image: '/images/hero/hawk-panel.jpg',
    permalink: null,
    postedAt: '2026-08-21T16:30:00+0300'
  },
  {
    id: 'demo_6',
    likes: 88,
    comments: 4,
    network: 'facebook',
    demo: true,
    text: 'Подготвяме оферти за есенния сезон. Ако планирате подмяна на отоплението преди зимата, сега е моментът за оглед.',
    image: '/images/home/air-eagle-poster.jpg',
    permalink: null,
    postedAt: '2026-08-14T10:00:00+0300'
  }
]
