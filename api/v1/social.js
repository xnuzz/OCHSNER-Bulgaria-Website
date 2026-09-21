import { getSocialPosts } from '../_lib/social.js'
import { methodNotAllowed, sendJson } from '../_lib/http.js'

/*
 * GET /api/v1/social
 *
 *   ?limit=6      how many posts to return (1-12)
 *   ?refresh=1    bypass the server-side cache (useful after publishing)
 *
 * Never fails the page: if Meta is unreachable or misconfigured the handler
 * still answers 200 with whatever it has, so the section degrades quietly
 * instead of rendering an error to a visitor.
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET')

  const url = new URL(req.url, 'http://localhost')
  const limit = Math.min(Math.max(Number(url.searchParams.get('limit')) || 6, 1), 12)
  const force = url.searchParams.get('refresh') === '1'

  try {
    const result = await getSocialPosts({ limit, force })

    // Demo content is static, so it can sit in the CDN far longer than live
    // posts, which should refresh a few times an hour.
    res.setHeader(
      'Cache-Control',
      result.demo
        ? 's-maxage=86400, stale-while-revalidate=604800'
        : 's-maxage=900, stale-while-revalidate=3600'
    )
    sendJson(res, 200, result)
  } catch (e) {
    // Should not happen — getSocialPosts already isolates per-network failures.
    sendJson(res, 200, { demo: false, posts: [], sources: [], errors: [{ message: e.message }] })
  }
}
