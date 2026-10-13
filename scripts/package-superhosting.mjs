// Builds the static SuperHosting bundle: the Vite site + pre-built catalog JSON +
// the PHP form endpoints + .htaccess (with the security headers from vercel.json).
// Usage: npm run package:superhosting  ->  superhosting.zip, extract into the domain's document root.
import { execSync } from 'node:child_process'
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync, appendFileSync } from 'node:fs'
import { products, references } from '../api/_lib/catalog.js'
import { getSocialPosts } from '../api/_lib/social.js'

const DIST = 'frontend/dist'
const run = (cmd) => execSync(cmd, { stdio: 'inherit' })

run('npm install --prefix frontend')
run('npm run build --prefix frontend')

// GET endpoints become static files. Social: curated posts (or live, if META_ACCESS_TOKEN is set now).
mkdirSync(`${DIST}/api/v1`, { recursive: true })
writeFileSync(`${DIST}/api/v1/products.json`, JSON.stringify(products))
writeFileSync(`${DIST}/api/v1/references.json`, JSON.stringify(references))
writeFileSync(`${DIST}/api/v1/social.json`, JSON.stringify(await getSocialPosts({ limit: 6 })))

cpSync('superhosting', DIST, { recursive: true })

// One source of truth for headers: vercel.json.
const quote = (v) => `"${v.replace(/"/g, '\\"')}"`
const lines = ['', '# Security headers (generated from vercel.json)', '<IfModule mod_headers.c>']
for (const rule of JSON.parse(readFileSync('vercel.json', 'utf8')).headers) {
  const set = rule.headers.map((h) => `  Header always set ${h.key} ${quote(h.value)}`)
  if (rule.source === '/(.*)') lines.push(...set)
  else lines.push(`  <If "%{REQUEST_URI} =~ m#^${rule.source.replace('(.*)', '')}#">`, ...set.map((s) => '  ' + s), '  </If>')
}
lines.push('</IfModule>', '')
appendFileSync(`${DIST}/.htaccess`, lines.join('\n'))

rmSync('superhosting.zip', { force: true })
const tar = process.platform === 'win32' ? `"${process.env.SystemRoot}\\System32\\tar.exe"` : 'tar'
run(`${tar} -a -cf superhosting.zip -C ${DIST} .`)
console.log('\nsuperhosting.zip ready - extract it into public_html/ochsner.bg/public')
