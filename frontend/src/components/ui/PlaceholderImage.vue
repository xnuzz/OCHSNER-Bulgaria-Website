<script setup>
/**
 * Product imagery slot.
 *
 * The manufacturer ships transparent PNG cut-outs (white unit, red accent) with
 * no background of their own, so this component supplies the field they sit on:
 *
 *   surface="alt"   light grey — the corporate product-grid treatment
 *   surface="deep"  near-black — the hero feature panel
 *   surface="none"  inherits whatever the section already is
 *
 * When `src` is absent — or the file 404s, which is the case for any category
 * whose asset has not arrived yet — it falls back to the original deterministic
 * gradient, so a missing photo degrades to the old placeholder instead of a gap.
 */
import { ref, watch } from 'vue'

const props = defineProps({
  src: { type: String, default: '' },
  label: { type: String, default: '' },
  ratio: { type: String, default: '4 / 3' },
  /** Shrinks the cut-out inside its box so it never touches the edges. */
  inset: { type: String, default: '8%' },
  /**
   * `contain` for transparent product cut-outs, which must never be cropped.
   * `cover` for photographs, which fill the frame edge to edge — the treatment
   * the corporate hero uses.
   */
  fit: {
    type: String,
    default: 'contain',
    validator: (v) => ['contain', 'cover'].includes(v)
  },
  /** Above-the-fold images should not be lazy-loaded — it delays the LCP. */
  eager: { type: Boolean, default: false },
  surface: {
    type: String,
    default: 'none',
    validator: (v) => ['none', 'alt', 'deep'].includes(v)
  },
  tone: {
    type: String,
    default: 'blue',
    validator: (v) => ['blue', 'teal', 'deep', 'warm'].includes(v)
  },
  icon: { type: String, default: '' }
})

const broken = ref(false)
watch(() => props.src, () => (broken.value = false))
</script>

<template>
  <div
    class="ph"
    :class="[props.src && !broken ? `ph--surface-${props.surface}` : `ph--${props.tone}`]"
    :style="{ aspectRatio: props.ratio }"
    :role="props.src && !broken ? undefined : 'img'"
    :aria-label="props.src && !broken ? undefined : props.label || 'Илюстративно изображение'"
  >
    <img
      v-if="props.src && !broken"
      class="ph__img"
      :src="props.src"
      :alt="props.label"
      :style="{ padding: props.fit === 'cover' ? '0' : props.inset, objectFit: props.fit }"
      :loading="props.eager ? 'eager' : 'lazy'"
      :fetchpriority="props.eager ? 'high' : undefined"
      decoding="async"
      @error="broken = true"
    />

    <template v-else>
      <span v-if="props.icon" class="ph__icon" aria-hidden="true">{{ props.icon }}</span>
      <span v-if="props.label" class="ph__label">{{ props.label }}</span>
    </template>
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
  border-radius: var(--radius);
  overflow: hidden;
  text-align: center;
  color: rgba(255, 255, 255, 0.92);
}

/* The grid overlay belongs to the gradient fallback only — over a real product
   render it reads as dirt on the lens. */
.ph:not(:has(.ph__img))::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.07) 1px, transparent 1px);
  background-size: 28px 28px;
  pointer-events: none;
}

/* object-fit is set inline per instance: `contain` for cut-outs, which must not
   be cropped, `cover` for photographs, which should fill the frame. */
.ph__img {
  width: 100%;
  height: 100%;
}

/* --- Fields for real imagery ------------------------------------------ */
.ph--surface-none {
  background: transparent;
}

.ph--surface-alt {
  background: var(--c-surface-alt);
}

.ph--surface-deep {
  background: var(--c-surface-deep);
}

/* --- Gradient fallback (no asset yet) ---------------------------------- */
.ph--blue,
.ph--teal,
.ph--deep,
.ph--warm {
  padding: var(--sp-5);
}

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
