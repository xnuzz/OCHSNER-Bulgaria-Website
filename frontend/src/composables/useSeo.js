import { useSSRContext } from 'vue'

const SITE_URL = import.meta.env.VITE_SITE_URL || 'https://ochsner.bg'

function upsertMeta(attr, key, content) {
  if (!content) return
  let tag = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute(attr, key)
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

function upsertCanonical(path) {
  let link = document.head.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', `${SITE_URL}${path}`)
}

/* Cyrillic is wide: ~140 characters is what fits a search snippet. Cut on a word, not mid-word. */
function clip(text, max = 140) {
  if (!text || text.length <= max) return text
  const cut = text.lastIndexOf(' ', max - 1)
  return text.slice(0, cut > 0 ? cut : max - 1).replace(/[\s,.;:—–-]+$/, '') + '…'
}

/**
 * Per-route title, description, canonical and Open Graph tags.
 * A hand-rolled 20-line helper beats adding a head-management dependency for a
 * seven-page site. During the build-time prerender (prerender.js) there is no
 * document, so the tags are handed to the SSR context and written into the HTML.
 */
export function useSeo({ title, description, path, image = '/og-image.jpg' }) {
  description = clip(description)
  if (import.meta.env.SSR) {
    useSSRContext().seo = { title, description, url: path && `${SITE_URL}${path}`, image: `${SITE_URL}${image}` }
    return
  }
  path ??= window.location.pathname
  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', `${SITE_URL}${path}`)
  upsertMeta('property', 'og:image', `${SITE_URL}${image}`)
  upsertCanonical(path)
}
