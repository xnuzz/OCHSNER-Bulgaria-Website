<script setup>
import BaseButton from './BaseButton.vue'
import { useI18n } from '@/i18n'

defineProps({
  title: { type: String, required: true },
  text: { type: String, default: '' }
})

const { common, contactDetails } = useI18n()
</script>

<template>
  <section class="cta">
    <div class="container cta__inner">
      <div class="cta__copy">
        <h2>{{ title }}</h2>
        <p v-if="text">{{ text }}</p>
      </div>
      <div class="cta__actions">
        <BaseButton :to="{ name: 'contact' }" variant="primary" size="lg">
          {{ common.ctaPrimary }}
        </BaseButton>
        <BaseButton :href="contactDetails.phoneHref" variant="light" size="lg">
          {{ contactDetails.phone }}
        </BaseButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta {
  background: linear-gradient(135deg, var(--c-primary-800), var(--c-primary-900));
  color: #fff;
  padding-block: var(--section-y);
}

.cta__inner {
  display: grid;
  gap: var(--sp-6);
}

.cta__copy h2 {
  color: #fff;
  max-width: 20ch;
}

.cta__copy p {
  margin-top: var(--sp-4);
  color: rgba(255, 255, 255, 0.82);
  max-width: 56ch;
}

.cta__actions {
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

@media (min-width: 560px) {
  .cta__actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}

@media (min-width: 940px) {
  .cta__inner {
    grid-template-columns: 1.4fr 1fr;
    align-items: center;
  }

  .cta__actions {
    justify-content: flex-end;
  }
}
</style>
