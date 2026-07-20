<script setup>
import { ref } from 'vue'

/**
 * Horizontal testimonial slider, matching the corporate treatment.
 *
 * Built on native scroll-snap rather than a carousel library: it stays keyboard-
 * and touch-scrollable with no JS at all, and the arrow buttons are a pure
 * enhancement on top. No dependency, no focus-trap, nothing to break.
 */
defineProps({
  items: { type: Array, required: true }
})

const track = ref(null)

function scrollByCards(direction) {
  const el = track.value
  if (!el) return
  const card = el.querySelector('.quote')
  const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth
  el.scrollBy({ left: direction * step, behavior: 'smooth' })
}
</script>

<template>
  <div class="slider">
    <ul ref="track" class="slider__track">
      <li v-for="item in items" :key="item.author" class="quote">
        <blockquote class="quote__text">
          <p>{{ item.quote }}</p>
        </blockquote>
        <footer class="quote__meta">
          <span class="quote__author">{{ item.author }}</span>
          <span class="quote__location">{{ item.location }}</span>
        </footer>
      </li>
    </ul>

    <div class="slider__controls">
      <button type="button" class="slider__btn" aria-label="Предишен отзив" @click="scrollByCards(-1)">
        <span aria-hidden="true">‹</span>
      </button>
      <button type="button" class="slider__btn" aria-label="Следващ отзив" @click="scrollByCards(1)">
        <span aria-hidden="true">›</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.slider {
  position: relative;
}

.slider__track {
  list-style: none;
  margin: 0;
  padding: 0 0 var(--sp-4);
  display: grid;
  grid-auto-flow: column;
  /* One card per view on phones, widening as space allows. */
  grid-auto-columns: minmax(min(84%, 420px), 1fr);
  gap: var(--sp-5);
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
  overscroll-behavior-x: contain;
}

.quote {
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  padding: var(--sp-6);
  background: var(--c-surface-alt);
}

.quote__text {
  margin: 0;
  flex: 1;
}

.quote__text::before {
  content: '„';
  display: block;
  font-family: var(--font-heading);
  font-size: 2.75rem;
  font-weight: var(--fw-bold);
  line-height: 0.7;
  color: var(--c-accent-600);
  margin-bottom: var(--sp-3);
}

.quote__text p {
  color: var(--c-ink);
  font-size: 0.9375rem;
}

.quote__meta {
  margin-top: var(--sp-5);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-line);
  display: flex;
  flex-direction: column;
}

.quote__author {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
}

.quote__location {
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.slider__controls {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-3);
  margin-top: var(--sp-4);
}

.slider__btn {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid var(--c-line);
  border-radius: 50%;
  background: var(--c-surface);
  color: var(--c-primary-900);
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}

.slider__btn:hover {
  background: var(--c-accent-600);
  border-color: var(--c-accent-600);
  color: #fff;
}
</style>
