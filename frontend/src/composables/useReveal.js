import { nextTick, onBeforeUnmount, onMounted } from 'vue'

/**
 * Adds `is-revealed` to elements carrying `data-reveal` once they scroll into view.
 * Uses IntersectionObserver only — no scroll listeners, no layout thrash.
 * Elements are visible by default in CSS without JS (see `.js [data-reveal]`).
 *
 * Call the returned `refresh()` after rendering content that arrived asynchronously,
 * otherwise those elements are never observed and stay hidden.
 */
export function useReveal(rootRef) {
  let observer = null
  let disabled = false

  function collect() {
    const root = rootRef?.value || document
    return root.querySelectorAll('[data-reveal]:not(.is-revealed)')
  }

  function refresh() {
    return nextTick().then(() => {
      const targets = collect()
      if (disabled || !observer) {
        targets.forEach((el) => el.classList.add('is-revealed'))
        return
      }
      targets.forEach((el) => observer.observe(el))
    })
  }

  onMounted(() => {
    disabled =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)

    if (!disabled) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-revealed')
              observer.unobserve(entry.target)
            }
          })
        },
        { rootMargin: '0px 0px -8% 0px', threshold: 0.05 }
      )
    }

    refresh()
  })

  onBeforeUnmount(() => observer?.disconnect())

  return { refresh }
}
