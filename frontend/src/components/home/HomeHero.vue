<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useI18n } from '@/i18n'

const { common, home } = useI18n()

/*
 * The OCHSNER home hero is a mosaic, not a banner:
 *   - a tall dark editorial block on the left,
 *   - a rotating image-feature panel top-right,
 *   - two colour action tiles bottom-right.
 *
 * The feature panel auto-advances. The timer pauses on hover/focus-within so a
 * reader isn't fighting it, and respects prefers-reduced-motion by not starting.
 */
const slides = home.hero.slides
const active = ref(0)
let timer = null

const reduceMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

function go(index) {
  active.value = (index + slides.length) % slides.length
}

function start() {
  if (reduceMotion || slides.length < 2) return
  stop()
  timer = window.setInterval(() => go(active.value + 1), 6000)
}

function stop() {
  if (timer) window.clearInterval(timer)
  timer = null
}

onMounted(start)
onBeforeUnmount(stop)
</script>

<template>
  <section class="hero">
    <div class="container">
      <div class="mosaic">
        <!-- Left: dark editorial block -->
        <div class="panel panel--main">
          <div class="panel__bg" aria-hidden="true"></div>
          <div class="panel__body">
            <p class="hero__eyebrow">{{ home.hero.eyebrow }}</p>
            <h1 class="hero__title">{{ home.hero.title }}</h1>
            <p class="hero__subtitle">{{ home.hero.subtitle }}</p>
            <BaseButton :to="{ name: 'contact' }" size="lg">{{ common.ctaPrimary }}</BaseButton>
          </div>
          <RouterLink class="panel__more" :to="{ name: 'about' }">
            {{ home.hero.moreAbout }}
            <AppIcon name="arrowRight" :size="18" />
          </RouterLink>
        </div>

        <!-- Top-right: rotating feature slider -->
        <div
          class="panel panel--feature"
          @mouseenter="stop"
          @mouseleave="start"
          @focusin="stop"
          @focusout="start"
        >
          <div class="feature__slides">
            <RouterLink
              v-for="(slide, i) in slides"
              :key="slide.title"
              class="feature__slide"
              :class="{ 'is-active': i === active }"
              :to="{ name: 'products', hash: `#${slide.hash}` }"
              :aria-hidden="i !== active"
              :tabindex="i === active ? 0 : -1"
            >
              <PlaceholderImage :label="''" :tone="slide.tone" ratio="16 / 10" />
              <span class="feature__caption">
                <span class="feature__kicker">{{ slide.kicker }}</span>
                <span class="feature__title">{{ slide.title }}</span>
                <span class="feature__cta">
                  {{ slide.cta }}
                  <AppIcon name="arrowRight" :size="16" />
                </span>
              </span>
            </RouterLink>
          </div>

          <div class="feature__dots" role="tablist" :aria-label="home.hero.eyebrow">
            <button
              v-for="(slide, i) in slides"
              :key="slide.title"
              type="button"
              class="feature__dot"
              :class="{ 'is-active': i === active }"
              role="tab"
              :aria-selected="i === active"
              :aria-label="slide.title"
              @click="go(i)"
            ></button>
          </div>
        </div>

        <!-- Bottom-right: two colour action tiles -->
        <RouterLink
          v-for="tile in home.hero.tiles"
          :key="tile.title"
          class="panel tile"
          :class="`tile--${tile.variant}`"
          :to="{ name: tile.to }"
        >
          <span class="tile__title">{{ tile.title }}</span>
          <span class="tile__cta">
            {{ tile.cta }}
            <AppIcon name="arrowRight" :size="16" />
          </span>
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding-block: var(--sp-6) var(--sp-7);
}

/*
 * Mobile-first: everything stacks in one column. The desktop mosaic is defined
 * in the min-width block at the end.
 */
.mosaic {
  display: grid;
  gap: var(--sp-3);
}

.panel {
  position: relative;
  overflow: hidden;
  border-radius: 0;
}

/* --- Left editorial block --------------------------------------------- */
.panel--main {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--sp-6);
  min-height: 380px;
  padding: var(--sp-6);
  color: #fff;
  isolation: isolate;
}

.panel__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(70% 90% at 80% 15%, rgba(220, 38, 26, 0.24), transparent 60%),
    linear-gradient(155deg, #2f2d2b 0%, #171615 72%);
}

.hero__eyebrow {
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: var(--fw-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-accent-500);
  margin-bottom: var(--sp-4);
}

.hero__title {
  font-size: var(--fs-hero);
  font-weight: var(--fw-bold);
  line-height: var(--lh-tight);
  color: #fff;
}

.hero__subtitle {
  margin-top: var(--sp-4);
  margin-bottom: var(--sp-6);
  max-width: 42ch;
  color: rgba(255, 255, 255, 0.82);
  font-size: var(--fs-lead);
}

.panel__more {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 0.9375rem;
  text-transform: uppercase;
  color: #fff;
  text-decoration: none;
}

.panel__more:hover {
  color: var(--c-accent-300);
}

/* --- Feature slider ---------------------------------------------------- */
.panel--feature {
  min-height: 300px;
  background: var(--c-surface-deep);
}

.feature__slides {
  position: relative;
  height: 100%;
  min-height: 300px;
}

.feature__slide {
  position: absolute;
  inset: 0;
  display: block;
  text-decoration: none;
  opacity: 0;
  visibility: hidden;
  transition: opacity var(--dur-slow) var(--ease);
}

.feature__slide.is-active {
  opacity: 1;
  visibility: visible;
}

.feature__slide :deep(.ph) {
  position: absolute;
  inset: 0;
  height: 100%;
}

.feature__slide::after {
  /* Darken the lower half so the caption stays legible over any image. */
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 30%, rgba(0, 0, 0, 0.55) 100%);
}

.feature__caption {
  position: absolute;
  left: 0;
  bottom: 0;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: var(--sp-1);
  padding: var(--sp-5);
  background: var(--c-accent-600);
  color: #fff;
  max-width: 88%;
}

.feature__kicker {
  font-size: 0.75rem;
  font-weight: var(--fw-semibold);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.82);
}

.feature__title {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 1.35rem;
  line-height: 1.15;
}

.feature__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
  font-size: 0.875rem;
  font-weight: var(--fw-semibold);
}

.feature__dots {
  position: absolute;
  right: var(--sp-4);
  top: var(--sp-4);
  z-index: 2;
  display: flex;
  gap: var(--sp-2);
}

.feature__dot {
  width: 26px;
  height: 4px;
  padding: 0;
  border: 0;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.45);
  transition: background-color var(--dur) var(--ease);
}

.feature__dot.is-active {
  background: #fff;
}

/* --- Colour action tiles ---------------------------------------------- */
.tile {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--sp-5);
  min-height: 150px;
  padding: var(--sp-5);
  text-decoration: none;
  transition: filter var(--dur) var(--ease);
}

.tile:hover {
  filter: brightness(0.95);
}

.tile--gold {
  background: var(--c-tile-gold);
  color: var(--c-tile-gold-ink);
}

.tile--teal {
  background: var(--c-tile-teal);
  color: var(--c-tile-teal-ink);
}

.tile__title {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 1.2rem;
  line-height: 1.15;
}

.tile__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  align-self: flex-start;
  padding: 10px 18px;
  background: var(--c-accent-600);
  color: #fff;
  font-size: 0.8125rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  border-radius: var(--radius-pill);
}

/* --- Desktop mosaic ---------------------------------------------------- */
@media (min-width: 900px) {
  /*
   * Three columns: the left editorial block takes ~40% and spans both rows;
   * the feature slider fills the whole right side on the top row; the two
   * colour tiles split the right side on the bottom row.
   */
  .mosaic {
    grid-template-columns: 40fr 30fr 30fr;
    grid-template-rows: auto auto;
    gap: var(--sp-4);
  }

  .panel--main {
    grid-column: 1;
    grid-row: 1 / 3;
    min-height: 560px;
    padding: var(--sp-8);
  }

  .panel--feature {
    grid-column: 2 / 4;
    grid-row: 1;
  }

  .tile {
    grid-row: 2;
    min-height: 170px;
  }

  .tile--gold {
    grid-column: 2;
  }

  .tile--teal {
    grid-column: 3;
  }
}
</style>
