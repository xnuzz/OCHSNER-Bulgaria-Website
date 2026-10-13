/*
 * Standalone Node server for SuperHosting (cPanel "Setup Node.js App" / Passenger).
 * Does what Vercel does for us: serves frontend/dist, runs the /api/v1 handlers,
 * falls back to index.html for SPA routes and applies the headers in vercel.json.
 * No dependencies beyond what /api already uses.
 */
import http from 'node:http'
import { createReadStream, readFileSync, readdirSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.dirname(fileURLToPath(import.meta.url))
const DIST = path.join(ROOT, 'frontend', 'dist')
const API_DIR = path.join(ROOT, 'api', 'v1')
const MAX_BODY = 64 * 1024

// Security headers live in vercel.json so both hosts send exactly the same set.
const headerRules = JSON.parse(readFileSync(path.join(ROOT, 'vercel.json'), 'utf8')).headers
  .map((r) => ({ re: new RegExp('^' + r.source.replace('(.*)', '.*') + '$'), headers: r.headers }))

const handlers = {}
for (const f of readdirSync(API_DIR)) {
  if (f.endsWith('.js')) handlers[f.slice(0, -3)] = (await import(pathToFileURL(path.join(API_DIR, f)))).default
}

const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.ico': 'image/x-icon',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.mp4': 'video/mp4', '.webm': 'video/webm', '.pdf': 'application/pdf',
  '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml', '.webmanifest': 'application/manifest+json'
}

function sendError(res, status, message) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify({ status, message, fieldErrors: {}, timestamp: new Date().toISOString() }))
}

function readRaw(req) {
  return new Promise((resolve, reject) => {
    let size = 0
    const chunks = []
    req.on('data', (c) => {
      size += c.length
      if (size > MAX_BODY) reject(new Error('too large'))
      else chunks.push(c)
    })
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')))
    req.on('error', reject)
  })
}

async function serveApi(req, res, name) {
  const handler = handlers[name]
  if (!handler) return sendError(res, 404, 'Няма такъв ресурс.')
  // Vercel-style helpers the handlers rely on.
  res.status = (code) => { res.statusCode = code; return res }
  try {
    req.body = ['POST', 'PUT', 'PATCH'].includes(req.method) ? await readRaw(req) : undefined
  } catch {
    // Answer first, then drop the socket so the rest of the upload is never read.
    res.setHeader('Connection', 'close')
    res.on('finish', () => req.destroy())
    return sendError(res, 413, 'Заявката е твърде голяма.')
  }
  try {
    await handler(req, res)
  } catch (err) {
    console.error(`[api/${name}]`, err)
    if (!res.headersSent) sendError(res, 500, 'Възникна грешка. Моля, опитайте отново.')
  }
}

async function serveStatic(req, res, pathname) {
  if (req.method !== 'GET' && req.method !== 'HEAD') return sendError(res, 405, 'Методът не е разрешен.')

  let file = path.join(DIST, path.normalize(pathname))
  if (!file.startsWith(DIST)) return sendError(res, 400, 'Невалиден адрес.')
  let info = await stat(file).catch(() => null)
  if (info?.isDirectory()) {
    file = path.join(file, 'index.html')
    info = await stat(file).catch(() => null)
  }
  if (!info?.isFile()) {
    // SPA route: let the client router handle it (same as the vercel.json rewrite).
    file = path.join(DIST, 'index.html')
    info = await stat(file)
  }

  const ext = path.extname(file).toLowerCase()
  res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
  res.setHeader('Cache-Control', ext === '.html' ? 'no-cache'
    : pathname.startsWith('/assets/') ? 'public, max-age=31536000, immutable' // Vite hashes these
      : 'public, max-age=86400')
  res.setHeader('Accept-Ranges', 'bytes')

  // Single byte range, which Safari needs to play the <video> files.
  const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '')
  let start = 0
  let end = info.size - 1
  if (m && (m[1] || m[2])) {
    start = m[1] ? Number(m[1]) : Math.max(info.size - Number(m[2]), 0)
    end = m[1] && m[2] ? Math.min(Number(m[2]), info.size - 1) : end
    if (start > end) {
      res.statusCode = 416
      res.setHeader('Content-Range', `bytes */${info.size}`)
      return res.end()
    }
    res.statusCode = 206
    res.setHeader('Content-Range', `bytes ${start}-${end}/${info.size}`)
  }
  res.setHeader('Content-Length', end - start + 1)
  if (req.method === 'HEAD') return res.end()
  createReadStream(file, { start, end }).pipe(res)
}

http.createServer(async (req, res) => {
  let pathname
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname)
  } catch {
    return sendError(res, 400, 'Невалиден адрес.')
  }
  for (const rule of headerRules) {
    if (rule.re.test(pathname)) for (const h of rule.headers) res.setHeader(h.key, h.value)
  }
  try {
    const api = /^\/api\/v1\/([a-z-]+)\/?$/.exec(pathname)
    if (api) return await serveApi(req, res, api[1])
    if (pathname.startsWith('/api/')) return sendError(res, 404, 'Няма такъв ресурс.')
    await serveStatic(req, res, pathname)
  } catch (err) {
    console.error(err)
    if (!res.headersSent) sendError(res, 500, 'Възникна грешка.')
  }
}).listen(process.env.PORT || 3000, () => console.log(`OCHSNER site on :${process.env.PORT || 3000}`))
