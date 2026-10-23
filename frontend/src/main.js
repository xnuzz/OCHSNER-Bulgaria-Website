import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { DEFAULT_LOCALE, setLocale } from './i18n'

import './assets/styles/tokens.css'
import './assets/styles/base.css'

// Lets CSS distinguish a JS-enabled render (used by the scroll-reveal styles).
document.documentElement.classList.add('js')

setLocale(DEFAULT_LOCALE)

/*
 * The page arrives prerendered (prerender.js) and mount() replaces that markup.
 * Waiting for the lazy route component means it is swapped for the same page,
 * not for an empty <main> while the chunk loads.
 */
const app = createApp(App).use(router)
// A failed first navigation (e.g. a chunk that did not load) leaves the static page in place.
router.isReady().then(() => app.mount('#app'), console.error)
