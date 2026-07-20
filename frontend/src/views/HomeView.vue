<script setup>
import { onMounted } from 'vue'
import HomeHero from '@/components/home/HomeHero.vue'
import QuickActions from '@/components/home/QuickActions.vue'
import BrandStatement from '@/components/home/BrandStatement.vue'
import TrustBar from '@/components/home/TrustBar.vue'
import TestimonialSlider from '@/components/home/TestimonialSlider.vue'
import ProductTile from '@/components/products/ProductTile.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import AccordionList from '@/components/ui/AccordionList.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import { fetchProducts, useAsyncData } from '@/api/catalog.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, home } = useI18n()

const { data: products, loading, failed, load } = useAsyncData(fetchProducts)

const tones = ['blue', 'teal', 'deep', 'warm']

useSeo({ title: home.meta.title, description: home.meta.description, path: '/' })

onMounted(load)
</script>

<template>
  <div>
    <HomeHero />

    <!-- Paired action cards directly under the hero -->
    <QuickActions :items="home.quickActions" />

    <!-- Brand statement band -->
    <BrandStatement :title="home.statement.title" :body="home.statement.body" />

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

    <TrustBar />

    <!-- Why a heat pump — teaser -->
    <section class="section">
      <div class="container">
        <SectionHeading
          :eyebrow="home.whyTeaser.eyebrow"
          :title="home.whyTeaser.title"
          align="center"
        />
        <ul class="teaser">
          <li v-for="item in home.whyTeaser.items" :key="item.title" class="teaser__item">
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
}
</style>
