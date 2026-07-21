<script setup>
import { onMounted } from 'vue'
import HomeHero from '@/components/home/HomeHero.vue'
import BrandStatement from '@/components/home/BrandStatement.vue'
import TestimonialSlider from '@/components/home/TestimonialSlider.vue'
import ProductTile from '@/components/products/ProductTile.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import AccordionList from '@/components/ui/AccordionList.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import { fetchProducts, useAsyncData } from '@/api/catalog.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, home } = useI18n()

const { data: products, loading, failed, load } = useAsyncData(fetchProducts)

const tones = ['blue', 'teal', 'deep', 'warm']

// Matches the order of home.whyTeaser.items: savings, independence, ecology.
const teaserIcons = ['savings', 'independence', 'ecology']

useSeo({ title: home.meta.title, description: home.meta.description, path: '/' })

onMounted(load)
</script>

<template>
  <div>
    <HomeHero />

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
          <BaseButton :to="{ name: 'why' }" variant="secondary" class="intro__cta">
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

    <!-- Product categories, from GET /api/v1/products -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :eyebrow="home.products.eyebrow"
          :title="home.products.title"
          :subtitle="home.products.subtitle"
          align="center"
        />

        <p v-if="loading" class="state muted">{{ common.loading }}</p>

        <div v-else-if="failed" class="state state--error">
          <p>{{ common.loadError }}</p>
          <BaseButton variant="secondary" size="sm" @click="load">{{ common.retry }}</BaseButton>
        </div>

        <ul v-else class="tiles">
          <li v-for="(product, index) in products" :key="product.slug">
            <ProductTile :product="product" :tone="tones[index % tones.length]" />
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
        <div class="section__footer">
          <BaseButton :to="{ name: 'why' }">{{ home.whyTeaser.cta }}</BaseButton>
        </div>
      </div>
    </section>

    <!-- Testimonials (placeholder content, see i18n/bg/home.js) -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading :eyebrow="home.testimonials.eyebrow" :title="home.testimonials.title" />
        <TestimonialSlider :items="home.testimonials.items" />
        <p class="disclaimer">{{ home.testimonials.disclaimer }}</p>
      </div>
    </section>

    <CtaBand :title="home.finalCta.title" :text="home.finalCta.text" />
  </div>
</template>

<style scoped>
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

.disclaimer {
  margin-top: var(--sp-5);
  font-size: 0.78rem;
  color: var(--c-ink-muted);
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
