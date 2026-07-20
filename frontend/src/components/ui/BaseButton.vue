<script setup>
/**
 * Renders as <RouterLink>, <a> or <button> depending on the props given,
 * so every call site gets identical styling and focus behaviour.
 */
defineProps({
  to: { type: [String, Object], default: null },
  href: { type: String, default: null },
  type: { type: String, default: 'button' },
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost', 'light'].includes(v)
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v)
  },
  block: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false }
})
</script>

<template>
  <RouterLink
    v-if="to"
    :to="to"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <slot />
  </RouterLink>

  <a
    v-else-if="href"
    :href="href"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <slot />
  </a>

  <button
    v-else
    :type="type"
    :disabled="disabled"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--block': block }]"
  >
    <slot />
  </button>
</template>

<style scoped>
/*
 * Pill-shaped, uppercase and bold — the OCHSNER button treatment.
 * Content tiles stay square (--radius: 0); only buttons use --radius-pill.
 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 0.9375rem;
  text-transform: uppercase;
  letter-spacing: normal;
  text-align: center;
  text-decoration: none;
  border: 1px solid transparent;
  border-radius: var(--radius-pill);
  cursor: pointer;
  /* 48px min target — comfortable on phones. */
  min-height: 48px;
  padding: 12px 28px;
  transition: background-color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease),
    transform var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}

.btn:active:not(:disabled) {
  transform: translateY(1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn--sm {
  min-height: 40px;
  padding: 8px 20px;
  font-size: 0.8125rem;
}

.btn--lg {
  min-height: 56px;
  padding: 16px 30px;
  font-size: 1.125rem;
}

.btn--block {
  display: flex;
  width: 100%;
}

/* OCHSNER red — the standard call to action. */
.btn--primary {
  background: var(--c-accent-600);
  border-color: var(--c-accent-600);
  color: #fff;
}

.btn--primary:hover:not(:disabled) {
  background: var(--c-accent-700);
  border-color: var(--c-accent-700);
  color: #fff;
}

.btn--secondary {
  background: transparent;
  border-color: var(--c-primary-800);
  color: var(--c-primary-800);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--c-primary-800);
  color: #fff;
}

.btn--ghost {
  background: transparent;
  color: var(--c-accent-600);
  padding-inline: var(--sp-2);
}

.btn--ghost:hover:not(:disabled) {
  color: var(--c-accent-700);
}

/* For use on dark backgrounds. */
.btn--light {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.55);
  color: #fff;
}

.btn--light:hover:not(:disabled) {
  background: #fff;
  border-color: #fff;
  color: var(--c-primary-900);
}
</style>
