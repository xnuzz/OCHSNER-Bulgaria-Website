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
      <p v-if="eyebrow" class="page-hero__eyebrow">{{ eyebrow }}</p>
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
  background:
    radial-gradient(70% 120% at 88% 0%, rgba(26, 141, 174, 0.5), transparent 60%),
    linear-gradient(140deg, var(--c-primary-800), var(--c-primary-900));
}

.page-hero__eyebrow {
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-primary-300);
  margin-bottom: var(--sp-3);
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
