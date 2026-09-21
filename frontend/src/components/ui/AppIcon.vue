<script setup>
/**
 * Inline line-icon set. Drawn here rather than pulled from an icon font or
 * library so the icons inherit currentColor, cost nothing at runtime, and keep
 * a single consistent stroke weight across the site.
 *
 * All paths are on a 24x24 grid, 1.5px stroke, round caps/joins.
 */
defineProps({
  name: { type: String, required: true },
  size: { type: [Number, String], default: 24 }
})

const paths = {
  // Efficiency — bolt inside a circle
  efficiency: ['M13 3 6.5 13.2H11l-.8 7.8L17.5 10.6H13z'],
  // Quiet operation — speaker with muted waves
  quiet: ['M4 9.5v5h3.2L12 19V5L7.2 9.5z', 'M16 9.6a3.4 3.4 0 0 1 0 4.8', 'M19 16.5 21.5 19', 'M21.5 16.5 19 19'],
  // Certified quality — shield with a check
  quality: ['M12 3 5 5.7v5.6c0 4.2 2.9 7.6 7 9.1 4.1-1.5 7-4.9 7-9.1V5.7z', 'm9 12 2.2 2.3L15.4 10'],
  // Durability — hourglass
  durability: ['M7 3h10M7 21h10', 'M8 3v3.6c0 1.9 1.4 3.4 3 4.6-1.6 1.2-3 2.7-3 4.6V21', 'M16 3v3.6c0 1.9-1.4 3.4-3 4.6 1.6 1.2 3 2.7 3 4.6V21'],
  // Technology — processor
  technology: ['M8.5 8.5h7v7h-7z', 'M6 6h12v12H6z', 'M10 3v3M14 3v3M10 18v3M14 18v3M3 10h3M3 14h3M18 10h3M18 14h3'],
  // Price/performance — price tag
  value: ['M11.4 3.5 3.5 11.4a1.5 1.5 0 0 0 0 2.1l7 7a1.5 1.5 0 0 0 2.1 0l7.9-7.9V3.5z', 'M16.2 7.8h.01'],

  // Savings — coins
  savings: ['M3.5 7.2c0-1.5 3.4-2.7 7.5-2.7s7.5 1.2 7.5 2.7-3.4 2.7-7.5 2.7-7.5-1.2-7.5-2.7z', 'M3.5 7.2v4c0 1.5 3.4 2.7 7.5 2.7', 'M18.5 7.2v3', 'M13 16.8c0-1.5 3.4-2.7 7.5-2.7', 'M9 14.5c0 1.5 3.4 2.7 7.5 2.7s4-.6 4-.6'],
  // Independence — house with a plug
  independence: ['M4 10.5 12 4l8 6.5', 'M6 12v7.5h12V12', 'M10 14v2.2a2 2 0 0 0 4 0V14'],
  // Ecology — leaf
  ecology: ['M20 4c0 9-5.2 13-9.5 13A5.5 5.5 0 0 1 5 11.5C5 6.8 11.5 4 20 4z', 'M15.5 8.5C12 10.5 9 13.6 7 20'],

  // Interface
  phone: ['M6.2 3.5h3l1.6 4-2 1.3a11.5 11.5 0 0 0 5.4 5.4l1.3-2 4 1.6v3a1.6 1.6 0 0 1-1.7 1.6A16.5 16.5 0 0 1 4.6 5.2 1.6 1.6 0 0 1 6.2 3.5z'],
  chevron: ['m6 9 6 6 6-6'],
  arrowLeft: ['m14 5-7 7 7 7'],
  arrowRight: ['m10 5 7 7-7 7'],
  check: ['m5 12.5 4.5 4.5L19 7'],
  minus: ['M5 12h14'],
  plus: ['M12 5v14M5 12h14'],

  // Social — Facebook
  facebook: ['M14.5 8.5H16V5.6h-2.2c-1.9 0-3.1 1.2-3.1 3.2v1.6H8.5v2.9h2.2V21h3v-7.7h2.2l.4-2.9h-2.6V9.1c0-.4.2-.6.8-.6z'],
  // Social — Instagram
  instagram: ['M7.5 3.5h9A4 4 0 0 1 20.5 7.5v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4z', 'M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z', 'M17 6.9h.01']
}
</script>

<template>
  <svg
    class="icon"
    :width="size"
    :height="size"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path v-for="(d, i) in paths[name] || []" :key="i" :d="d" />
  </svg>
</template>

<style scoped>
.icon {
  display: block;
  flex-shrink: 0;
}
</style>
