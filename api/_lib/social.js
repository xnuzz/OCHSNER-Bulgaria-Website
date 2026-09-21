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
 * So this reads from env vars the client fills in with their OWN accounts:
 *
 *   META_ACCESS_TOKEN   long-lived Page access token
 *   FB_PAGE_ID          numeric Page id
 *   IG_USER_ID          numeric Instagram Business account id
 *   SOCIAL_CACHE_TTL    optional, seconds (default 900 = 15 min)
 *
 * DEMO MODE
 * ---------
 * With no token configured the endpoint serves the sample posts at the bottom
 * of this file, flagged `demo: true`, so the whole feature is visible and
 * testable before the client has connected anything. The UI labels that state
 * explicitly — these are illustrative posts, not real ones from any account.
 */

const GRAPH = 'https://graph.facebook.com/v21.0'

/* Serverless instances are reused between invocations, so a module-scope cache
   keeps us far below Meta's rate limits. */
let cache = { at: 0, payload: null }

const ttlMs = () => (Number(process.env.SOCIAL_CACHE_TTL) || 900) * 1000

function isConfigured() {
  return Boolean(
    process.env.META_ACCESS_TOKEN &&
      (process.env.FB_PAGE_ID || process.env.IG_USER_ID)
  )
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

/** Trim a caption to a card-friendly length without cutting mid-word. */
function excerpt(text, max = 220) {
  if (!text) return ''
  const clean = String(text).replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  return clean.slice(0, clean.lastIndexOf(' ', max)).trimEnd() + '…'
}

async function fetchFacebook(token, pageId) {
  const fields = 'id,message,created_time,permalink_url,full_picture'
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
      postedAt: p.created_time
    }))
}

async function fetchInstagram(token, igUserId) {
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp'
  const url = `${GRAPH}/${igUserId}/media?fields=${fields}&limit=8&access_token=${token}`
  const { data = [] } = await getJson(url)
  return data.map((m) => ({
    id: `ig_${m.id}`,
    network: 'instagram',
    text: excerpt(m.caption),
    // Videos expose a still in thumbnail_url; media_url would be the mp4.
    image: m.media_type === 'VIDEO' ? m.thumbnail_url || null : m.media_url || null,
    permalink: m.permalink,
    postedAt: m.timestamp
  }))
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
  const jobs = []
  if (process.env.FB_PAGE_ID) {
    jobs.push(['facebook', fetchFacebook(token, process.env.FB_PAGE_ID)])
  }
  if (process.env.IG_USER_ID) {
    jobs.push(['instagram', fetchInstagram(token, process.env.IG_USER_ID)])
  }

  const settled = await Promise.allSettled(jobs.map(([, p]) => p))

  const posts = []
  const sources = []
  const errors = []

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
    network: 'facebook',
    demo: true,
    text: 'Завършен монтаж на термопомпа въздух-вода в еднофамилна къща. Подменихме стар котел на нафта — отоплението и топлата вода вече се осигуряват от една система.',
    image: '/images/hero/air.jpg',
    permalink: null,
    postedAt: '2026-09-15T09:20:00+0300'
  },
  {
    id: 'demo_2',
    network: 'instagram',
    demo: true,
    text: 'Геотермална инсталация в процес на изграждане. Сондажите са готови, следва свързване на колекторите. #термопомпа #геотермия',
    image: '/images/hero/ground.jpg',
    permalink: null,
    postedAt: '2026-09-11T14:05:00+0300'
  },
  {
    id: 'demo_3',
    network: 'instagram',
    demo: true,
    text: 'Термопомпа вода-вода — най-високата ефективност при подходящи условия на терена.',
    image: '/images/hero/water.jpg',
    permalink: null,
    postedAt: '2026-09-04T11:40:00+0300'
  },
  {
    id: 'demo_4',
    network: 'facebook',
    demo: true,
    text: 'Често ни питат колко ток консумира една термопомпа. Накратко: от 1 kWh електроенергия се получават 3 до 5 kWh топлина. Останалото идва безплатно от околната среда.',
    image: '/images/home/heat-pumps.jpg',
    permalink: null,
    postedAt: '2026-08-28T08:15:00+0300'
  },
  {
    id: 'demo_5',
    network: 'instagram',
    demo: true,
    text: 'Вътрешно тяло, монтирано и пуснато в експлоатация. Компактно решение, което се вписва дори в малко техническо помещение.',
    image: '/images/hero/hawk-panel.jpg',
    permalink: null,
    postedAt: '2026-08-21T16:30:00+0300'
  },
  {
    id: 'demo_6',
    network: 'facebook',
    demo: true,
    text: 'Подготвяме оферти за есенния сезон. Ако планирате подмяна на отоплението преди зимата, сега е моментът за оглед.',
    image: '/images/home/air-eagle-poster.jpg',
    permalink: null,
    postedAt: '2026-08-14T10:00:00+0300'
  }
]
