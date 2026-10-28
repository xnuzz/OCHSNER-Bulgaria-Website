<script setup>
/**
 * OCHSNER brand lockup, Bulgarian, co-branded with Omnia Contractors — the
 * exclusive OCHSNER representative for Bulgaria.
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
 *
 * The Omnia logo is their own PNG (omnia-contractors.com, Logo_OMNIA.png)
 * downscaled to 3× its largest display size; no vector original exists.
 */
import markup from '@/assets/brand/ochsner-155-bg.svg?raw'
import omniaLogo from '@/assets/brand/omnia-contractors.png'

defineProps({
  /** Light-on-dark placement, e.g. the footer. */
  invert: { type: Boolean, default: false }
})
</script>

<template>
  <span class="lockup">
    <span
      class="mark"
      :class="{ 'mark--invert': invert }"
      role="img"
      aria-label="OCHSNER Термопомпи — 155 години"
      v-html="markup"
    />
    <img class="omnia" :src="omniaLogo" alt="Omnia Contractors" width="279" height="100" />
  </span>
</template>

<style scoped>
/* Partner lockup: OCHSNER first, a hairline rule, then Omnia at the same
   height. Omnia's quiet grey keeps the red OCHSNER mark dominant. */
.lockup {
  display: flex;
  flex: none; /* as a flex item the SVG would otherwise be squeezed */
  align-items: center;
  line-height: 0;
}

.mark {
  display: block;
}

/* The source SVG carries a viewBox but no width/height, so `height: auto`
   resolves to zero — the ratio has to be stated explicitly. */
.mark :deep(svg) {
  display: block;
  width: 172px;
  height: 27.3px; /* 172 ÷ (307.84/48.85) */
}

.omnia {
  display: block;
  width: auto;
  height: 27.3px;
  margin-left: 14px;
  padding-left: 14px;
  border-left: 1px solid color-mix(in srgb, currentColor 22%, transparent);
}

/* On dark surfaces the grey descriptor would nearly vanish. */
.mark--invert :deep(.cls-2) {
  fill: rgba(255, 255, 255, 0.82);
}

/* Narrow phones: both marks shrink so the menu toggle still fits. */
@media (max-width: 399px) {
  .mark :deep(svg) {
    width: 148px;
    height: 23.5px;
  }

  .omnia {
    height: 23.5px;
    margin-left: 10px;
    padding-left: 10px;
  }
}

/* Matches the 200px width the lockup occupies on the corporate header. */
@media (min-width: 1440px) {
  .mark :deep(svg) {
    width: 200px;
    height: 31.7px;
  }

  .omnia {
    height: 31.7px;
  }
}
</style>
