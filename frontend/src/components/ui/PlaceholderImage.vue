<script setup>
/**
 * Stands in for real photography until the client supplies assets.
 * Renders a deterministic gradient (so the same subject always looks the same)
 * with an optional caption. Swap for <img> once photos exist — the surrounding
 * layout already reserves the right aspect ratio, so nothing else changes.
 */
const props = defineProps({
  label: { type: String, default: '' },
  ratio: { type: String, default: '4 / 3' },
  tone: {
    type: String,
    default: 'blue',
    validator: (v) => ['blue', 'teal', 'deep', 'warm'].includes(v)
  },
  icon: { type: String, default: '' }
})
</script>

<template>
  <div
    class="ph"
    :class="`ph--${props.tone}`"
    :style="{ aspectRatio: props.ratio }"
    role="img"
    :aria-label="props.label || 'Илюстративно изображение'"
  >
    <span v-if="props.icon" class="ph__icon" aria-hidden="true">{{ props.icon }}</span>
    <span v-if="props.label" class="ph__label">{{ props.label }}</span>
  </div>
</template>

<style scoped>
.ph {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  width: 100%;
  padding: var(--sp-5);
  border-radius: var(--radius);
  overflow: hidden;
  text-align: center;
  color: rgba(255, 255, 255, 0.92);
}

/* Faint grid overlay keeps the placeholder reading as "technical", not empty. */
.ph::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

/*
 * Neutral greys with a single red variant, matching the corporate palette.
 * The tone names are kept so call sites did not have to change.
 */
.ph--blue {
  background: linear-gradient(140deg, var(--c-primary-700), var(--c-primary-900));
}

.ph--teal {
  background: linear-gradient(140deg, var(--c-primary-600), var(--c-primary-800));
}

.ph--deep {
  background: linear-gradient(140deg, var(--c-primary-800), #171615);
}

.ph--warm {
  background: linear-gradient(140deg, var(--c-accent-600), var(--c-accent-900));
}

.ph__icon {
  font-size: clamp(1.6rem, 1rem + 2vw, 2.4rem);
  line-height: 1;
}

.ph__label {
  position: relative;
  z-index: 1;
  font-family: var(--font-heading);
  font-size: var(--fs-small);
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  max-width: 24ch;
}
</style>
