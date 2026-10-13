/*
 * Abuse protection for the public form endpoints.
 *
 * Without this, anyone can POST the contact form in a loop. With SMTP
 * configured that floods the representative's mailbox and will get the sending
 * account rate-limited or suspended by the provider.
 *
 * HONEST LIMITATION
 * -----------------
 * Vercel functions are stateless and horizontally scaled, so this counter lives
 * in the memory of ONE warm instance. It reliably stops the realistic case — a
 * script hammering from a single address — but a distributed flood across many
 * instances can slip past. Moving the counters to Vercel KV / Upstash Redis is
 * the fix if abuse ever becomes real; the call sites here would not change.
 *
 * Two layers:
 *   perIp    stops one source spamming
 *   global   caps total submissions per window, so a distributed flood still
 *            cannot empty a mail quota in one go
 */

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const MAX_PER_IP = 5
const MAX_GLOBAL = 60

const hits = new Map() // key -> number[] (timestamps)

/** Drop timestamps outside the window, and keys that have gone quiet. */
function prune(now) {
  for (const [key, stamps] of hits) {
    const live = stamps.filter((t) => now - t < WINDOW_MS)
    if (live.length) hits.set(key, live)
    else hits.delete(key)
  }
}

/**
 * Vercel puts the real client address first in x-forwarded-for. The header is
 * attacker-controlled in principle, but on Vercel it is rewritten at the edge,
 * so the first entry is trustworthy here.
 *
 * Anywhere else (server.js behind SuperHosting's Apache/Passenger) the client
 * controls the first entry, so take the last one: the address our own proxy
 * appended, which cannot be forged.
 */
export function clientIp(req) {
  const raw = req.headers?.['x-forwarded-for']
  const fwd = (Array.isArray(raw) ? raw.join(',') : raw || '').split(',').map((s) => s.trim()).filter(Boolean)
  if (fwd.length) return process.env.VERCEL ? fwd[0] : fwd[fwd.length - 1]
  return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown'
}

/**
 * Records an attempt and reports whether it should be allowed.
 * @returns {{ ok: boolean, retryAfter: number }} retryAfter in seconds
 */
export function rateLimit(req) {
  const now = Date.now()
  prune(now)

  const ip = clientIp(req)
  const ipKey = `ip:${ip}`
  const ipHits = hits.get(ipKey) || []
  const globalHits = hits.get('global') || []

  const overIp = ipHits.length >= MAX_PER_IP
  const overGlobal = globalHits.length >= MAX_GLOBAL

  if (overIp || overGlobal) {
    const oldest = overIp ? ipHits[0] : globalHits[0]
    return { ok: false, retryAfter: Math.max(1, Math.ceil((WINDOW_MS - (now - oldest)) / 1000)) }
  }

  hits.set(ipKey, [...ipHits, now])
  hits.set('global', [...globalHits, now])
  return { ok: true, retryAfter: 0 }
}

/** 429 body, shaped like the validation errors so the client renders it the same way. */
export function tooManyRequests(res, retryAfter) {
  res.setHeader('Retry-After', String(retryAfter))
  res.status(429).setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(
    JSON.stringify({
      status: 429,
      message:
        'Получихме твърде много заявки от това устройство. Моля, опитайте отново след няколко минути.',
      fieldErrors: {},
      timestamp: new Date().toISOString()
    })
  )
}
