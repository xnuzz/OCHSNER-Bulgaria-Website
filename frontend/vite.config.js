import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
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
  /*
   * Resolved as absolute file URLs at request time. A literal import specifier
   * would be inlined into the bundled config by esbuild, which then tries to
   * resolve the handlers' own dependencies (nodemailer) from frontend/ instead
   * of the repo root, where they are installed for Vercel.
   */
  const handler = (name) =>
    import(/* @vite-ignore */ new URL(`../api/v1/${name}.js`, import.meta.url).href)

  const routes = {
    '/api/v1/products': () => handler('products'),
    '/api/v1/references': () => handler('references'),
    '/api/v1/contact': () => handler('contact'),
    '/api/v1/partner-applications': () => handler('partner-applications'),
    '/api/v1/social': () => handler('social')
  }

  return {
    name: 'ochsner-dev-api',
    apply: 'serve',
    configResolved(config) {
      /*
       * Mail settings are read from process.env by api/_lib/notify.js, exactly as
       * on Vercel. Loading frontend/.env.local here lets SMTP be tested locally
       * with the real code path. The '' prefix means unprefixed keys are read
       * too — these stay server-side and are never exposed to the browser, which
       * only ever sees VITE_-prefixed values.
       */
      const env = loadEnv(config.mode, config.envDir || process.cwd(), '')
      for (const key of [
        'SMTP_HOST',
        'SMTP_PORT',
        'SMTP_USERNAME',
        'SMTP_PASSWORD',
        'NOTIFY_EMAIL',
        'MAIL_FROM'
      ]) {
        if (env[key] && !process.env[key]) process.env[key] = env[key]
      }
    },
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
