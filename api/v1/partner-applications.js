import { readBody, sendJson, methodNotAllowed, validationError, accepted, checks, collect } from '../_lib/http.js'
import { notify } from '../_lib/notify.js'

const ACTIVITIES = ['INSTALLER', 'HVAC_COMPANY', 'BUILDER', 'ARCHITECT', 'OTHER']

// POST /api/v1/partner-applications
export default async function handler(req, res) {
  if (req.method !== 'POST') return methodNotAllowed(res, 'POST')

  const b = readBody(req)

  // Mirrors PartnerApplicationDto Bean Validation.
  const errors = collect([
    ['companyName', checks.required(b.companyName, 'Моля, въведете име на фирмата.') ||
      checks.maxLen(b.companyName, 180, 'Името на фирмата е твърде дълго.')],
    ['activity', b.activity == null
      ? 'Моля, изберете вид дейност.'
      : checks.oneOf(b.activity, ACTIVITIES, 'Моля, изберете вид дейност.')],
    ['contactPerson', checks.required(b.contactPerson, 'Моля, въведете лице за контакт.') ||
      checks.maxLen(b.contactPerson, 120, 'Името е твърде дълго.')],
    ['phone', checks.required(b.phone, 'Моля, въведете телефон за връзка.') ||
      checks.phone(b.phone, 'Моля, въведете валиден телефонен номер.')],
    ['email', checks.required(b.email, 'Моля, въведете имейл адрес.') ||
      checks.email(b.email, 'Моля, въведете валиден имейл адрес.') ||
      checks.maxLen(b.email, 180, 'Имейл адресът е твърде дълъг.')],
    ['city', checks.maxLen(b.city, 120, 'Името на населеното място е твърде дълго.')],
    ['message', checks.maxLen(b.message, 4000, 'Съобщението е твърде дълго.')],
    ['gdprConsent', checks.isTrue(b.gdprConsent, 'Необходимо е съгласие с политиката за поверителност.')]
  ])

  if (Object.keys(errors).length > 0) {
    return sendJson(res, 400, validationError(errors))
  }

  await notify({
    subject: `Нова партньорска заявка — ${b.companyName}`,
    lines: [
      `Фирма: ${b.companyName}`,
      `Дейност: ${b.activity}`,
      `Лице за контакт: ${b.contactPerson}`,
      `Телефон: ${b.phone}`,
      `Имейл: ${b.email}`,
      `Град: ${b.city || '—'}`,
      '',
      b.message || ''
    ]
  })

  return sendJson(res, 201, accepted(Date.now()))
}
