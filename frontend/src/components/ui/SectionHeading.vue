<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  align: { type: String, default: 'start', validator: (v) => ['start', 'center'].includes(v) },
  level: { type: String, default: 'h2' },
  invert: { type: Boolean, default: false }
})
</script>


<template>
  <header class="heading" :class="[`heading--${align}`, { 'heading--invert': invert }]">
    <!-- No eyebrow: the corporate design has no kicker above a section heading,
         and uses no uppercase text at all outside buttons and navigation. The
         prop and the strings are kept so this is a one-line revert. -->
    <component :is="level" class="heading__title">{{ title }}</component>
    <p v-if="subtitle" class="heading__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.heading {
  margin-bottom: var(--sp-6);
}

.heading--center {
  text-align: center;
}

.heading--center .heading__subtitle {
  margin-inline: auto;
}

.heading__title {
  max-width: 22ch;
}

.heading--center .heading__title {
  margin-inline: auto;
}

/* 16px in the base ink, matching the corporate body copy — they set no larger
   "lead" size and no lighter grey for running text. */
.heading__subtitle {
  margin-top: var(--sp-4);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--c-ink);
  max-width: 62ch;
}

.heading--invert .heading__title {
  color: #fff;
}

.heading--invert .heading__subtitle {
  color: rgba(255, 255, 255, 0.82);
}

@media (min-width: 700px) {
  .heading__title {
    max-width: 28ch;
  }
}
</style>
