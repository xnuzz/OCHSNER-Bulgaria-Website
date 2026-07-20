<script setup>
/** Success / error banner shown above a form after submission. */
defineProps({
  variant: { type: String, default: 'success', validator: (v) => ['success', 'error'].includes(v) },
  title: { type: String, default: '' },
  message: { type: String, required: true }
})
</script>

<template>
  <div
    class="status"
    :class="`status--${variant}`"
    role="alert"
    aria-live="polite"
    tabindex="-1"
  >
    <p v-if="title" class="status__title">{{ title }}</p>
    <p class="status__message">{{ message }}</p>
  </div>
</template>

<style scoped>
.status {
  padding: var(--sp-4);
  border-radius: var(--radius);
  border-left: 3px solid;
  outline: none;
}

.status--success {
  background: var(--c-success-bg);
  border-left-color: var(--c-success);
}

.status--error {
  background: var(--c-error-bg);
  border-left-color: var(--c-error);
}

.status__title {
  font-family: var(--font-heading);
  font-weight: 600;
  margin-bottom: var(--sp-1);
}

.status--success .status__title {
  color: var(--c-success);
}

.status--error .status__title {
  color: var(--c-error);
}

.status__message {
  font-size: 0.95rem;
  color: var(--c-ink);
}
</style>
