/*
 * Opens an external destination behind the redirect notice, without ever
 * trapping the visitor: the click is only cancelled once the dialog is really
 * showing. If it has not appeared shortly after, the browser is sent to the
 * destination anyway, so the link can never do nothing.
 */
import { ref } from 'vue'

export function useExternalLink() {
  const leavingFor = ref('')

  function confirmLeave(event, url) {
    if (!url) return
    event.preventDefault()
    leavingFor.value = url

    /* Watchdog: if the dialog never mounted, do not swallow the click. */
    setTimeout(() => {
      if (leavingFor.value !== url) return
      if (document.querySelector('[data-redirect-notice]')) return
      window.location.assign(url)
    }, 400)
  }

  function cancelLeave() {
    leavingFor.value = ''
  }

  return { leavingFor, confirmLeave, cancelLeave }
}
