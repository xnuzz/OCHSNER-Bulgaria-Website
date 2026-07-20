<script setup>
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import { useI18n } from '@/i18n'

defineProps({
  product: { type: Object, required: true },
  tone: { type: String, default: 'blue' }
})

const { common } = useI18n()
</script>

<template>
  <article class="card">
    <PlaceholderImage :label="product.title" :tone="tone" ratio="16 / 10" />
    <div class="card__body">
      <h3 class="card__title">{{ product.title }}</h3>
      <p class="card__text">{{ product.shortDescription }}</p>
      <RouterLink class="card__link" :to="{ name: 'products', hash: `#${product.slug}` }">
        {{ common.ctaMore }}
        <span aria-hidden="true">→</span>
      </RouterLink>
    </div>
  </article>
</template>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}

.card:hover {
  transform: translateY(-4px);
  border-color: var(--c-primary-300);
  box-shadow: var(--shadow-lg);
}

.card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--sp-5);
}

.card__title {
  color: var(--c-primary-800);
}

.card__text {
  margin-top: var(--sp-3);
  color: var(--c-ink-soft);
  font-size: 0.95rem;
}

.card__link {
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-line-soft);
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  /* Pins the link to the bottom so cards in a row align. */
  margin-top: auto;
}

.card__link span {
  transition: transform var(--dur-fast) var(--ease);
}

.card:hover .card__link span {
  transform: translateX(3px);
}
</style>
