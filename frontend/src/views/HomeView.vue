<script setup>
import { onMounted, ref } from 'vue'
import HomeHero from '@/components/home/HomeHero.vue'
import AdvantageTiles from '@/components/home/AdvantageTiles.vue'
import TrustBar from '@/components/home/TrustBar.vue'
import TestimonialGrid from '@/components/home/TestimonialGrid.vue'
import ProductCard from '@/components/products/ProductCard.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import { fetchProducts, useAsyncData } from '@/api/catalog.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, home, contactDetails } = useI18n()
const page = ref(null)

const { data: products, loading, failed, load } = useAsyncData(fetchProducts)

// Product cards alternate tone so the four-card grid reads as a set, not a wall.
const tones = ['blue', 'teal', 'deep', 'warm']

useSeo({ title: home.meta.title, description: home.meta.description, path: '/' })

// Product cards arrive after the first paint, so they need to be registered
// with the reveal observer once they exist.
onMounted(() => load())
</script>

<template>
  <div ref="page">
    <HomeHero />

    <!-- Intro: what a heat pump is and why OCHSNER -->
    <section class="section">
      <div class="container intro">
        <div class="intro__copy">
          <SectionHeading :eyebrow="home.intro.eyebrow" :title="home.intro.title" />
          <p v-for="paragraph in home.intro.body" :key="paragraph" class="intro__paragraph">
            {{ paragraph }}
          </p>
          <BaseButton :to="{ name: 'why' }" variant="secondary" class="intro__cta">
            {{ home.whyTeaser.cta }}
          </BaseButton>
        </div>
        <div class="intro__media">
          <PlaceholderImage
            :label="common.imagePlaceholder"
            tone="teal"
            ratio="3 / 4"
            icon="⌂"
          />
        </div>
      </div>
    </section>

    <!-- Product categories, sourced from GET /api/v1/products -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :eyebrow="home.products.eyebrow"
          :title="home.products.title"
          :subtitle="home.products.subtitle"
        />

        <p v-if="loading" class="state muted">{{ common.loading }}</p>

        <div v-else-if="failed" class="state state--error">
          <p>{{ common.loadError }}</p>
          <BaseButton variant="secondary" size="sm" @click="load">{{ common.retry }}</BaseButton>
        </div>

        <div v-else class="grid grid--cards">
          <ProductCard
            v-for="(product, index) in products"
            :key="product.slug"
            :product="product"
            :tone="tones[index % tones.length]"
          />
        </div>

        <div class="section__footer">
          <BaseButton :to="{ name: 'products' }" variant="secondary">
            {{ home.products.cta }}
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Why OCHSNER -->
    <section class="section">
      <div class="container">
        <SectionHeading
          :eyebrow="home.advantages.eyebrow"
          :title="home.advantages.title"
          align="center"
        />
        <AdvantageTiles :items="home.advantages.items" />
      </div>
    </section>

    <TrustBar />

    <!-- Why a heat pump — teaser -->
    <section class="section section--alt">
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
    <section class="section">
      <div class="container">
        <SectionHeading
          :eyebrow="home.testimonials.eyebrow"
          :title="home.testimonials.title"
          align="center"
        />
        <TestimonialGrid :items="home.testimonials.items" />
        <p class="disclaimer">{{ home.testimonials.disclaimer }}</p>
      </div>
    </section>

    <CtaBand :title="home.finalCta.title" :text="home.finalCta.text" />

    <p class="visually-hidden">{{ home.finalCta.secondary }}: {{ contactDetails.phone }}</p>
  </div>
</template>

<style scoped>
.intro {
  display: grid;
  gap: var(--sp-6);
}

.intro__paragraph + .intro__paragraph {
  margin-top: var(--sp-4);
}

.intro__paragraph {
  color: var(--c-ink-soft);
  max-width: 62ch;
}

.intro__cta {
  margin-top: var(--sp-5);
}

.state {
  padding: var(--sp-5) 0;
}

.state--error {
  display: grid;
  gap: var(--sp-4);
  justify-items: start;
  padding: var(--sp-5);
  border: 1px solid var(--c-line);
  border-left: 3px solid var(--c-error);
  border-radius: var(--radius);
  background: var(--c-surface);
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
  border-left: 3px solid var(--c-accent-500);
}

.teaser__title {
  color: var(--c-primary-800);
}

.teaser__text {
  margin-top: var(--sp-2);
  color: var(--c-ink-soft);
  font-size: 0.95rem;
}

.disclaimer {
  margin-top: var(--sp-5);
  text-align: center;
  font-size: 0.78rem;
  color: var(--c-ink-muted);
}

@media (min-width: 760px) {
  .teaser {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 960px) {
  .intro {
    grid-template-columns: 1.5fr 1fr;
    align-items: center;
    gap: var(--sp-7);
  }
}
</style>
