<script setup>
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  /* Leading words set in bold ahead of the light title — the reference sets
     every heading this way ("**Technical details** AIR HAWK 208"). */
  strong: { type: String, default: '' },
  /* A hairline under the heading, as the reference uses on detail pages. */
  rule: { type: Boolean, default: false },
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
    <component :is="level" class="heading__title" :class="{ 'heading__title--rule': rule }">
      <strong v-if="strong">{{ strong }}</strong>{{ strong ? ' ' : '' }}{{ title }}
    </component>
    <p v-if="subtitle" class="heading__subtitle">{{ subtitle }}</p>
  </header>
</template>

<style scoped>
.heading {
  margin-bottom: var(--sp-6);
}

.heading--center .heading__title {
  max-width: 34ch;
}

/* Centred intros run the width of the column on the reference. */
.heading--center .heading__subtitle {
  max-width: 80ch;
}

.heading--center {
  text-align: center;
}

.heading--center .heading__subtitle {
  margin-inline: auto;
}

.heading__title {
  max-width: 26ch;
  text-wrap: balance;
}

/* With a bold lead the rest of the heading drops to light, as on the reference. */
.heading__title:has(strong) {
  font-weight: var(--fw-light);
}

.heading__title strong {
  font-weight: var(--fw-bold);
}

/* Doubled class so the width caps in the media query below cannot shorten the rule. */
.heading__title.heading__title--rule {
  max-width: none;
  padding-bottom: var(--sp-4);
  border-bottom: 1px solid var(--c-primary-700);
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
  max-width: 58ch;
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
