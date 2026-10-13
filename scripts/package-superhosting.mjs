// Builds the frontend and zips everything SuperHosting needs into superhosting.zip.
// Usage: npm run package:superhosting   (Windows: uses the built-in bsdtar to write the zip)
import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'

const run = (cmd) => execSync(cmd, { stdio: 'inherit' })

run('npm install --prefix frontend')
run('npm run build --prefix frontend')
rmSync('superhosting.zip', { force: true })
const tar = process.platform === 'win32' ? `"${process.env.SystemRoot}\\System32\\tar.exe"` : 'tar'
run(`${tar} -a -cf superhosting.zip app.cjs server.js package.json package-lock.json vercel.json api frontend/dist`)
console.log('\nsuperhosting.zip ready - upload and extract it into the Node.js app root.')
