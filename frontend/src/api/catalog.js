import { ref, shallowRef } from 'vue'
import client from './client.js'

/**
 * Products are the same for every visitor and change rarely, so the first
 * successful response is cached in module scope for the life of the page.
 */
const productsCache = shallowRef(null)
let inFlight = null

export function fetchProducts() {
  if (productsCache.value) return Promise.resolve(productsCache.value)
  if (inFlight) return inFlight

  inFlight = client
    .get('/products')
    .then((response) => {
      productsCache.value = response.data
      return response.data
    })
    .finally(() => {
      inFlight = null
    })

  return inFlight
}

export function fetchReferences() {
  return client.get('/references').then((response) => response.data)
}

/**
 * Latest Facebook + Instagram posts.
 *
 * Returns the whole envelope ({ posts, demo, sources }) rather than just the
 * array, because the UI needs the `demo` flag to label sample content.
 */
export function fetchSocialPosts(limit = 6) {
  return client.get(`/social?limit=${limit}`).then((response) => response.data)
}

export function submitContact(payload) {
  return client.post('/contact', payload).then((response) => response.data)
}

export function submitPartnerApplication(payload) {
  return client.post('/partner-applications', payload).then((response) => response.data)
}

/**
 * Small async-resource helper: `data`, `loading`, `error` plus a `load` trigger.
 * Keeps every view's fetch handling identical without pulling in Pinia.
 */
export function useAsyncData(loader) {
  const data = ref(null)
  const loading = ref(false)
  const failed = ref(false)

  async function load() {
    loading.value = true
    failed.value = false
    try {
      data.value = await loader()
    } catch (e) {
      failed.value = true
    } finally {
      loading.value = false
    }
  }

  return { data, loading, failed, load }
}
