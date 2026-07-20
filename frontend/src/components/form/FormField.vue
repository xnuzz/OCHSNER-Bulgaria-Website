<script setup>
import { computed, useId } from 'vue'
import { useI18n } from '@/i18n'

/**
 * Wraps a labelled control and its error message, wiring up the
 * id / for / aria-describedby / aria-invalid relationships in one place.
 * The control itself comes in through the default slot.
 */
const props = defineProps({
  label: { type: String, required: true },
  error: { type: String, default: '' },
  required: { type: Boolean, default: false },
  hint: { type: String, default: '' }
})

const { common } = useI18n()

const uid = useId()
const fieldId = computed(() => `field-${uid}`)
const errorId = computed(() => `error-${uid}`)
const hintId = computed(() => `hint-${uid}`)

const describedBy = computed(() => {
  const ids = []
  if (props.hint) ids.push(hintId.value)
  if (props.error) ids.push(errorId.value)
  return ids.length ? ids.join(' ') : undefined
})
</script>

<template>
  <div class="field" :class="{ 'field--error': error }">
    <label class="field__label" :for="fieldId">
      {{ label }}
      <abbr v-if="required" class="field__required" :title="common.required" aria-hidden="true">*</abbr>
    </label>

    <slot
      :id="fieldId"
      :described-by="describedBy"
      :invalid="Boolean(error)"
    />

    <p v-if="hint" :id="hintId" class="field__hint">{{ hint }}</p>
    <p v-if="error" :id="errorId" class="field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.field {
  display: grid;
  gap: var(--sp-2);
}

.field__label {
  font-size: var(--fs-small);
  font-weight: 600;
  color: var(--c-ink);
}

.field__required {
  color: var(--c-error);
  text-decoration: none;
  margin-left: 2px;
}

.field__hint {
  font-size: 0.8rem;
  color: var(--c-ink-muted);
}

.field__error {
  font-size: 0.82rem;
  color: var(--c-error);
}

/* The control is provided by the caller, so style it from here. */
.field :slotted(input),
.field :slotted(select),
.field :slotted(textarea) {
  width: 100%;
  min-height: 48px;
  padding: var(--sp-3);
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  background: var(--c-surface);
  color: var(--c-ink);
  /* 16px prevents iOS Safari from zooming when the field is focused. */
  font-size: 16px;
  transition: border-color var(--dur-fast) var(--ease), box-shadow var(--dur-fast) var(--ease);
}

.field :slotted(textarea) {
  min-height: 140px;
  resize: vertical;
  line-height: var(--lh-body);
}

.field :slotted(input:hover),
.field :slotted(select:hover),
.field :slotted(textarea:hover) {
  border-color: var(--c-primary-300);
}

.field :slotted(input:focus),
.field :slotted(select:focus),
.field :slotted(textarea:focus) {
  border-color: var(--c-primary-600);
  box-shadow: 0 0 0 3px var(--c-primary-100);
  outline: none;
}

.field--error :slotted(input),
.field--error :slotted(select),
.field--error :slotted(textarea) {
  border-color: var(--c-error);
}
</style>
