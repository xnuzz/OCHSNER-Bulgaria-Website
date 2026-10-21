import { readBody, sendJson, methodNotAllowed, validationError, accepted, checks, collect } from '../_lib/http.js'
import { rateLimit, tooManyRequests } from '../_lib/ratelimit.js'
import { notify } from '../_lib/notify.js'

// POST /api/v1/newsletter — no mailing-list service yet, so the team is told by mail.
export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')

  const limit = rateLimit(req)
  if (!limit.ok) return tooManyRequests(res, limit.retryAfter)

  const b = readBody(req)

  const errors = collect([
    ['email', checks.required(b.email, 'Моля, въведете имейл адрес.') ||
      checks.email(b.email, 'Моля, въведете валиден имейл адрес.') ||
      checks.maxLen(b.email, 180, 'Имейл адресът е твърде дълъг.')]
  ])

  if (Object.keys(errors).length > 0) {
    return sendJson(res, 400, validationError(errors))
  }

  const email = b.email.trim()
  await notify({
    subject: `Нов абонат за бюлетина — ${email}`,
    lines: [
      'Клиент се абонира за бюлетина от сайта.',
      '',
      `Имейл: ${email}`,
      `Дата: ${new Date().toLocaleString('bg-BG', { timeZone: 'Europe/Sofia' })}`,
      '',
      'Моля, добавете адреса в списъка за бюлетина и му изпращайте новините на OCHSNER.'
    ],
    replyTo: email
  })

  return sendJson(res, 201, accepted(Date.now()))
}
