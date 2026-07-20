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
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: 600;
  letter-spacing: 0.01em;
  text-align: center;
  text-decoration: none;
  border: 2px solid transparent;
  border-radius: var(--radius);
  cursor: pointer;
  /* 48px min target — comfortable on phones. */
  min-height: 48px;
  padding: var(--sp-3) var(--sp-5);
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
  padding: var(--sp-2) var(--sp-4);
  font-size: var(--fs-small);
}

.btn--lg {
  min-height: 56px;
  padding: var(--sp-4) var(--sp-6);
  font-size: 1.05rem;
}

.btn--block {
  display: flex;
  width: 100%;
}

/* Amber is reserved for the primary action on a page. */
.btn--primary {
  background: var(--c-accent-600);
  color: #fff;
  box-shadow: var(--shadow-sm);
}

.btn--primary:hover:not(:disabled) {
  background: var(--c-accent-700);
  color: #fff;
  box-shadow: var(--shadow);
}

.btn--secondary {
  background: transparent;
  border-color: var(--c-primary-700);
  color: var(--c-primary-700);
}

.btn--secondary:hover:not(:disabled) {
  background: var(--c-primary-700);
  color: #fff;
}

.btn--ghost {
  background: transparent;
  color: var(--c-primary-700);
  padding-inline: var(--sp-2);
}

.btn--ghost:hover:not(:disabled) {
  color: var(--c-primary-500);
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
  color: var(--c-primary-800);
}
</style>
