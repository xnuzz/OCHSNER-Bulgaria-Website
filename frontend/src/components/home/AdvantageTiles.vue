<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  items: { type: Array, required: true }
})

// Aligned to the six advantages in i18n/bg/home.js, in order.
const icons = ['efficiency', 'quiet', 'quality', 'durability', 'technology', 'value']
</script>

<template>
  <ul class="tiles">
    <li v-for="(item, index) in items" :key="item.title" class="tile">
      <span class="tile__icon">
        <AppIcon :name="icons[index % icons.length]" :size="26" />
      </span>
      <h3 class="tile__title">{{ item.title }}</h3>
      <p class="tile__text">{{ item.text }}</p>
    </li>
  </ul>
</template>

<style scoped>
.tiles {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-6) var(--sp-5);
}

.tile__icon {
  display: block;
  margin-bottom: var(--sp-4);
  color: var(--c-accent-600);
}

.tile__title {
  color: var(--c-primary-900);
}

.tile__text {
  margin-top: var(--sp-2);
  font-size: 0.9375rem;
  color: var(--c-ink-soft);
}

@media (min-width: 640px) {
  .tiles {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .tiles {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
