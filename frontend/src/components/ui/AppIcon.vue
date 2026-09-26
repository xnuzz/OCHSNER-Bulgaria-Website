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

  // Social engagement glyphs, drawn to match the native post chrome
  heart: ['M12 20.3s-7.4-4.6-9.2-8.8A5.1 5.1 0 0 1 12 6.6a5.1 5.1 0 0 1 9.2 4.9c-1.8 4.2-9.2 8.8-9.2 8.8z'],
  comment: ['M20.5 11.6a7.6 7.6 0 0 1-11 6.8L4 19.8l1.4-5.1A7.6 7.6 0 1 1 20.5 11.6z'],
  share: ['M21.5 2.5 10.8 13.2', 'M21.5 2.5 14.8 21.5l-4-8.3-8.3-4z'],
  bookmark: ['M6.5 3.6h11v16.8L12 16.5l-5.5 3.9z'],
  globe: ['M12 3.5a8.5 8.5 0 1 0 0 17 8.5 8.5 0 0 0 0-17z', 'M3.5 12h17', 'M12 3.5c2.2 2.3 3.4 5.3 3.4 8.5S14.2 18.2 12 20.5c-2.2-2.3-3.4-5.3-3.4-8.5S9.8 5.8 12 3.5z'],
  thumbsUp: ['M7 10.5v9', 'M3.5 10.5h3.5v9H3.5z', 'M7 10.5 11 3.5a2.2 2.2 0 0 1 2.2 2.2V9h5a2 2 0 0 1 2 2.3l-1.1 6.4a2.2 2.2 0 0 1-2.2 1.8H7'],
  more: ['M6 12h.01', 'M12 12h.01', 'M18 12h.01'],

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
  instagram: ['M7.5 3.5h9A4 4 0 0 1 20.5 7.5v9a4 4 0 0 1-4 4h-9a4 4 0 0 1-4-4v-9a4 4 0 0 1 4-4z', 'M12 8.3a3.7 3.7 0 1 0 0 7.4 3.7 3.7 0 0 0 0-7.4z', 'M17 6.9h.01'],
  rotate: ['M8 3.5h6a1.5 1.5 0 0 1 1.5 1.5v14a1.5 1.5 0 0 1-1.5 1.5H8A1.5 1.5 0 0 1 6.5 19V5A1.5 1.5 0 0 1 8 3.5z', 'M10 17.5h2'],
  file: ['M6.5 3.5h7l4 4v13h-11z', 'M13.5 3.5v4h4', 'M9 12h6M9 15.5h6'],
  download: ['M12 3.5v11.5', 'm7 10 5 5 5-5', 'M4.5 19.5h15'],
  close: ['M6 6l12 12', 'M18 6 6 18'],
  zoomIn: ['M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z', 'm15.3 15.3 5.2 5.2', 'M10.5 7.8v5.4M7.8 10.5h5.4'],
  zoomOut: ['M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z', 'm15.3 15.3 5.2 5.2', 'M7.8 10.5h5.4']
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
