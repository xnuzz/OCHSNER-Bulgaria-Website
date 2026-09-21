<script setup>
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'

/**
 * Square, centred category tile on a light-grey field — the corporate product
 * grid treatment. Image block on top, short bold label beneath, whole tile is
 * one link target.
 */
defineProps({
  product: { type: Object, required: true },
  tone: { type: String, default: 'blue' }
})
</script>

<template>
  <RouterLink class="tile" :to="{ name: 'products', hash: `#${product.slug}` }">
    <div class="tile__image">
      <PlaceholderImage
        :src="product.imageUrl"
        :label="product.title"
        :tone="tone"
        surface="alt"
        inset="10%"
        ratio="4 / 3"
      />
    </div>
    <div class="tile__title">{{ product.title }}</div>
  </RouterLink>
</template>

<style scoped>
.tile {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--c-surface-alt);
  border-radius: 0;
  text-align: center;
  text-decoration: none;
  color: var(--c-ink);
  transition: background-color var(--dur) var(--ease);
}

.tile:hover {
  background: var(--c-primary-100);
  color: var(--c-ink);
}

.tile__image {
  overflow: hidden;
}

.tile__image :deep(.ph) {
  transition: transform var(--dur-slow) var(--ease);
}

.tile:hover .tile__image :deep(.ph) {
  transform: scale(1.04);
}

.tile__title {
  padding: 16px 12px;
  font-size: 0.9375rem;
  font-weight: var(--fw-semibold);
  line-height: var(--lh-snug);
}
</style>
