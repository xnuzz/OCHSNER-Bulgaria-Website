import { products } from '../_lib/catalog.js'
import { methodNotAllowed, sendJson } from '../_lib/http.js'

// GET /api/v1/products
export default function handler(req, res) {
  if (req.method !== 'GET') return methodNotAllowed(res, 'GET')
  // Cache at the edge: catalog changes rarely.
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400')
  sendJson(res, 200, products)
}
