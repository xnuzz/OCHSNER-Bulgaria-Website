<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'
import PageHero from '@/components/ui/PageHero.vue'

const { references: copy } = useI18n()
const page = ref(null)

/* Lightbox state — index of the open photo, or null. */
const open = ref(null)
const current = computed(() => (open.value == null ? null : copy.items[open.value]))

function show(i) {
  open.value = i
  window.addEventListener('keydown', onKey)
}
function close() {
  open.value = null
  window.removeEventListener('keydown', onKey)
}
function step(delta) {
  const n = copy.items.length
  open.value = (open.value + delta + n) % n
}
function onKey(e) {
  if (e.key === 'Escape') close()
  else if (e.key === 'ArrowRight') step(1)
  else if (e.key === 'ArrowLeft') step(-1)
}

onBeforeUnmount(() => window.removeEventListener('keydown', onKey))

useSeo({ title: copy.meta.title, description: copy.meta.description, path: '/referencii' })
</script>

<template>
  <div ref="page">
    <PageHero
      :eyebrow="copy.hero.eyebrow"
      :title="copy.hero.title"
      :subtitle="copy.hero.subtitle"
    />

    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :strong="copy.heading.strong"
          :title="copy.heading.light"
          :subtitle="copy.intro"
          level="h2"
          align="center"
          rule
        />

        <p class="count">
          <span class="count__num">{{ copy.items.length }}</span>
          {{ copy.countLabel }}
        </p>

        <!-- White project cards, same language as the product cards. -->
        <ul class="refs">
          <li v-for="(item, index) in copy.items" :key="item.image" class="ref">
            <button type="button" class="ref__btn" @click="show(index)">
              <span class="ref__media">
                <img
                  :src="item.image"
                  :alt="`Реализиран обект — ${item.location}`"
                  :loading="index < 3 ? 'eager' : 'lazy'"
                  decoding="async"
                />
                <span class="ref__zoom" aria-hidden="true">
                  <AppIcon name="plus" :size="18" />
                </span>
              </span>

              <span class="ref__body">
                <span class="ref__tag">{{ copy.galleryTag }}</span>
                <span class="ref__name">{{ item.location }}</span>
                <span class="ref__rule" aria-hidden="true"></span>
              </span>
            </button>
          </li>
        </ul>
      </div>
    </section>

    <CtaBand :title="copy.ctaBand.title" :text="copy.ctaBand.text" />

    <!-- Lightbox -->
    <Teleport to="body">
      <div v-if="current" class="lb" @click.self="close">
        <button type="button" class="lb__close" :aria-label="copy.close" @click="close">
          <AppIcon name="plus" :size="24" class="lb__x" />
        </button>
        <button type="button" class="lb__nav" :aria-label="copy.prev" @click="step(-1)">
          <AppIcon name="arrowLeft" :size="24" />
        </button>

        <figure class="lb__figure">
          <img :src="current.image" :alt="current.location" />
          <figcaption class="lb__cap">
            <span class="lb__tag">{{ copy.galleryTag }}</span>
            <span class="lb__name">{{ current.location }}</span>
            <span class="lb__count">{{ open + 1 }} / {{ copy.items.length }}</span>
          </figcaption>
        </figure>

        <button type="button" class="lb__nav" :aria-label="copy.next" @click="step(1)">
          <AppIcon name="arrowRight" :size="24" />
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.count {
  margin: calc(var(--sp-5) * -1) 0 var(--sp-7);
  text-align: center;
  font-family: var(--font-heading);
  font-size: var(--fs-small);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-ink-muted);
}

.count__num {
  font-weight: var(--fw-bold);
  color: var(--c-accent-600);
}

/* --- project cards ------------------------------------------------------ */
.refs {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 1180px;
  display: grid;
  gap: var(--sp-5);
}

.ref__btn {
  display: block;
  width: 100%;
  padding: 0;
  border: 1px solid var(--c-line);
  border-radius: 20px;
  background: var(--c-surface);
  overflow: hidden;
  cursor: pointer;
  text-align: left;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}

.ref__btn:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: var(--shadow-lg);
}

.ref__media {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--c-surface-alt);
}

.ref__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
}

.ref__btn:hover .ref__media img {
  transform: scale(1.05);
}

.ref__zoom {
  position: absolute;
  top: var(--sp-3);
  right: var(--sp-3);
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.92);
  color: var(--c-primary-900);
  opacity: 0;
  transform: scale(0.85);
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.ref__btn:hover .ref__zoom,
.ref__btn:focus-visible .ref__zoom {
  opacity: 1;
  transform: scale(1);
}

.ref__body {
  display: block;
  padding: var(--sp-5);
}

.ref__tag {
  display: block;
  font-family: var(--font-heading);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-ink-muted);
}

.ref__name {
  display: block;
  margin-top: 6px;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: var(--fw-bold);
  line-height: 1.2;
  color: var(--c-primary-900);
}

/* The red rule the rest of the site uses under a heading, drawn on hover. */
.ref__rule {
  display: block;
  width: 34px;
  height: 3px;
  margin-top: var(--sp-4);
  border-radius: 3px;
  background: var(--c-accent-600);
  transition: width var(--dur) var(--ease);
}

.ref__btn:hover .ref__rule {
  width: 64px;
}

/* --- lightbox ----------------------------------------------------------- */
.lb {
  position: fixed;
  inset: 0;
  z-index: 120;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--sp-3);
  padding: clamp(var(--sp-4), 3vw, var(--sp-7));
  background: rgb(0 0 0 / 0.9);
}

.lb__figure {
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sp-4);
  min-width: 0;
}

.lb__figure img {
  max-width: 100%;
  max-height: 78vh;
  border-radius: 14px;
  object-fit: contain;
}

.lb__cap {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  color: #fff;
  font-family: var(--font-heading);
}

.lb__tag {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.lb__name {
  font-size: 1.25rem;
  font-weight: var(--fw-bold);
}

.lb__count {
  font-size: var(--fs-small);
  color: rgba(255, 255, 255, 0.6);
}

.lb__close {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-4);
  width: 44px;
  height: 44px;
}

.lb__x {
  transform: rotate(45deg);
}

.lb__nav {
  width: 48px;
  height: 48px;
  flex: 0 0 auto;
}

.lb__close,
.lb__nav {
  display: grid;
  place-items: center;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.12);
  color: #fff;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease);
}

.lb__close:hover,
.lb__nav:hover {
  background: var(--c-accent-600);
}

@media (min-width: 640px) {
  .refs {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .refs {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 560px) {
  .lb {
    grid-template-columns: 1fr;
  }

  .lb__nav {
    display: none;
  }
}
</style>
