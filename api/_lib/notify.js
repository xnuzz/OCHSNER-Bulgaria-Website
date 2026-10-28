/*
 * Notification for form submissions — plain SMTP, no third-party mail service.
 *
 * Deliberately uses the same environment variables as the Spring backend
 * (config/MailConfig.java, application-prod.yml) so one mailbox configures both
 * deployments identically:
 *
 *   SMTP_HOST       mail server hostname        (required to send)
 *   SMTP_PORT       defaults to 587
 *   SMTP_USERNAME   mailbox login
 *   SMTP_PASSWORD   mailbox password
 *   NOTIFY_EMAIL    address that receives submissions (default office@omnia-contractors.com)
 *   MAIL_FROM       envelope sender             (default no-reply@ochsner.bg)
 *
 * With no SMTP_HOST set, the submission is written to the log instead of being
 * sent — the same fallback the Spring app uses (LoggingNotificationMailer), so
 * local development and preview deployments never need credentials.
 *
 * Port 465 uses implicit TLS; anything else (587, 25) upgrades via STARTTLS.
 *
 * Vercel functions are stateless, so the mail is the only record. Add a database
 * in the two POST handlers before relying on this for real leads.
 */
import nodemailer from 'nodemailer'

let transport

function getTransport() {
  if (transport) return transport
  const port = Number(process.env.SMTP_PORT || 587)
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: process.env.SMTP_USERNAME
      ? { user: process.env.SMTP_USERNAME, pass: process.env.SMTP_PASSWORD }
      : undefined,
    // Keeps a stuck server from holding the function open to its timeout.
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000
  })
  return transport
}

/**
 * @param {object}   args
 * @param {string}   args.subject
 * @param {string[]} args.lines     message body, one entry per line
 * @param {string}   [args.replyTo] the submitter's address, so a reply reaches them
 */
export async function notify({ subject, lines, replyTo }) {
  const body = lines.join('\n')

  if (!process.env.SMTP_HOST) {
    console.log(`[MAIL — not sent, no SMTP host configured]\n${subject}\n${body}`)
    return
  }

  try {
    await getTransport().sendMail({
      from: process.env.MAIL_FROM || 'no-reply@ochsner.bg',
      to: process.env.NOTIFY_EMAIL || 'office@omnia-contractors.com',
      replyTo: replyTo || undefined,
      subject,
      text: body
    })
    console.log(`[MAIL — sent] ${subject}`)
  } catch (err) {
    // A mail failure must never turn into a 500 for the visitor, but the
    // submission itself must not be lost — log it so it stays recoverable.
    console.error(`[MAIL — FAILED] ${err.message}\n${subject}\n${body}`)
  }
}
