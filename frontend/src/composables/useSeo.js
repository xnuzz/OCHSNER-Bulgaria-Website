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

/**
 * Per-route title, description, canonical and Open Graph tags.
 * A hand-rolled 20-line helper beats adding a head-management dependency for a
 * seven-page site; if the site ever goes SSR this is the single place to swap out.
 */
export function useSeo({ title, description, path = window.location.pathname, image = '/og-image.jpg' }) {
  document.title = title
  upsertMeta('name', 'description', description)
  upsertMeta('property', 'og:title', title)
  upsertMeta('property', 'og:description', description)
  upsertMeta('property', 'og:url', `${SITE_URL}${path}`)
  upsertMeta('property', 'og:image', `${SITE_URL}${image}`)
  upsertCanonical(path)
}
