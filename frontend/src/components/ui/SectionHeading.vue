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
    <p v-if="eyebrow" class="heading__eyebrow">{{ eyebrow }}</p>
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

.heading__eyebrow {
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-primary-600);
  margin-bottom: var(--sp-2);
}

.heading__title {
  max-width: 22ch;
}

.heading--center .heading__title {
  margin-inline: auto;
}

.heading__subtitle {
  margin-top: var(--sp-4);
  font-size: var(--fs-lead);
  line-height: var(--lh-body);
  color: var(--c-ink-soft);
  max-width: 62ch;
}

.heading--invert .heading__eyebrow {
  color: var(--c-primary-300);
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
