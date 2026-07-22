import { references } from '../_lib/catalog.js'
import { methodNotAllowed, sendJson } from '../_lib/http.js'

// GET /api/v1/references
export default function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET')
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  sendJson(res, 200, references)
}
