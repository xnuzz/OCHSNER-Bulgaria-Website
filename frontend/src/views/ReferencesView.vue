<script setup>
import { computed, onBeforeUnmount, ref } from 'vue'
import PageHero from '@/components/ui/PageHero.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

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

    <section class="section">
      <div class="container">
        <p class="count">{{ copy.items.length }} {{ copy.countLabel }}</p>

        <!-- Real project photos, kept at their native aspect in a masonry gallery. -->
        <ul class="gallery">
          <li v-for="(item, index) in copy.items" :key="item.image" class="shot">
            <button type="button" class="shot__btn" @click="show(index)">
              <span class="shot__frame">
                <img
                  :src="item.image"
                  :alt="`Реализиран обект — ${item.location}`"
                  :loading="index < 3 ? 'eager' : 'lazy'"
                  decoding="async"
                />
                <span class="shot__caption">
                  <span class="shot__tag">{{ copy.galleryTag }}</span>
                  <span class="shot__loc">
                    <AppIcon name="independence" :size="16" class="shot__pin" />
                    {{ item.location }}
                  </span>
                </span>
                <span class="shot__zoom" aria-hidden="true">
                  <AppIcon name="plus" :size="20" />
                </span>
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
          <AppIcon name="plus" :size="26" class="lb__close-icon" />
        </button>
        <button type="button" class="lb__nav lb__nav--prev" :aria-label="copy.prev" @click="step(-1)">
          <AppIcon name="arrowLeft" :size="26" />
        </button>

        <figure class="lb__figure">
          <img :src="current.image" :alt="current.location" />
          <figcaption class="lb__caption">
            <span class="lb__tag">{{ copy.galleryTag }}</span>
            <span class="lb__loc">{{ current.location }}</span>
            <span class="lb__counter">{{ open + 1 }} / {{ copy.items.length }}</span>
          </figcaption>
        </figure>

        <button type="button" class="lb__nav lb__nav--next" :aria-label="copy.next" @click="step(1)">
          <AppIcon name="arrowRight" :size="26" />
        </button>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.count {
  margin: 0 0 var(--sp-5);
  font-family: var(--font-heading);
  font-size: var(--fs-small);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--c-ink-muted);
}

/* Masonry via CSS columns — mixed portrait/landscape photos keep their aspect. */
.gallery {
  list-style: none;
  padding: 0;
  margin: 0;
  column-count: 3;
  column-gap: var(--sp-5);
}

.shot {
  break-inside: avoid;
  margin-bottom: var(--sp-5);
}

.shot__btn {
  display: block;
  width: 100%;
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  text-align: left;
}

.shot__frame {
  position: relative;
  display: block;
  border-radius: 18px;
  overflow: hidden;
  background: var(--c-surface-alt);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.shot__btn:hover .shot__frame {
  transform: translateY(-4px);
  box-shadow: 0 18px 40px rgb(0 0 0 / 0.18);
}

.shot__frame img {
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.6s var(--ease);
}

.shot__btn:hover .shot__frame img {
  transform: scale(1.05);
}

/* Legibility gradient behind the caption. */
.shot__caption {
  position: absolute;
  inset: auto 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding: var(--sp-7) var(--sp-5) var(--sp-4);
  color: #fff;
  background: linear-gradient(to top, rgb(0 0 0 / 0.78), rgb(0 0 0 / 0.15) 60%, rgb(0 0 0 / 0));
}

.shot__tag {
  font-family: var(--font-heading);
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
}

.shot__loc {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-heading);
  font-size: 1.3rem;
  font-weight: var(--fw-bold);
  line-height: 1.15;
}

.shot__pin {
  color: var(--c-accent-500);
}

/* Zoom affordance top-right, revealed on hover. */
.shot__zoom {
  position: absolute;
  top: var(--sp-3);
  right: var(--sp-3);
  display: grid;
  place-items: center;
  width: 38px;
  height: 38px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.9);
  color: var(--c-primary-900);
  opacity: 0;
  transform: scale(0.8);
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.shot__btn:hover .shot__zoom,
.shot__btn:focus-visible .shot__zoom {
  opacity: 1;
  transform: scale(1);
}

/* ---------- Lightbox ---------- */
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
  max-height: 80vh;
  border-radius: 12px;
  object-fit: contain;
}

.lb__caption {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  color: #fff;
  font-family: var(--font-heading);
}

.lb__tag {
  font-size: 0.66rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.lb__loc {
  font-size: 1.25rem;
  font-weight: var(--fw-bold);
}

.lb__counter {
  font-size: var(--fs-small);
  color: rgba(255, 255, 255, 0.6);
}

.lb__close {
  position: absolute;
  top: var(--sp-4);
  right: var(--sp-4);
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.12);
  color: #fff;
  cursor: pointer;
}

.lb__close:hover {
  background: rgb(255 255 255 / 0.24);
}

.lb__close-icon {
  transform: rotate(45deg);
}

.lb__nav {
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.12);
  color: #fff;
  cursor: pointer;
  flex: 0 0 auto;
}

.lb__nav:hover {
  background: rgb(255 255 255 / 0.24);
}

@media (max-width: 900px) {
  .gallery {
    column-count: 2;
  }
}

@media (max-width: 560px) {
  .gallery {
    column-count: 1;
  }

  .lb {
    grid-template-columns: 1fr;
  }

  .lb__nav {
    display: none;
  }
}
</style>
