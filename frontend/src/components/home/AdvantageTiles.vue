<script setup>
defineProps({
  items: { type: Array, required: true }
})

// Line-art glyphs keep the tiles technical without shipping an icon library.
const glyphs = ['◆', '◐', '✓', '⏱', '⚙', '⇄']
</script>

<template>
  <ul class="tiles">
    <li v-for="(item, index) in items" :key="item.title" class="tile">
      <span class="tile__glyph" aria-hidden="true">{{ glyphs[index % glyphs.length] }}</span>
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
  gap: var(--sp-5);
}

.tile {
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  border-top: 3px solid var(--c-primary-500);
  transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.tile:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}

.tile__glyph {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  margin-bottom: var(--sp-4);
  border-radius: var(--radius);
  background: var(--c-primary-50);
  color: var(--c-primary-600);
  font-size: 1.1rem;
}

.tile__title {
  color: var(--c-primary-800);
}

.tile__text {
  margin-top: var(--sp-3);
  font-size: 0.95rem;
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
