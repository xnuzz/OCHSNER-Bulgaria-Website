import { createSSRApp } from 'vue'
import { renderToString } from 'vue/server-renderer'
import App from './App.vue'
import router from './router'
import { primeProducts } from './api/catalog.js'

/**
 * Build-time only (prerender.js): renders one route to HTML so crawlers that do
 * not run JavaScript still get the page's headings, links and meta tags.
 * Routes are rendered one after another, so sharing the router is safe.
 */
export async function render(url, products) {
  primeProducts(products)
  const app = createSSRApp(App).use(router)
  await router.push(url)
  await router.isReady()
  const ctx = {}
  const html = await renderToString(app, ctx)
  return { html, seo: ctx.seo, modules: ctx.modules }
}
