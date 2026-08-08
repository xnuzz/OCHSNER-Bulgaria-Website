import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

/**
 * Serves /api/v1 during `npm run dev` by running the very same serverless
 * handlers that Vercel runs in production (../api/v1/*.js), so the dev server is
 * self-sufficient: `npm run dev` alone gives you products, references and both
 * forms, with identical JSON and identical Bulgarian validation messages.
 *
 * The Spring Boot app remains the real backend. Set VITE_USE_BACKEND=1 to skip
 * this and proxy to http://localhost:8080 instead — that path needs JDK 21.
 */
function devApi() {
  const routes = {
    '/api/v1/products': () => import('../api/v1/products.js'),
    '/api/v1/references': () => import('../api/v1/references.js'),
    '/api/v1/contact': () => import('../api/v1/contact.js'),
    '/api/v1/partner-applications': () => import('../api/v1/partner-applications.js')
  }

  return {
    name: 'ochsner-dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const path = (req.url || '').split('?')[0]
        const load = routes[path]
        if (!load) return next()

        try {
          // Vercel hands the handler a parsed body and an Express-ish response.
          req.body = await readJson(req)
          res.status = (code) => {
            res.statusCode = code
            return res
          }
          const mod = await load()
          await mod.default(req, res)
        } catch (err) {
          server.config.logger.error(`[dev-api] ${path}: ${err.stack || err}`)
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json; charset=utf-8')
          res.end(JSON.stringify({ status: 500, message: 'Възникна грешка.', fieldErrors: {} }))
        }
      })
    }
  }
}

function readJson(req) {
  if (req.method !== 'POST' && req.method !== 'PUT') return Promise.resolve({})
  return new Promise((resolve) => {
    let raw = ''
    req.on('data', (chunk) => (raw += chunk))
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch {
        resolve({})
      }
    })
  })
}

const useBackend = process.env.VITE_USE_BACKEND === '1'

export default defineConfig({
  plugins: [vue(), ...(useBackend ? [] : [devApi()])],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    // Only used with VITE_USE_BACKEND=1. Proxying keeps dev requests same-origin;
    // the backend CORS config covers the case where the SPA is served elsewhere.
    proxy: useBackend
      ? {
          '/api': {
            target: 'http://localhost:8080',
            changeOrigin: true
          }
        }
      : undefined
  },
  build: {
    target: 'es2020',
    cssCodeSplit: true
  }
})
