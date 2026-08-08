<script setup>
import { onMounted, ref } from 'vue'
import PageHero from '@/components/ui/PageHero.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import { fetchProducts, useAsyncData } from '@/api/catalog.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, products: copy } = useI18n()
const page = ref(null)

const { data: items, loading, failed, load } = useAsyncData(fetchProducts)
const tones = ['blue', 'teal', 'deep', 'warm']

useSeo({ title: copy.meta.title, description: copy.meta.description, path: '/produkti' })

onMounted(() =>
  load().then(() => {
    // Deep links like /produkti#zemya-voda only resolve after the sections exist.
    if (window.location.hash) {
      document.querySelector(window.location.hash)?.scrollIntoView({ behavior: 'smooth' })
    }
  })
)
</script>

<template>
  <div ref="page">
    <PageHero
      :eyebrow="copy.hero.eyebrow"
      :title="copy.hero.title"
      :subtitle="copy.hero.subtitle"
    />

    <p v-if="loading" class="container state muted">{{ common.loading }}</p>

    <div v-else-if="failed" class="container state state--error">
      <p>{{ common.loadError }}</p>
      <BaseButton variant="secondary" size="sm" @click="load">{{ common.retry }}</BaseButton>
    </div>

    <template v-else>
      <!-- Quick jump — a short in-page nav beats four separate thin routes here. -->
      <nav class="jump" aria-label="Продуктови категории">
        <div class="container jump__inner">
          <span class="jump__label">{{ copy.jumpLabel }}</span>
          <ul class="jump__list">
            <li v-for="item in items" :key="item.slug">
              <a :href="`#${item.slug}`">{{ item.title }}</a>
            </li>
          </ul>
        </div>
      </nav>

      <section
        v-for="(item, index) in items"
        :id="item.slug"
        :key="item.slug"
        class="section"
        :class="{ 'section--alt': index % 2 === 1 }"
      >
        <div class="container product" :class="{ 'product--flip': index % 2 === 1 }">
          <div class="product__media">
            <PlaceholderImage
              :src="item.imageUrl"
              :label="item.title"
              :tone="tones[index % tones.length]"
              surface="none"
              inset="4%"
              ratio="4 / 3"
            />
          </div>

          <div class="product__body">
            <h2 class="product__title">{{ item.title }}</h2>
            <p class="product__lead">{{ item.shortDescription }}</p>
            <p class="product__text">{{ item.description }}</p>

            <h3 class="product__subtitle">{{ copy.advantagesLabel }}</h3>
            <ul class="product__advantages">
              <li v-for="advantage in item.advantages" :key="advantage">{{ advantage }}</li>
            </ul>

            <div class="product__suitable">
              <h3 class="product__subtitle">{{ copy.suitableForLabel }}</h3>
              <p>{{ item.suitableFor }}</p>
            </div>

            <div class="product__actions">
              <BaseButton :to="{ name: 'contact' }">{{ common.ctaPrice }}</BaseButton>
              <!-- PDF placeholders; real datasheets go in /public/downloads. -->
              <a class="product__pdf" :href="item.datasheetUrl" download>
                {{ common.downloadSpec }}
              </a>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <SectionHeading :title="copy.comparison.title" align="center" level="h2" />
          <div class="table-wrap">
            <table class="table">
              <thead>
                <tr>
                  <th v-for="column in copy.comparison.columns" :key="column" scope="col">
                    {{ column }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in copy.comparison.rows" :key="row[0]">
                  <th scope="row">{{ row[0] }}</th>
                  <td v-for="(cell, i) in row.slice(1)" :key="i">{{ cell }}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p class="table__note">{{ copy.comparison.note }}</p>
        </div>
      </section>
    </template>

    <CtaBand :title="copy.ctaBand.title" :text="copy.ctaBand.text" />
  </div>
</template>

<style scoped>
.state {
  padding-block: var(--sp-7);
}

.state--error {
  display: grid;
  gap: var(--sp-4);
  justify-items: start;
}

.jump {
  border-bottom: 1px solid var(--c-line);
  background: var(--c-surface-alt);
  padding-block: var(--sp-4);
}

.jump__inner {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-3);
}

.jump__label {
  font-size: var(--fs-small);
  font-weight: 600;
  color: var(--c-ink-muted);
}

.jump__list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.jump__list a {
  display: inline-block;
  padding: var(--sp-2) var(--sp-3);
  border: 1px solid var(--c-line);
  border-radius: 999px;
  background: var(--c-surface);
  font-size: var(--fs-small);
  text-decoration: none;
  white-space: nowrap;
}

.jump__list a:hover {
  border-color: var(--c-primary-300);
  background: var(--c-primary-50);
}

.product {
  display: grid;
  gap: var(--sp-6);
}

.product__title {
  color: var(--c-primary-800);
}

.product__lead {
  margin-top: var(--sp-3);
  font-size: var(--fs-lead);
  color: var(--c-ink);
}

.product__text {
  margin-top: var(--sp-4);
  color: var(--c-ink-soft);
  max-width: 62ch;
}

.product__subtitle {
  margin-top: var(--sp-5);
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-primary-600);
}

.product__advantages {
  margin-top: var(--sp-3);
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-3);
}

.product__advantages li {
  position: relative;
  padding-left: var(--sp-6);
  color: var(--c-ink-soft);
}

.product__advantages li::before {
  content: '✓';
  position: absolute;
  left: 0;
  top: 0;
  display: grid;
  place-items: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--c-primary-50);
  color: var(--c-primary-600);
  font-size: 0.75rem;
}

.product__suitable p {
  margin-top: var(--sp-3);
  padding: var(--sp-4);
  border-left: 3px solid var(--c-accent-500);
  background: var(--c-accent-100);
  border-radius: 0 var(--radius) var(--radius) 0;
  color: var(--c-ink);
  font-size: 0.95rem;
}

.product__actions {
  margin-top: var(--sp-6);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sp-4);
}

.product__pdf {
  font-size: var(--fs-small);
  font-weight: 600;
}

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
}

.table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: 0.92rem;
}

.table th,
.table td {
  padding: var(--sp-3) var(--sp-4);
  text-align: left;
  border-bottom: 1px solid var(--c-line-soft);
}

.table thead th {
  background: var(--c-primary-50);
  font-family: var(--font-heading);
  color: var(--c-primary-800);
  white-space: nowrap;
}

.table tbody th {
  font-weight: 600;
  color: var(--c-ink);
}

.table__note {
  margin-top: var(--sp-3);
  font-size: 0.8rem;
  color: var(--c-ink-muted);
}

@media (min-width: 560px) {
  .product__actions {
    flex-direction: row;
    align-items: center;
  }
}

@media (min-width: 960px) {
  .product {
    grid-template-columns: 1fr 1.15fr;
    align-items: center;
    gap: var(--sp-7);
  }

  /* Alternating sections mirror the layout to break the vertical rhythm. */
  .product--flip .product__media {
    order: 2;
  }
}
</style>
