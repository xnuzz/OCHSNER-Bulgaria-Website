<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import RedirectNotice from '@/components/ui/RedirectNotice.vue'
import { useExternalLink } from '@/composables/useExternalLink.js'
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

/* External destinations open behind the redirect notice. */
const { leavingFor, confirmLeave, cancelLeave } = useExternalLink()
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
              <PlaceholderImage
                :src="slide.image"
                :label="slide.title"
                :tone="slide.tone"
                surface="deep"
                fit="cover"
                eager
                ratio="16 / 10"
              />
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
        <component
          :is="tile.href ? 'a' : 'RouterLink'"
          v-for="tile in home.hero.tiles"
          :key="tile.title"
          class="panel tile"
          :class="`tile--${tile.variant}`"
          v-bind="tile.href ? { href: tile.href } : { to: { name: tile.to } }"
          @click="tile.href && confirmLeave($event, tile.href)"
        >
          <!-- Oversized tone-on-tone glyph bleeding off the right edge, echoing
               the corporate action tiles. Decorative only. -->
          <svg
            class="tile__glyph"
            viewBox="0 0 120 120"
            fill="none"
            stroke="currentColor"
            stroke-width="3.5"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
            focusable="false"
          >
            <template v-if="tile.variant === 'gold'">
              <!-- Document held up by a hand -->
              <rect x="52" y="6" width="46" height="62" rx="4" />
              <path d="M62 24h26M62 36h26M62 48h16" />
              <path d="M46 62v-18a5 5 0 0 1 10 0v26" />
              <path d="M56 70v-8a5 5 0 0 1 10 0v8" />
              <path d="M66 70v-6a5 5 0 0 1 10 0v6" />
              <path d="M76 70v-4a5 5 0 0 1 10 0v14a26 26 0 0 1-26 26h-6a22 22 0 0 1-22-22V72a5 5 0 0 1 10 0v6" />
            </template>
            <template v-else>
              <!-- Service technician: capped head and shoulders -->
              <circle cx="60" cy="46" r="20" />
              <path d="M34 40h52" />
              <path d="M40 40a20 20 0 0 1 40 0" />
              <path d="M60 20v-6" />
              <path d="M26 112v-8a26 26 0 0 1 26-26h16a26 26 0 0 1 26 26v8" />
            </template>
          </svg>

          <span class="tile__title">{{ tile.title }}</span>
          <span class="tile__cta">
            {{ tile.cta }}
            <AppIcon name="arrowRight" :size="16" />
          </span>
        </component>
      </div>
    </div>

    <RedirectNotice :url="leavingFor" @close="cancelLeave" />
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

/* AIR HAWK outdoor unit, as on the corporate hero. The scrim keeps the headline
   legible over the fan without washing the photograph out — it is heaviest at
   the top, where the type sits, and clears by the lower third. */
.panel__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(
      180deg,
      rgba(10, 10, 10, 0.92) 0%,
      rgba(10, 10, 10, 0.72) 38%,
      rgba(10, 10, 10, 0.25) 68%,
      rgba(10, 10, 10, 0.45) 100%
    ),
    url('/images/hero/hawk-panel.jpg') center bottom / cover no-repeat,
    #101010;
}

.hero__title {
  font-size: var(--fs-hero);
  font-weight: var(--fw-bold);
  line-height: var(--lh-tight);
  text-transform: uppercase;
  color: #fff;
}

/* Bold, not light — the corporate hero sets its standfirst in the heading
   weight, which is what makes it hold up over the photograph. */
.hero__subtitle {
  margin-top: var(--sp-4);
  margin-bottom: var(--sp-6);
  max-width: 38ch;
  color: #fff;
  font-size: var(--fs-lead);
  font-weight: var(--fw-bold);
  line-height: 1.45;
  /* The copy carries its own line break, matching the two-line standfirst on
     the corporate hero. */
  white-space: pre-line;
}

/* Sits at the bottom-right of the panel, as on the corporate hero. */
.panel__more {
  align-self: flex-end;
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 0.9375rem;
  /* Sentence case: the corporate site keeps uppercase to buttons and nav. */
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

/*
 * The visible indicator is a thin 4px bar, but the button itself is a 26x24
 * touch target (the bar is drawn with ::before) so it stays comfortably tappable
 * on a phone.
 */
.feature__dot {
  width: 26px;
  height: 24px;
  padding: 0;
  border: 0;
  cursor: pointer;
  background: transparent;
  display: grid;
  align-items: center;
}

.feature__dot::before {
  content: '';
  display: block;
  height: 4px;
  background: rgba(255, 255, 255, 0.5);
  transition: background-color var(--dur) var(--ease);
}

.feature__dot.is-active::before {
  background: #fff;
}

/* --- Colour action tiles ---------------------------------------------- */
.tile {
  position: relative;
  overflow: hidden;
  isolation: isolate;
  display: flex;
  flex-direction: column;
  /* Heading and button sit together low in the tile, as on the corporate
     cards, rather than being pushed to opposite edges. */
  justify-content: flex-end;
  gap: var(--sp-5);
  min-height: 150px;
  padding: var(--sp-5);
  text-decoration: none;
  transition: filter var(--dur) var(--ease);
}

/* Sits behind the label, cropped by the tile, in a darker shade of the tile's
   own colour so it reads as texture rather than as an illustration. */
.tile__glyph {
  position: absolute;
  z-index: -1;
  right: -18px;
  bottom: -20px;
  width: 232px;
  height: 232px;
  opacity: 0.28;
  pointer-events: none;
  transition: transform var(--dur-slow) var(--ease);
}

.tile:hover .tile__glyph {
  transform: translateX(-6px) scale(1.04);
}

.tile--gold .tile__glyph {
  color: #b9832a;
}

.tile--teal .tile__glyph {
  color: #4b8791;
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

/* 28px, the size the corporate card headings use. */
.tile__title {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: clamp(1.2rem, 1rem + 0.8vw, 1.75rem);
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

  /* Keeps the feature panel close to the corporate hero's ~1.9:1 proportion.
     Without it the panel collapses to whatever height the editorial column
     leaves over, which reads as a letterbox strip. */
  .panel--feature {
    grid-column: 2 / 4;
    grid-row: 1;
    min-height: 540px;
  }

  /* Measured off the corporate hero: the action tiles run about half the height
     of the feature panel above them (260px against 522px), which is what makes
     the right-hand column balance the editorial panel. */
  .tile {
    grid-row: 2;
    min-height: 270px;
    padding: var(--sp-6);
  }

  .tile--gold {
    grid-column: 2;
  }

  .tile--teal {
    grid-column: 3;
  }
}
</style>
