# Deploying to SuperHosting (cPanel)

`server.js` runs the same site Vercel does: static `frontend/dist`, the `/api/v1/*`
handlers, the SPA fallback and the security headers from `vercel.json`. The Vercel setup
keeps working unchanged (`.vercelignore` keeps `server.js` out of it).

## 1. Build the bundle (locally)

```bash
npm run package:superhosting
```

This creates `superhosting.zip` (~55 MB, mostly video), which contains `server.js`, `package.json`,
`package-lock.json`, `vercel.json`, `api/` and `frontend/dist/`.

## 2. Create the Node.js app

In cPanel, open **Setup Node.js App** → **Create Application** and set:

| Field | Value |
| --- | --- |
| Node.js version | 20 or newer |
| Application mode | Production |
| Application root | e.g. `ochsner` (a folder in your home directory, **not** `public_html`) |
| Application URL | your domain |
| Application startup file | `server.js` |

## 3. Upload

In **File Manager**, open the application root, upload `superhosting.zip` and choose
**Extract**. Delete the zip afterwards. Then go back to Setup Node.js App and click
**Run NPM Install** (this installs `nodemailer`).

## 4. Environment variables

Add these in the app's **Environment variables** section. Copy the values from Vercel:
Project → Settings → Environment Variables.

| Variable | Notes |
| --- | --- |
| `SMTP_HOST` | Without it, form submissions are only logged and no mail is sent. With a SuperHosting mailbox, use the mail server shown under cPanel → Email Accounts → Connect Devices. |
| `SMTP_PORT` | 465 (SSL) or 587 |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | mailbox login |
| `NOTIFY_EMAIL` | where submissions go |
| `MAIL_FROM` | sender; must be a mailbox on the same domain, or the mail lands in spam |
| `META_ACCESS_TOKEN`, `FB_PAGE_ID`, `IG_USER_ID`, `IG_DISCOVER_USERNAME`, `SOCIAL_CACHE_TTL` | social feed, see [social-feed-setup.md](social-feed-setup.md) |

Click **Save**, then **Restart**.

## 5. HTTPS

1. cPanel → **SSL/TLS Status** → run AutoSSL for the domain.
2. cPanel → **Domains** → turn on **Force HTTPS Redirect**.

Do this *before* sending real traffic: the site sends HSTS, so browsers that visit
over HTTPS will refuse plain HTTP afterwards.

## 6. Test before switching DNS

Open the temporary URL, or add your SuperHosting server IP to your local `hosts` file, then check:

- the home page and a deep link such as `/kontakti` (reloading must not 404)
- the products page (`/api/v1/products`)
- the contact and partner forms: the notification email arrives
- the social section and a video

## 7. Move the domain

1. Lower the DNS TTL a day ahead.
2. Point the A record, or the nameservers, to SuperHosting.
3. Once it resolves, remove the domain from the Vercel project. Keep the Vercel project
   for a week as a fallback.

## Updating later

Run `npm run package:superhosting` again, upload and extract the zip over the old files,
then click **Restart** in Setup Node.js App. Run NPM Install again only when `package.json` changed.

## Troubleshooting

- **Logs:** look for `stderr.log` in the app root, or the log path shown in Setup Node.js App.
- **503 / app won't start:** the Node version is below 20, or NPM Install wasn't run.
- **Forms answer 201 but no mail arrives:** check the `SMTP_*` variables. A missing
  `SMTP_HOST` means mail is only logged.
