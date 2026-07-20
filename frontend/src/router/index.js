import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

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
    path: '/zashto-termopompa',
    name: 'why',
    component: () => import('@/views/WhyHeatPumpView.vue')
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
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue')
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { top: 0 }
  }
})
