/*
 * Shared helpers for the serverless API: validation primitives that mirror the
 * Spring Bean Validation rules (same Bulgarian messages), plus body parsing and
 * uniform JSON responses matching ApiError / SubmissionResponse.
 */

const PHONE_RE = /^[0-9+()\-\s]{6,40}$/
// Deliberately permissive, in line with Hibernate's @Email default.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function readBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') {
    try {
      return JSON.parse(req.body)
    } catch {
      return {}
    }
  }
  return req.body
}

export function sendJson(res, status, payload) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8')
  res.end(JSON.stringify(payload))
}

export function methodNotAllowed(res, allow) {
  res.setHeader('Allow', allow)
  sendJson(res, 405, { status: 405, message: 'Методът не е разрешен.', fieldErrors: {}, timestamp: new Date().toISOString() })
}

export function validationError(fieldErrors) {
  return {
    status: 400,
    message: 'Моля, проверете попълнените данни.',
    fieldErrors,
    timestamp: new Date().toISOString()
  }
}

export function accepted(id) {
  return {
    id,
    message:
      'Благодарим ви! Получихме вашето запитване и ще се свържем с вас в рамките на един работен ден.'
  }
}

// --- field checks ---------------------------------------------------------

const str = (v) => (typeof v === 'string' ? v.trim() : '')

export const checks = {
  required: (v, msg) => (str(v) ? null : msg),
  maxLen: (v, max, msg) => (str(v).length <= max ? null : msg),
  minLen: (v, min, msg) => (str(v).length >= min ? null : msg),
  phone: (v, msg) => (PHONE_RE.test(str(v)) ? null : msg),
  email: (v, msg) => (EMAIL_RE.test(str(v)) ? null : msg),
  oneOf: (v, allowed, msg) => (allowed.includes(v) ? null : msg),
  isTrue: (v, msg) => (v === true ? null : msg)
}

/**
 * Runs an array of [field, message-or-null] pairs and collects the first error
 * per field, matching how the Spring handler surfaces one message per field.
 */
export function collect(entries) {
  const errors = {}
  for (const [field, result] of entries) {
    if (result && !errors[field]) errors[field] = result
  }
  return errors
}
