# Deploying to SuperHosting (cPanel)

On SuperHosting the site runs as plain files on Apache. There is no Node.js app:

- the built Vue site (`frontend/dist`)
- `/api/v1/products`, `/references` and `/social` as pre-built JSON (taken from `api/_lib`)
- `/api/v1/contact`, `/partner-applications` and `/newsletter` as PHP (`superhosting/api/v1/*.php`).
  These have the same validation and responses as the Vercel functions, and send mail
  with PHP `mail()`, so no SMTP password is needed.
- `.htaccess`: HTTPS redirect, API routes, SPA fallback, caching, and the security
  headers generated from `vercel.json`

The Vercel deployment is unaffected (`.vercelignore`).

## 1. Build

```bash
npm run package:superhosting
```

This creates `superhosting.zip`. The zip has **no** top-level folder: `index.html` and
`.htaccess` sit directly at its root.

## 2. Upload

The document root of ochsner.bg is `public_html/ochsner.bg/public`.

1. In cPanel → **Setup Node.js App**, delete any old ochsner app (**Destroy**). It
   rewrites `.htaccess` in the document root.
2. In File Manager, open `public_html/ochsner.bg/public` (turn on **Show Hidden Files**).
   Delete everything except `.well-known/`.
3. Upload `superhosting.zip` there, then **Extract** into `/public_html/ochsner.bg/public`.
   Delete the zip afterwards.

## 3. Check

Check each of these in the browser:

- https://ochsner.bg and a deep link, for example `/kontakti` (a reload must not 404)
- https://ochsner.bg/api/v1/products returns JSON
- the contact form arrives at `info@ochsner.bg`. Check spam the first time.

Recipient and sender addresses are set at the top of `superhosting/api/v1/_lib.php`
(`NOTIFY_EMAIL`, `MAIL_FROM`).

## Updating later

Run `npm run package:superhosting` again. Upload the zip and extract it over the old files.

## Notes

- **Social feed:** it is a static snapshot taken at build time. That means curated posts,
  or live posts if `META_ACCESS_TOKEN` is set in your shell when you build. Rebuild to refresh it.
- **Form problems:** failed mails are written to the PHP `error_log` in the same
  folder, together with the full submission, so no lead is lost.

## Automatic deploys (like Vercel)

`.github/workflows/deploy-superhosting.yml` builds the site on every push to `main` and
uploads only the changed files over FTPS. The Actions tab shows each run.

One-time setup:

1. In cPanel → **FTP Accounts**, create an account, for example `deploy@ochsner.bg`. Set its
   **Directory** to `public_html/ochsner.bg/public`, so it can reach nothing else on the
   shared account.
2. On GitHub → repo → **Settings → Secrets and variables → Actions**, add these secrets:
   - `FTP_SERVER`: the FTP server from cPanel → FTP Accounts → *Configure FTP Client*
   - `FTP_USERNAME`: `deploy@ochsner.bg`
   - `FTP_PASSWORD`: that account's password
   - `META_ACCESS_TOKEN` (optional): live social posts
3. Go to **Actions → Deploy to SuperHosting → Run workflow** to deploy for the first time.

The action keeps `.ftp-deploy-sync-state.json` in the document root to know what changed.
Don't delete it, or the next run re-uploads everything.
