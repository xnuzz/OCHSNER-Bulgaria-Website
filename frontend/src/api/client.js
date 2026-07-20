import axios from 'axios'

/**
 * Single axios instance for the whole app.
 * In dev, Vite proxies /api to the Spring Boot server on :8080; in production
 * VITE_API_BASE_URL can point at a different origin (CORS is configured server-side).
 */
const client = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  timeout: 12000,
  headers: { 'Content-Type': 'application/json' }
})

/**
 * Normalises anything that can go wrong into a predictable shape so views never
 * have to inspect an axios error directly.
 *
 * @returns {{ message: string, fieldErrors: Record<string,string>, status: number|null }}
 */
export function toFormError(error, fallbackMessage, networkMessage) {
  if (error.response) {
    const data = error.response.data || {}
    return {
      status: error.response.status,
      message: data.message || fallbackMessage,
      fieldErrors: data.fieldErrors || {}
    }
  }
  return { status: null, message: networkMessage || fallbackMessage, fieldErrors: {} }
}

export default client
