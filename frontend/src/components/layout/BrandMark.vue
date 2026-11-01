<script setup>
/**
 * Omnia Contractors logo — the company behind this site and the exclusive
 * OCHSNER representative for Bulgaria.
 *
 * Their own PNG (omnia-contractors.com, Logo_OMNIA.png); no vector original
 * exists, so it is kept at no more than 2× its largest display size.
 */
import omniaLogo from '@/assets/brand/omnia-contractors.png'

defineProps({
  /** Light-on-dark placement, e.g. the footer. */
  invert: { type: Boolean, default: false }
})
</script>

<template>
  <img
    class="logo"
    :class="{ 'logo--invert': invert }"
    :src="omniaLogo"
    alt="Omnia Contractors"
    width="279"
    height="100"
  />
</template>

<style scoped>
.logo {
  display: block;
  width: auto;
  height: 44px;
}

/* The grey wordmark would nearly vanish on dark surfaces — render it white. */
.logo--invert {
  filter: brightness(0) invert(1);
}

/* Narrow phones: shrink so the menu toggle still fits. */
@media (max-width: 399px) {
  .logo {
    height: 38px;
  }
}

@media (min-width: 1440px) {
  .logo {
    height: 50px;
  }
}
</style>
