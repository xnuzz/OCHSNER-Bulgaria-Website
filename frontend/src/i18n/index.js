import bg from './bg/index.js'

/**
 * Minimal i18n layer. Only Bulgarian ships today, but every user-facing string
 * already lives in a locale bundle, so adding `en` later is a matter of dropping
 * in `./en/index.js` and switching `activeLocale`.
 */
const locales = { bg }

export const DEFAULT_LOCALE = 'bg'

let activeLocale = DEFAULT_LOCALE

export function setLocale(locale) {
  if (locales[locale]) {
    activeLocale = locale
    document.documentElement.lang = locale
  }
}

export function getLocale() {
  return activeLocale
}

/** The whole message bundle — components destructure the section they need. */
export function messages() {
  return locales[activeLocale]
}

/**
 * Dot-path lookup, e.g. t('common.ctaPrimary').
 * Returns the key itself when missing so gaps are obvious in the UI rather than blank.
 */
export function t(path) {
  const value = path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), messages())
  return value === undefined || value === null ? path : value
}

/** Convenience for `<script setup>`: `const { home } = useI18n()`. */
export function useI18n() {
  return messages()
}
