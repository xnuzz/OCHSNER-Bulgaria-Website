<script setup>
/**
 * Simple page header: the eyebrow, the page title and its standfirst on the
 * plain page background. No band, no artwork — just the heading the page needs
 * so it has a single, obvious <h1>.
 */
import { computed } from 'vue'

const props = defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  /* How many leading words carry the bold weight. */
  boldWords: { type: Number, default: 2 }
})

const words = computed(() => props.title.trim().split(/\s+/))
const lead = computed(() => words.value.slice(0, props.boldWords).join(' '))
const rest = computed(() => words.value.slice(props.boldWords).join(' '))
</script>

<template>
  <section class="page-head">
    <div class="container">
      <p v-if="eyebrow" class="page-head__eyebrow">
        <span class="page-head__dash" aria-hidden="true"></span>
        {{ eyebrow }}
      </p>

      <h1 class="page-head__title">
        <strong>{{ lead }}</strong>{{ rest ? ' ' : '' }}{{ rest }}
      </h1>

      <p v-if="subtitle" class="page-head__subtitle">{{ subtitle }}</p>
      <slot />
    </div>
  </section>
</template>

<style scoped>
.page-head {
  padding-top: clamp(var(--sp-6), 4vw, var(--sp-8));
  padding-bottom: clamp(var(--sp-6), 3.5vw, var(--sp-8));
  border-bottom: 1px solid var(--c-line);
}

/* Eyebrow reads as a quiet label with a short red marker, rather than a
   block of red shouting above the title. */
.page-head__eyebrow {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-ink-muted);
}

.page-head__dash {
  width: 26px;
  height: 2px;
  border-radius: 2px;
  background: var(--c-accent-600);
}

.page-head__title {
  margin-top: var(--sp-4);
  max-width: 26ch;
  font-weight: 300;
  letter-spacing: -0.01em;
  color: var(--c-primary-900);
  /* Evens the line lengths instead of leaving one orphan word. */
  text-wrap: balance;
}

.page-head__title strong {
  font-weight: var(--fw-bold);
}

.page-head__subtitle {
  margin-top: var(--sp-5);
  font-size: var(--fs-lead);
  line-height: var(--lh-body);
  color: var(--c-ink-soft);
  max-width: 58ch;
  text-wrap: pretty;
}
</style>
