<script setup>
import { onMounted } from 'vue'
import HomeHero from '@/components/home/HomeHero.vue'
import BrandStatement from '@/components/home/BrandStatement.vue'
import HeatPumpDiagram from '@/components/why/HeatPumpDiagram.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import AccordionList from '@/components/ui/AccordionList.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import BrochureShelf from '@/components/home/BrochureShelf.vue'
import { cachedProducts, fetchProducts, useAsyncData } from '@/api/catalog.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, home, why, categories } = useI18n()

const { data: products, loading, failed, load } = useAsyncData(fetchProducts, cachedProducts())

/* The app replaces the prerendered page on load, so a video playing there would restart. */
const prerender = import.meta.env.SSR


/* Condensed version of the Защо термопомпа page, so the essentials sit on the home
   page as they do on the reference, without duplicating the copy. */
const knowledgeItems = [
  { title: why.cycle.title, text: why.cycle.intro },
  { title: why.threeInOne.title, text: why.threeInOne.intro },
  { title: why.pv.title, text: why.pv.body[0] },
  { title: why.buildings.title, text: why.buildings.newBuild.text },
  { title: why.subsidies.title, text: why.subsidies.body[0] }
]

// Matches the order of home.whyTeaser.items: savings, independence, ecology.
const teaserIcons = ['savings', 'independence', 'ecology']

useSeo({ title: home.meta.title, description: home.meta.description, path: '/' })

onMounted(load)
</script>

<template>
  <div>
    <HomeHero />

    <!-- Brand film, directly below the hero — as on ochsner.com/en. Full
         content-width, rounded corners, autoplaying muted with controls. -->
    <section class="home-video">
      <div class="container">
        <div class="home-video__frame">
          <video
            class="home-video__player"
            :poster="home.video.poster"
            :aria-label="home.video.label"
            :autoplay="!prerender"
            muted
            playsinline
            controls
            preload="metadata"
          >
            <source :src="home.video.src" type="video/webm" />
          </video>
        </div>
      </div>
    </section>

    <!-- Brand statement band -->
    <BrandStatement :title="home.statement.title" :body="home.statement.body" />

    <!-- What a heat pump is, and why this manufacturer -->
    <section class="section">
      <div class="container intro">
        <div>
          <SectionHeading :eyebrow="home.intro.eyebrow" :title="home.intro.title" />
          <p v-for="paragraph in home.intro.body" :key="paragraph" class="intro__paragraph">
            {{ paragraph }}
          </p>
          <BaseButton href="#kak-raboti" variant="secondary" class="intro__cta">
            {{ home.whyTeaser.cta }}
          </BaseButton>
        </div>
        <ul class="intro__facts">
          <li v-for="fact in home.trust.items" :key="fact.label">
            <span class="intro__fact-value">{{ fact.value }}</span>
            <span class="intro__fact-label">{{ fact.label }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Whole range, six across — the corporate home page strip -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :strong="home.range.strong"
          :title="home.range.light"
          align="center"
          level="h2"
        />
        <ul class="range">
          <li v-for="p in products || []" :key="p.slug">
            <RouterLink class="range__card" :to="{ name: 'product-category', params: { slug: p.slug } }">
              <span class="range__media">
                <img
                  v-if="categories[p.slug]"
                  :src="categories[p.slug].strip"
                  :alt="p.title"
                  loading="lazy"
                  decoding="async"
                />
              </span>
              <span class="range__label">{{ p.title }}</span>
            </RouterLink>
          </li>
        </ul>
        <div class="section__footer">
          <BaseButton :to="{ name: 'products' }" variant="secondary">
            {{ home.products.cta }}
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Why OCHSNER — presented as a disclosure list, as on the corporate site -->
    <section class="section">
      <div class="container">
        <SectionHeading :eyebrow="home.advantages.eyebrow" :title="home.advantages.title" />
        <AccordionList :items="home.advantages.items" />
      </div>
    </section>

    <!-- Why a heat pump — teaser -->
    <section class="section">
      <div class="container">
        <!-- Intro block, laid out as on ochsner.com/en: heading, copy, image below. -->
        <div class="hp-intro">
          <h2 class="hp-intro__title">{{ home.whyTeaser.heading }}</h2>
          <p class="hp-intro__text">{{ home.whyTeaser.body }}</p>
          <figure class="hp-intro__media">
            <img
              :src="home.whyTeaser.image"
              :alt="home.whyTeaser.imageAlt"
              loading="lazy"
              decoding="async"
            />
          </figure>
        </div>

        <SectionHeading
          :eyebrow="home.whyTeaser.eyebrow"
          :title="home.whyTeaser.title"
          align="center"
        />
        <ul class="teaser">
          <li v-for="(item, i) in home.whyTeaser.items" :key="item.title" class="teaser__item">
            <span class="teaser__icon">
              <AppIcon :name="teaserIcons[i % teaserIcons.length]" :size="28" />
            </span>
            <h3 class="teaser__title">{{ item.title }}</h3>
            <p class="teaser__text">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- How a heat pump works — moved here from Защо термопомпа, so the
         explanation sits on the home page as it does on the reference. -->
    <section id="kak-raboti" class="section section--alt">
      <div class="container">
        <SectionHeading
          :strong="why.cycle.title.split(' ').slice(0, 2).join(' ')"
          :title="why.cycle.title.split(' ').slice(2).join(' ')"
          :subtitle="why.cycle.intro"
          level="h2"
          rule
        />

        <HeatPumpDiagram />

        <ol class="steps">
          <li v-for="step in why.cycle.steps" :key="step.number" class="step">
            <span class="step__num" aria-hidden="true">{{ step.number }}</span>
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__text">{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Everything about heat pumps, condensed — the reference carries this
         body of explanation on its home page rather than only on a sub-page. -->
    <section class="section section--alt">
      <div class="container container--narrow">
        <SectionHeading
          :strong="home.knowledge.strong"
          :title="home.knowledge.light"
          :subtitle="home.knowledge.intro"
          level="h2"
          rule
        />
        <AccordionList :items="knowledgeItems" :default-open="-1" />
      </div>
    </section>

    <!-- Testimonials removed at the client's request: the placeholder reviews
         were fictional. TestimonialSlider.vue is kept — give it real customer
         quotes ({ quote, author, location }) to restore the section. -->

    <!-- Social feed removed at the client's request. SocialFeed.vue, the
         /api/v1/social endpoint and the collected posts are all kept — drop
         <SocialFeed /> back in here to restore it. -->

    <BrochureShelf />

    <CtaBand :title="home.finalCta.title" :text="home.finalCta.text" />
  </div>
</template>

<style scoped>
/* --- brand film below the hero ------------------------------------------ */
.home-video {
  /* Sits close under the hero, matching the reference's tight placement. */
  padding-block: clamp(var(--sp-5), 3vw, var(--sp-7));
}

.home-video__frame {
  width: 100%;
  /* Native ratio of the film (1694 × 720), so it fills without letterboxing. */
  aspect-ratio: 1694 / 720;
  border-radius: 20px;
  overflow: hidden;
  background: #000;
}

.home-video__player {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- „Термопомпи" intro block, mirroring ochsner.com/en -------------------- */
.hp-intro {
  max-width: 760px;
  margin: 0 auto var(--sp-8);
}

.hp-intro__title {
  font-size: 1.5rem;
  font-weight: var(--fw-bold);
  line-height: 1.25;
  color: var(--c-primary-900);
}

.hp-intro__text {
  margin-top: var(--sp-4);
  line-height: var(--lh-body);
  color: var(--c-ink-soft);
}

.hp-intro__media {
  margin: var(--sp-5) 0 0;
  border-radius: 6px;
  overflow: hidden;
}

.hp-intro__media img {
  display: block;
  width: 100%;
  /* Native ratio of the reference image (≈16:9). */
  aspect-ratio: 16 / 9;
  object-fit: cover;
}

/* --- how it works: numbered steps under the cycle diagram ---------------- */
.steps {
  margin-top: var(--sp-7);
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-5);
}

/* Deep white card on a light field: generous padding, large radius, an outlined
   step marker at the top and a heavy heading under it. */
.step {
  display: flex;
  flex-direction: column;
  padding: clamp(var(--sp-5), 2.4vw, var(--sp-7));
  background: var(--c-surface);
  border-radius: 24px;
}

.step__num {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  margin-bottom: var(--sp-5);
  border: 2px solid var(--c-primary-600);
  border-radius: 50%;
  background: transparent;
  color: var(--c-primary-700);
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: var(--fw-bold);
}

.step__title {
  font-size: clamp(1.25rem, 1rem + 0.9vw, 1.75rem);
  font-weight: var(--fw-bold);
  line-height: 1.15;
  color: var(--c-primary-900);
}

.step__text {
  margin-top: var(--sp-4);
  color: var(--c-ink);
  line-height: var(--lh-body);
}

@media (min-width: 700px) {
  .steps {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1080px) {
  .steps {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* --- whole-range strip --------------------------------------------------- */
.range {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-4);
  grid-template-columns: repeat(2, 1fr);
}

.range__card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--c-surface);
  text-decoration: none;
  color: inherit;
  transition: transform var(--dur) var(--ease);
}

.range__card:hover {
  transform: translateY(-3px);
}

/* The gradient behind each product group is baked into the artwork. */
.range__media {
  display: block;
  aspect-ratio: 600 / 329;
  overflow: hidden;
}

.range__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.range__label {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: var(--sp-4) var(--sp-3);
  text-align: center;
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 0.9375rem;
  line-height: var(--lh-snug);
  color: var(--c-primary-900);
}

@media (min-width: 700px) {
  .range {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1080px) {
  /* Six across, as on the reference. */
  .range {
    grid-template-columns: repeat(6, 1fr);
  }
}

.state {
  padding: var(--sp-5) 0;
}

.state--error {
  display: grid;
  gap: var(--sp-4);
  justify-items: start;
  padding: var(--sp-5);
  border-left: 3px solid var(--c-error);
  background: var(--c-surface);
}

/* Category tiles: two up on phones, four across on desktop. */
.tiles {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sp-4);
}

.tiles > li {
  display: flex;
}

.tiles > li > * {
  width: 100%;
}

.section__footer {
  margin-top: var(--sp-6);
  display: flex;
  justify-content: center;
}

.teaser {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-5);
}

.teaser__item {
  padding-left: var(--sp-5);
  border-left: 3px solid var(--c-accent-600);
}

.teaser__icon {
  display: block;
  margin-bottom: var(--sp-3);
  color: var(--c-accent-600);
}

/* Intro: copy alongside the trust figures */
.intro {
  display: grid;
  gap: var(--sp-6);
}

.intro__paragraph {
  color: var(--c-ink-soft);
  max-width: 62ch;
}

.intro__paragraph + .intro__paragraph {
  margin-top: var(--sp-4);
}

.intro__cta {
  margin-top: var(--sp-5);
}

.intro__facts {
  align-self: start;
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-4);
}

.intro__facts li {
  padding: var(--sp-4) var(--sp-5);
  background: var(--c-surface-alt);
  border-left: 3px solid var(--c-accent-600);
}

.intro__fact-value {
  display: block;
  font-family: var(--font-heading);
  font-size: 1.6rem;
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
  line-height: 1.1;
}

.intro__fact-label {
  display: block;
  margin-top: var(--sp-1);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.teaser__title {
  color: var(--c-primary-900);
}

.teaser__text {
  margin-top: var(--sp-2);
  color: var(--c-ink-soft);
  font-size: 0.9375rem;
}

@media (min-width: 760px) {
  .teaser {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1000px) {
  .tiles {
    grid-template-columns: repeat(4, 1fr);
  }

  .intro {
    grid-template-columns: 1.6fr 1fr;
    gap: var(--sp-8);
  }
}
</style>
