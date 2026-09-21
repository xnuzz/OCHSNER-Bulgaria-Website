#!/usr/bin/env node
/*
 * Social feed connectivity check.
 *
 *   node scripts/social-check.mjs
 *   node scripts/social-check.mjs ochsner_waermepumpen   # discovery target
 *
 * Reads the same env vars the site uses (from the shell, or frontend/.env.local)
 * and reports exactly what Meta returns, so a token can be validated without
 * deploying. Prints post counts and the newest caption per source; on failure it
 * prints Meta's own error message, which is usually self-explanatory
 * ("Error validating access token: Session has expired...").
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const GRAPH = 'https://graph.facebook.com/v21.0'

// Load frontend/.env.local if present, without adding a dotenv dependency.
try {
  const envFile = readFileSync(resolve(here, '../frontend/.env.local'), 'utf8')
  for (const line of envFile.split('\n')) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '')
  }
  console.log('· loaded frontend/.env.local')
} catch {
  console.log('· no frontend/.env.local (using shell env only)')
}

const token = process.env.META_ACCESS_TOKEN
const fbPage = process.env.FB_PAGE_ID
const igUser = process.env.IG_USER_ID
const discover = process.argv[2] || process.env.IG_DISCOVER_USERNAME

if (!token) {
  console.error(`
✗ META_ACCESS_TOKEN is not set — nothing to check.

  Without it the site serves clearly-labelled sample posts, which is the
  correct behaviour for a preview. To pull real posts you need a long-lived
  Page access token for accounts you control. See frontend/.env.local.example.
`)
  process.exit(1)
}

async function call(label, url) {
  process.stdout.write(`\n→ ${label}\n`)
  try {
    const res = await fetch(url)
    const body = await res.json()
    if (body.error) {
      console.log(`  ✗ ${body.error.message}`)
      return null
    }
    return body
  } catch (e) {
    console.log(`  ✗ network error: ${e.message}`)
    return null
  }
}

const newest = (items, capField) => {
  if (!items?.length) return '  (no posts returned)'
  const c = (items[0][capField] || '').replace(/\s+/g, ' ').slice(0, 70)
  return `  ✓ ${items.length} post(s); newest: ${c || '(no caption)'}…`
}

// 1. Is the token itself valid?
const me = await call('token identity  GET /me', `${GRAPH}/me?access_token=${token}`)
if (me) console.log(`  ✓ token belongs to: ${me.name || me.id}`)

// 2. Facebook Page posts
if (fbPage) {
  const r = await call(
    `facebook posts  GET /${fbPage}/posts`,
    `${GRAPH}/${fbPage}/posts?fields=message,created_time,permalink_url,full_picture&limit=5&access_token=${token}`
  )
  if (r) console.log(newest(r.data, 'message'))
} else {
  console.log('\n→ facebook posts\n  – skipped (FB_PAGE_ID not set)')
}

// 3. Own Instagram media
if (igUser) {
  const r = await call(
    `instagram media  GET /${igUser}/media`,
    `${GRAPH}/${igUser}/media?fields=caption,media_type,media_url,permalink,timestamp&limit=5&access_token=${token}`
  )
  if (r) console.log(newest(r.data, 'caption'))
} else {
  console.log('\n→ instagram media\n  – skipped (IG_USER_ID not set)')
}

// 4. Another public Business account, via business_discovery
if (igUser && discover) {
  const r = await call(
    `business_discovery  @${discover}`,
    `${GRAPH}/${igUser}?fields=business_discovery.username(${encodeURIComponent(discover)})` +
      `{username,media.limit(5){caption,permalink,timestamp}}&access_token=${token}`
  )
  if (r?.business_discovery) {
    console.log(`  ✓ @${r.business_discovery.username}`)
    console.log(newest(r.business_discovery.media?.data, 'caption'))
  } else if (r) {
    console.log('  ✗ no business_discovery in response — target is likely a')
    console.log('    personal account (only Business/Creator accounts are readable)')
  }
} else if (!discover) {
  console.log('\n→ business_discovery\n  – skipped (pass a username as an argument)')
}

console.log('\nDone.\n')
