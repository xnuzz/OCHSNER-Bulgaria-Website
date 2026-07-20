import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { DEFAULT_LOCALE, setLocale } from './i18n'

import './assets/styles/tokens.css'
import './assets/styles/base.css'

// Lets CSS distinguish a JS-enabled render (used by the scroll-reveal styles).
document.documentElement.classList.add('js')

setLocale(DEFAULT_LOCALE)

createApp(App).use(router).mount('#app')
