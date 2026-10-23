/*
 * Writes every sitemap URL as real HTML (dist/<path>/index.html) after `vite build`,
 * so search engines, link previews and SEO checkers that do not run JavaScript see
 * each page's own H1, headings, links, title, description and canonical. The client
 * app then mounts over it as before. dist/404.html is the not-found page and the
 * fallback for any other URL, so the router can still redirect retired ones
 * (see .htaccess / vercel.json).
 */
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { products } from '../api/_lib/catalog.js'
import { contactDetails } from './src/i18n/bg/common.js'
import { render } from './dist-ssr/entry-server.js'

const SITE_URL = 'https://ochsner.bg'
const template = readFileSync('dist/index.html', 'utf8')
const manifest = JSON.parse(readFileSync('dist/.vite/ssr-manifest.json', 'utf8'))
const paths = [...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>https:\/\/ochsner\.bg([^<]*)<\/loc>/g)].map((m) => m[1])

const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
// JSON inside <script> must not be able to close the tag.
const json = (data) => JSON.stringify(data).replace(/</g, '\\u003c')

/* Who the business is, for rich results and the knowledge panel. Home page only. */
const business = {
  '@context': 'https://schema.org',
  '@type': 'HVACBusiness',
  name: 'OCHSNER България',
  alternateName: contactDetails.companyName,
  url: `${SITE_URL}/`,
  logo: `${SITE_URL}/ochsner-icon-512.png`,
  image: `${SITE_URL}/og-image.jpg`,
  telephone: contactDetails.phone.replace(/\s/g, ''),
  email: contactDetails.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'ул. „Панорама София“ 5, XS Tower',
    addressLocality: 'София',
    postalCode: '1766',
    addressCountry: 'BG'
  },
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    opens: '09:00',
    closes: '17:00'
  },
  areaServed: 'BG',
  brand: { '@type': 'Brand', name: 'OCHSNER' }
}

/* CSS (and JS) of the components a page used, so it is styled before the app loads. */
function assetLinks(modules) {
  const files = new Set([...modules].flatMap((id) => manifest[id] || []))
  return [...files]
    .filter((file) => !template.includes(file))
    .map((file) =>
      file.endsWith('.css')
        ? `<link rel="stylesheet" href="${file}">`
        : file.endsWith('.js')
          ? `<link rel="modulepreload" crossorigin href="${file}">`
          : ''
    )
    .join('')
}

function page(url, { html, seo, modules = [] }, schema = null) {
  if (!seo?.title) throw new Error(`${url}: no useSeo() call, the page would keep the home page's title`)
  if (!seo.description) throw new Error(`${url}: useSeo() was given no description`)

  const head = [
    `<title>${attr(seo.title)}</title>`,
    `<meta name="description" content="${attr(seo.description)}" />`,
    seo.url && `<link rel="canonical" href="${seo.url}" />`,
    `<meta property="og:title" content="${attr(seo.title)}" />`,
    `<meta property="og:description" content="${attr(seo.description)}" />`,
    seo.url && `<meta property="og:url" content="${seo.url}" />`,
    `<meta property="og:image" content="${seo.image}" />`,
    schema && `<script type="application/ld+json">${json(schema)}</script>`,
    assetLinks(modules)
  ].filter(Boolean)

  return template
    .replace(/<title>.*?<\/title>/s, '')
    .replace(/<meta\s+(?:name="description"|property="og:(?:title|description|image)")[^>]*>/gs, '')
    // Function replacers: page text containing "$'" or "$&" must not be read as a pattern.
    .replace('</head>', () => `  ${head.join('\n    ')}\n  </head>`)
    .replace(
      '<div id="app"></div>',
      () => `<div id="app">${html}</div>\n    <script id="catalog-products" type="application/json">${json(products)}</script>`
    )
}

for (const path of paths) {
  const out = page(path, await render(path, products), path === '/' ? business : null)
  const dir = `dist${path}`.replace(/\/$/, '')
  mkdirSync(dir, { recursive: true })
  writeFileSync(`${dir}/index.html`, out)
}

writeFileSync('dist/404.html', page('/404', await render('/404', products)))

// Build-only inputs; nothing to upload.
rmSync('dist/.vite', { recursive: true, force: true })
console.log(`prerendered ${paths.length} pages + 404.html`)
