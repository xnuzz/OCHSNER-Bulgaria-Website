<script setup>
/**
 * Current brochures — the corporate site shows these through a third-party
 * flip-book embed that stays blank until the visitor accepts cookies. Here they
 * are plain PDFs served from our own site, presented as physical booklets:
 * the cover sits on a page stack with a spine, and on hover it swings open to
 * reveal the first inside page. No cookies, no external viewer.
 */
import SectionHeading from '@/components/ui/SectionHeading.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BrochureReader from '@/components/home/BrochureReader.vue'
import { ref } from 'vue'
import { useI18n } from '@/i18n'

const props = defineProps({
  /* Home shows the section heading and a link on to the download page;
     the download page brings its own heading. */
  heading: { type: Boolean, default: true },
  moreLink: { type: Boolean, default: true },
  alt: { type: Boolean, default: false },
  /* Optional heading overrides for pages other than home. */
  strong: { type: String, default: '' },
  light: { type: String, default: '' },
  intro: { type: String, default: '' }
})

const { home } = useI18n()
const b = home.brochures

/* The brochure open in the reader. Links still point at the PDF, so a
   middle-click or a no-JS visit gets the file itself. */
const reading = ref(null)
function read(e, item) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return
  e.preventDefault()
  reading.value = item
}
</script>

<template>
  <section class="section shelf" :class="{ 'section--alt': props.alt }">
    <div class="container">
      <SectionHeading
        v-if="heading"
        :strong="strong || b.strong"
        :title="light || b.light"
        :subtitle="intro || b.intro"
        level="h2"
        align="center"
        rule
      />

      <ul class="shelf__grid">
        <li v-for="item in b.items" :key="item.file" class="bro">
          <a
            class="bro__book"
            :href="item.file"
            target="_blank"
            rel="noopener"
            :aria-label="`${b.view}: ${item.title}`"
            @click="read($event, item)"
          >
            <!-- inside page, revealed when the cover swings open -->
            <img class="bro__inside" :src="item.inside" alt="" loading="lazy" decoding="async" />
            <span class="bro__pages" aria-hidden="true"></span>
            <span class="bro__cover">
              <img :src="item.cover" :alt="item.title" loading="lazy" decoding="async" />
              <span class="bro__spine" aria-hidden="true"></span>
              <span class="bro__sheen" aria-hidden="true"></span>
            </span>
          </a>

          <div class="bro__body">
            <p class="bro__tag">{{ item.tag }}</p>
            <h3 class="bro__title">{{ item.title }}</h3>
            <p class="bro__meta">
              <span>{{ item.pages }} {{ b.pagesLabel }}</span>
              <span class="bro__dot" aria-hidden="true"></span>
              <span>PDF · {{ item.size }}</span>
            </p>

            <div class="bro__actions">
              <a
                class="bro__btn bro__btn--primary"
                :href="item.file"
                target="_blank"
                rel="noopener"
                @click="read($event, item)"
              >
                {{ b.view }}
                <AppIcon name="arrowRight" :size="16" />
              </a>
              <a class="bro__btn" :href="item.file" :download="item.fileName">
                {{ b.download }}
              </a>
            </div>
          </div>
        </li>
      </ul>

      <p v-if="moreLink" class="shelf__more">
        <RouterLink :to="{ name: 'downloads' }">
          {{ b.more }}
          <AppIcon name="arrowRight" :size="16" />
        </RouterLink>
      </p>
    </div>

    <BrochureReader :item="reading" :labels="b.reader" @close="reading = null" />
  </section>
</template>

<style scoped>
.shelf__grid {
  list-style: none;
  margin: var(--sp-7) auto 0;
  padding: 0;
  max-width: 1180px;
  display: grid;
  gap: clamp(var(--sp-7), 4vw, var(--sp-8)) 40px;
}

.shelf__more {
  margin-top: var(--sp-7);
  text-align: center;
}

.shelf__more a {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
  text-decoration: none;
  border-bottom: 2px solid var(--c-accent-600);
  padding-bottom: 4px;
  transition: gap var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}

.shelf__more a:hover {
  gap: var(--sp-3);
  color: var(--c-accent-600);
}

.bro {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

/* ---------- the booklet ---------- */
.bro__book {
  position: relative;
  display: block;
  width: min(78%, 290px);
  aspect-ratio: 595 / 842;
  perspective: 1600px;
  /* soft contact shadow on the "table" */
  filter: drop-shadow(0 26px 22px rgb(0 0 0 / 0.16)) drop-shadow(0 4px 6px rgb(0 0 0 / 0.1));
}

.bro__inside,
.bro__cover,
.bro__cover img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

.bro__inside {
  object-fit: cover;
  border-radius: 2px 6px 6px 2px;
}

/* page block: a few stacked sheets peeking past the cover's fore-edge */
.bro__pages {
  position: absolute;
  top: 2%;
  bottom: 2%;
  right: -6px;
  width: 8px;
  border-radius: 0 4px 4px 0;
  background: repeating-linear-gradient(
    to right,
    #f4f2ef 0 1px,
    #dcd8d2 1px 2px
  );
}

.bro__cover {
  display: block;
  transform-origin: left center;
  transform-style: preserve-3d;
  transition: transform 0.7s cubic-bezier(0.2, 0.7, 0.2, 1);
  border-radius: 2px 6px 6px 2px;
  overflow: hidden;
  background: #fff;
}

.bro__cover img {
  object-fit: cover;
}

/* binding: a shaded crease down the spine */
.bro__spine {
  position: absolute;
  inset: 0 auto 0 0;
  width: 7%;
  background: linear-gradient(
    to right,
    rgb(0 0 0 / 0.28),
    rgb(0 0 0 / 0.05) 45%,
    rgb(255 255 255 / 0.22) 60%,
    rgb(0 0 0 / 0) 100%
  );
}

/* glossy stock: a sheen that travels across on hover */
.bro__sheen {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    105deg,
    transparent 35%,
    rgb(255 255 255 / 0.32) 48%,
    transparent 60%
  );
  transform: translateX(-120%);
  transition: transform 0.9s ease;
}

.bro__book:hover .bro__cover,
.bro__book:focus-visible .bro__cover {
  transform: rotateY(-28deg);
}

.bro__book:hover .bro__sheen,
.bro__book:focus-visible .bro__sheen {
  transform: translateX(120%);
}

.bro__book:focus-visible {
  outline: 3px solid var(--c-accent-600);
  outline-offset: 8px;
}

/* ---------- copy ---------- */
.bro__body {
  margin-top: var(--sp-6);
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 1 auto;
  max-width: 320px;
}

.bro__tag {
  font-family: var(--font-heading);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-accent-600);
}

.bro__title {
  margin-top: var(--sp-2);
  font-size: 1.25rem;
  font-weight: var(--fw-bold);
  line-height: 1.3;
  color: var(--c-primary-900);
  text-wrap: balance;
}

.bro__meta {
  margin-top: var(--sp-2);
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.bro__dot {
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: currentColor;
}

.bro__actions {
  /* pinned to the bottom so the buttons line up whatever the title length */
  margin-top: auto;
  padding-top: var(--sp-5);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--sp-3);
}

.bro__btn {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  min-height: 42px;
  padding: 10px 22px;
  border: 1px solid var(--c-line);
  border-radius: 999px;
  background: var(--c-surface);
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  color: var(--c-primary-900);
  text-decoration: none;
  transition: background-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}

.bro__btn:hover {
  border-color: var(--c-primary-900);
}

.bro__btn--primary {
  border-color: var(--c-accent-600);
  background: var(--c-accent-600);
  color: #fff;
}

.bro__btn--primary:hover {
  border-color: var(--c-accent-700);
  background: var(--c-accent-700);
}

@media (min-width: 760px) {
  .shelf__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (prefers-reduced-motion: reduce) {
  .bro__cover,
  .bro__sheen {
    transition: none;
  }
}
</style>
