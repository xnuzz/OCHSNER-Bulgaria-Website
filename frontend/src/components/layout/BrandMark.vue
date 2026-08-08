<script setup>
/**
 * Two-line wordmark lockup: brand name over a letterspaced category descriptor.
 *
 * Set as type rather than an image so it stays crisp at any size and can be
 * restyled from tokens. This is a PLACEHOLDER standing in for the licensed
 * OCHSNER logo artwork — replace with the official asset before launch.
 */
defineProps({
  descriptor: { type: String, default: 'ТЕРМОПОМПИ' },
  invert: { type: Boolean, default: false }
})
</script>

<template>
  <span class="mark" :class="{ 'mark--invert': invert }">
    <span class="mark__name">OCHSNER</span>
    <span class="mark__descriptor">{{ descriptor }}</span>
  </span>
</template>

<style scoped>
.mark {
  display: inline-flex;
  flex-direction: column;
  line-height: 1;
  /* Optical alignment: the descriptor sits flush under the wordmark. */
  gap: 3px;
}

/* The corporate wordmark is set in near-black, not red — red is reserved for
   the CONTACT pill and the anniversary badge. */
.mark__name {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 1.75rem;
  letter-spacing: 0.01em;
  color: var(--c-primary-900);
}

.mark__descriptor {
  font-family: var(--font-heading);
  font-weight: var(--fw-regular);
  font-size: 0.625rem;
  /* Tracked out so the descriptor spans the width of the wordmark above it. */
  letter-spacing: 0.34em;
  color: var(--c-ink-muted);
  white-space: nowrap;
}

.mark--invert .mark__name {
  color: #fff;
}

.mark--invert .mark__descriptor {
  color: rgba(255, 255, 255, 0.75);
}

/* Scales up to roughly the 200px width the corporate lockup occupies. */
@media (min-width: 1080px) {
  .mark__name {
    font-size: 2rem;
  }

  .mark__descriptor {
    font-size: 0.6875rem;
  }
}
</style>
