<script setup>
/** Compact hero used by every page except the home page. */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' }
})
</script>

<template>
  <section class="page-hero">
    <div class="container">
      <!-- See SectionHeading: no kicker above the heading, matching the
           corporate pages. The prop is retained for an easy revert. -->
      <h1 class="page-hero__title">{{ title }}</h1>
      <p v-if="subtitle" class="page-hero__subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-hero {
  position: relative;
  isolation: isolate;
  padding-block: clamp(2.5rem, 1.8rem + 4vw, 5rem);
  color: #fff;
  /* Brand-red wash over near-black, matching the home hero. */
  background:
    radial-gradient(70% 120% at 88% 0%, rgba(220, 38, 26, 0.28), transparent 60%),
    linear-gradient(140deg, #2f2d2b, #171615);
}

.page-hero__title {
  color: #fff;
  max-width: 20ch;
}

.page-hero__subtitle {
  margin-top: var(--sp-4);
  font-size: var(--fs-lead);
  line-height: var(--lh-body);
  color: rgba(255, 255, 255, 0.82);
  max-width: 60ch;
}
</style>
