<script setup>
import { useI18n } from '@/i18n'

const { home } = useI18n()
</script>

<template>
  <section class="trust">
    <div class="container">
      <h2 class="visually-hidden">{{ home.trust.title }}</h2>
      <dl class="trust__grid">
        <div v-for="item in home.trust.items" :key="item.label" class="trust__item">
          <dt class="trust__value">{{ item.value }}</dt>
          <dd class="trust__label">{{ item.label }}</dd>
        </div>
      </dl>
      <p class="trust__note">{{ home.trust.note }}</p>
    </div>
  </section>
</template>

<style scoped>
.trust {
  padding-block: var(--sp-7);
  background: var(--c-primary-800);
  color: #fff;
}

.trust__grid {
  display: grid;
  gap: var(--sp-5);
  margin: 0;
  text-align: center;
}

.trust__item {
  padding: var(--sp-4);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.05);
}

.trust__value {
  font-family: var(--font-heading);
  font-size: clamp(1.6rem, 1.2rem + 2vw, 2.4rem);
  font-weight: 700;
  color: var(--c-accent-500);
  line-height: 1.1;
}

.trust__label {
  margin: var(--sp-2) 0 0;
  font-size: var(--fs-small);
  color: rgba(255, 255, 255, 0.8);
}

.trust__note {
  margin-top: var(--sp-5);
  text-align: center;
  font-size: 0.78rem;
  color: rgba(255, 255, 255, 0.55);
}

@media (min-width: 700px) {
  .trust__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
