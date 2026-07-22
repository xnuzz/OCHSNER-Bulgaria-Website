/*
 * Notification for form submissions.
 *
 * Vercel functions are stateless, so there is no database here — submissions are
 * always logged (visible under the deployment's Function Logs). If the following
 * environment variables are set, the submission is also emailed via Resend
 * (https://resend.com), which needs no npm package — a plain fetch to their API:
 *
 *   RESEND_API_KEY   your Resend API key
 *   NOTIFY_TO        recipient address (the representative's inbox)
 *   NOTIFY_FROM      verified sender address (optional; defaults to onboarding@resend.dev)
 *
 * Without them, the function still works and returns success — the log is the
 * record. Wire a real database (Vercel Postgres / Neon) later for persistence.
 */
export async function notify({ subject, lines }) {
  const body = lines.join('\n')
  console.log(`[form] ${subject}\n${body}`)

  const key = process.env.RESEND_API_KEY
  const to = process.env.NOTIFY_TO
  if (!key || !to) return

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: process.env.NOTIFY_FROM || 'OCHSNER сайт <onboarding@resend.dev>',
        to: [to],
        subject,
        text: body
      })
    })
    if (!res.ok) {
      console.error('[notify] Resend responded', res.status, await res.text())
    }
  } catch (err) {
    // Never let a mail failure turn into a 500 for the visitor.
    console.error('[notify] email failed', err)
  }
}
