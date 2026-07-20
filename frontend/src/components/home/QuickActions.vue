<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'

/**
 * The pair of action cards that sit directly beneath the hero on the corporate
 * site: one route into the technical documents, one into the advice request.
 */
defineProps({
  items: { type: Array, required: true }
})
</script>

<template>
  <section class="quick">
    <div class="container quick__grid">
      <article v-for="item in items" :key="item.title" class="quick__card">
        <div class="quick__body">
          <h2 class="quick__title">{{ item.title }}</h2>
          <p class="quick__text">{{ item.text }}</p>
        </div>
        <BaseButton :to="{ name: item.to }" size="sm">{{ item.cta }}</BaseButton>
      </article>
    </div>
  </section>
</template>

<style scoped>
.quick {
  padding-block: var(--sp-7);
}

.quick__grid {
  display: grid;
  gap: var(--sp-5);
}

.quick__card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-4);
  padding: var(--sp-6);
  background: var(--c-surface-alt);
}

.quick__title {
  font-size: var(--fs-h3);
  color: var(--c-primary-900);
}

.quick__text {
  margin-top: var(--sp-2);
  font-size: 0.9375rem;
  color: var(--c-ink-soft);
  max-width: 46ch;
}

.quick__body {
  flex: 1;
}

@media (min-width: 760px) {
  .quick__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
