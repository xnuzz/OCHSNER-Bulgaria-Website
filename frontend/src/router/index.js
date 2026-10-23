import { createMemoryHistory, createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import { categories } from '@/i18n/bg/categories.js'
import { models, withdrawnSeries } from '@/i18n/bg/models.js'
import { variants } from '@/i18n/bg/variants.js'

/**
 * Only the home view is bundled eagerly — every other route is code-split so the
 * first paint on mobile stays small.
 */
const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/produkti',
    name: 'products',
    component: () => import('@/views/ProductsView.vue')
  },
  {
    /* One page per category, mirroring the corporate product pages. */
    path: '/produkti/:slug',
    name: 'product-category',
    component: () => import('@/views/ProductCategoryView.vue'),
    /* An unknown slug would otherwise render an empty page. */
    beforeEnter: (to) => (categories[to.params.slug] ? true : { name: 'products' })
  },
  {
    /* Individual model page, mirroring the corporate product pages. */
    path: '/produkti/:slug/:model',
    name: 'product-model',
    component: () => import('@/views/ProductModelView.vue'),
    beforeEnter: (to) => {
      if (withdrawnSeries.has(to.params.model)) return { name: 'products' }
      const m = models[to.params.model]
      if (!m) return { name: 'products' }
      // Keep the URL honest: the category in the path must own the model.
      return m.category === to.params.slug ? true : { name: 'product-model', params: { slug: m.category, model: to.params.model } }
    }
  },
  {
    /* Individual unit page, as on the reference's numbered product URLs. */
    path: '/produkti/:slug/:model/:variant',
    name: 'product-variant',
    component: () => import('@/views/ProductVariantView.vue'),
    beforeEnter: (to) => {
      const v = variants[to.params.variant]
      /* A retired unit URL still indexed by search engines lands on its series. */
      if (!v && models[to.params.model] && !withdrawnSeries.has(to.params.model)) {
        return { name: 'product-model', params: { slug: models[to.params.model].category, model: to.params.model } }
      }
      if (!v || withdrawnSeries.has(v.model)) return { name: 'products' }
      const m = models[v.model]
      // Keep the URL honest: category and series in the path must own the unit.
      return v.model === to.params.model && m && m.category === to.params.slug
        ? true
        : { name: 'product-variant', params: { slug: m.category, model: v.model, variant: to.params.variant } }
    }
  },
  {
    path: '/za-nas',
    name: 'about',
    component: () => import('@/views/AboutView.vue')
  },
  {
    path: '/referencii',
    name: 'references',
    component: () => import('@/views/ReferencesView.vue')
  },
  {
    path: '/stani-partnyor',
    name: 'partner',
    component: () => import('@/views/PartnerView.vue')
  },
  {
    path: '/kontakti',
    name: 'contact',
    component: () => import('@/views/ContactView.vue')
  },
  {
    path: '/tsentar-za-izteglyane',
    name: 'downloads',
    component: () => import('@/views/DownloadView.vue')
  },
  {
    path: '/politika-poveritelnost',
    name: 'legal-privacy',
    component: () => import('@/views/LegalView.vue'),
    props: { doc: 'privacy', path: '/politika-poveritelnost' }
  },
  {
    path: '/obshti-usloviya',
    name: 'legal-terms',
    component: () => import('@/views/LegalView.vue'),
    props: { doc: 'terms', path: '/obshti-usloviya' }
  },
  {
    path: '/politika-biskvitki',
    name: 'legal-cookies',
    component: () => import('@/views/LegalView.vue'),
    props: { doc: 'cookies', path: '/politika-biskvitki' }
  },
  /* Retired page, still indexed by search engines: its content now lives on the home page. */
  { path: '/zashto-termopompa', redirect: { name: 'home', hash: '#kak-raboti' } },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

export default createRouter({
  // The build-time prerender (entry-server.js) runs in Node, which has no window.
  history: import.meta.env.SSR ? createMemoryHistory() : createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})
