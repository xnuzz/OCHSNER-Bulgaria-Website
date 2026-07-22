import { readBody, sendJson, methodNotAllowed, validationError, accepted, checks, collect } from '../_lib/http.js'
import { notify } from '../_lib/notify.js'

const REQUEST_TYPES = ['HEAT_PUMP_INTEREST', 'EXISTING_CUSTOMER', 'OTHER']

// POST /api/v1/contact
export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')

  const b = readBody(req)

  // Mirrors ContactRequestDto Bean Validation, same Bulgarian messages.
  const errors = collect([
    ['name', checks.required(b.name, 'Моля, въведете вашето име.') ||
      checks.maxLen(b.name, 120, 'Името е твърде дълго.')],
    ['phone', checks.required(b.phone, 'Моля, въведете телефон за връзка.') ||
      checks.phone(b.phone, 'Моля, въведете валиден телефонен номер.')],
    ['email', checks.required(b.email, 'Моля, въведете имейл адрес.') ||
      checks.email(b.email, 'Моля, въведете валиден имейл адрес.') ||
      checks.maxLen(b.email, 180, 'Имейл адресът е твърде дълъг.')],
    ['requestType', b.requestType == null
      ? 'Моля, изберете тип запитване.'
      : checks.oneOf(b.requestType, REQUEST_TYPES, 'Моля, изберете тип запитване.')],
    ['city', checks.maxLen(b.city, 120, 'Името на населеното място е твърде дълго.')],
    ['message', checks.required(b.message, 'Моля, опишете накратко вашето запитване.') ||
      checks.minLen(b.message, 10, 'Съобщението трябва да е между 10 и 4000 символа.') ||
      checks.maxLen(b.message, 4000, 'Съобщението трябва да е между 10 и 4000 символа.')],
    ['gdprConsent', checks.isTrue(b.gdprConsent, 'Необходимо е съгласие с политиката за поверителност.')]
  ])

  if (Object.keys(errors).length > 0) {
    return sendJson(res, 400, validationError(errors))
  }

  // Best-effort notification; never blocks the user's confirmation.
  await notify({
    subject: `Ново запитване от сайта — ${b.requestType}`,
    lines: [
      `Име: ${b.name}`,
      `Телефон: ${b.phone}`,
      `Имейл: ${b.email}`,
      `Град: ${b.city || '—'}`,
      `Тип: ${b.requestType}`,
      '',
      b.message
    ]
  })

  // Stateless demo: an id echoes the Spring response shape without a database.
  return sendJson(res, 201, accepted(Date.now()))
}
