<script setup>
/**
 * OCHSNER brand lockup, Bulgarian.
 *
 * This is the manufacturer's own `OCH_logo_155_englisch.svg` with the two grey
 * outlined words replaced by live text — "HEAT PUMPS" → ТЕРМОПОМПИ and
 * "YEARS" → ГОДИНИ. The red artwork (the OCHSNER wordmark and the 155 mark) is
 * the original vector data, untouched, so the trademark itself is not redrawn.
 *
 * The replacements are pinned with textLength to the exact width and baseline
 * the English words occupied, so the lockup's proportions are unchanged.
 *
 * Inlined rather than used via <img> because the substituted text is set in
 * Poppins, and an SVG loaded as an image cannot reach the page's webfonts.
 */
import markup from '@/assets/brand/ochsner-155-bg.svg?raw'

defineProps({
  /** Light-on-dark placement, e.g. the footer. */
  invert: { type: Boolean, default: false }
})
</script>

<template>
  <span
    class="mark"
    :class="{ 'mark--invert': invert }"
    role="img"
    aria-label="OCHSNER Термопомпи — 155 години"
    v-html="markup"
  />
</template>

<style scoped>
.mark {
  display: block;
  line-height: 0;
}

/* The source SVG carries a viewBox but no width/height, so `height: auto`
   resolves to zero — the ratio has to be stated explicitly. */
.mark :deep(svg) {
  display: block;
  width: 172px;
  height: 27.3px; /* 172 ÷ (307.84/48.85) */
}

/* On dark surfaces the grey descriptor would nearly vanish. */
.mark--invert :deep(.cls-2) {
  fill: rgba(255, 255, 255, 0.82);
}

/* Matches the 200px width the lockup occupies on the corporate header. */
@media (min-width: 1440px) {
  .mark :deep(svg) {
    width: 200px;
    height: 31.7px;
  }
}
</style>
