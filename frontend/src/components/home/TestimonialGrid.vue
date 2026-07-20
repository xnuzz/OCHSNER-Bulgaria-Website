<script setup>
defineProps({
  items: { type: Array, required: true }
})
</script>

<template>
  <ul class="quotes">
    <li v-for="item in items" :key="item.author" class="quote" data-reveal>
      <blockquote class="quote__text">
        <p>{{ item.quote }}</p>
      </blockquote>
      <footer class="quote__meta">
        <span class="quote__author">{{ item.author }}</span>
        <span class="quote__location">{{ item.location }}</span>
      </footer>
    </li>
  </ul>
</template>

<style scoped>
.quotes {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-5);
}

.quote {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.quote__text {
  margin: 0;
  flex: 1;
}

.quote__text::before {
  content: '„';
  display: block;
  font-family: var(--font-heading);
  font-size: 2.6rem;
  line-height: 0.8;
  color: var(--c-primary-300);
  margin-bottom: var(--sp-2);
}

.quote__text p {
  color: var(--c-ink);
  font-size: 0.98rem;
}

.quote__meta {
  margin-top: var(--sp-5);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-line-soft);
  display: flex;
  flex-direction: column;
}

.quote__author {
  font-family: var(--font-heading);
  font-weight: 600;
  color: var(--c-primary-800);
}

.quote__location {
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

@media (min-width: 760px) {
  .quotes {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
