<script setup>
/**
 * Product overview, mirroring ochsner.com/en/heat-pumps/.
 *
 * The reference lays the range out as six white cards on a light field, two per
 * row: photo on top, then the category heading, a short description, a red pill
 * linking into the category page, and a row of model pills tinted with that
 * category's own --heatpumptype-color.
 *
 * Card copy comes from the catalogue API so it cannot drift from the product
 * data; the imagery and the model list come from i18n/bg/categories.js.
 */
import { computed, onMounted, ref } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import HelpfulLinks from '@/components/products/HelpfulLinks.vue'
import { fetchProducts, useAsyncData } from '@/api/catalog.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, products: copy, categories } = useI18n()
const page = ref(null)

const { data: items, loading, failed, load } = useAsyncData(fetchProducts)

/* Catalogue entry + editorial content, joined on the slug. */
const cards = computed(() =>
  (items.value || [])
    .map((p) => ({ product: p, content: categories[p.slug] }))
    .filter((c) => c.content)
)

useSeo({ title: copy.meta.title, description: copy.meta.description, path: '/produkti' })

onMounted(() => load())
</script>

<template>
  <div ref="page">
    <!-- Hero: two-weight headline over the tinted field, as on the reference -->
    <section class="hero">
      <div class="container">
        <h1 class="hero__title">
          <strong>{{ copy.hero.heading.strong }}</strong> {{ copy.hero.heading.light }}
        </h1>
        <p class="hero__lead">{{ copy.hero.subtitle }}</p>
      </div>
    </section>

    <p v-if="loading" class="container state muted">{{ common.loading }}</p>

    <div v-else-if="failed" class="container state state--error">
      <p>{{ common.loadError }}</p>
      <BaseButton variant="secondary" size="sm" @click="load">{{ common.retry }}</BaseButton>
    </div>

    <section v-else class="section cards-band">
      <div class="container">
        <ul class="cards">
          <li
            v-for="{ product, content } in cards"
            :key="product.slug"
            class="card"
            :style="{ '--type-tint': content.tint }"
          >
            <div class="card__media">
              <img
                :src="content.card.image"
                :alt="product.title"
                :style="{ objectFit: content.card.fit }"
                loading="lazy"
                decoding="async"
              />
            </div>

            <div class="card__body">
              <h2 class="card__title">{{ product.title }}</h2>
              <p class="card__text">{{ product.shortDescription }}</p>

              <BaseButton
                :to="{ name: 'product-category', params: { slug: product.slug } }"
                class="card__cta"
              >
                {{ copy.cardCta }}
              </BaseButton>

              <ul v-if="content.models.items.some((m) => m.key)" class="pills">
                <li v-for="model in content.models.items" :key="model.name">
                  <RouterLink
                    v-if="model.key"
                    class="pill"
                    :to="{ name: 'product-model', params: { slug: product.slug, model: model.key } }"
                  >
                    {{ model.name.replace('OCHSNER ', '') }}
                    <AppIcon name="arrowRight" :size="14" />
                  </RouterLink>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Comparison table -->
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

    <!-- Helpful links, as the reference closes its overview page -->
    <section class="section section--tintless">
      <div class="container">
        <HelpfulLinks />
      </div>
    </section>

    <CtaBand :title="copy.ctaBand.title" :text="copy.ctaBand.text" />
  </div>
</template>

<style scoped>
/* --- hero --------------------------------------------------------------- */
.hero {
  padding-block: var(--section-y);
  background: var(--c-surface-alt);
}

.hero__title {
  font-size: var(--fs-h1);
  font-weight: var(--fw-light);
  line-height: 1.19;
  color: var(--c-ink);
  max-width: 18ch;
  text-wrap: balance;
}

.hero__title strong {
  font-weight: var(--fw-bold);
}

.hero__lead {
  margin-top: var(--sp-5);
  max-width: 68ch;
  color: var(--c-ink);
  line-height: var(--lh-body);
}

.state {
  padding-block: var(--sp-7);
}

.state--error {
  display: grid;
  gap: var(--sp-4);
  justify-items: start;
}

/* --- the six cards ------------------------------------------------------ */
.cards-band {
  background: var(--c-surface-alt);
}

.cards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-5);
}

.card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: var(--c-surface);
  border-radius: 20px;
}

.card__media {
  aspect-ratio: 835 / 457;
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 10%, #fff);
}

.card__media img {
  display: block;
  width: 100%;
  height: 100%;
}

.card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: clamp(var(--sp-5), 2.4vw, var(--sp-7));
}

.card__title {
  color: var(--c-primary-900);
}

.card__text {
  margin-top: var(--sp-4);
  flex: 1;
  color: var(--c-ink);
  line-height: var(--lh-body);
}

.card__cta {
  margin-top: var(--sp-5);
  align-self: flex-start;
}

/* The reference sets the card's primary action at 18px with 20/30 padding. */
.card__cta :deep(.btn),
.card__cta.btn {
  font-size: 1.125rem;
  padding: 20px 30px;
}

/* Model pills carry the category's own accent, as on the reference. */
.pills {
  margin-top: var(--sp-4);
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
}

.pill {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 14px 24px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 10%, #fff);
  color: var(--type-tint, #6b8fa3);
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: var(--fw-medium);
  text-transform: uppercase;
  text-decoration: none;
  white-space: nowrap;
  transition: background-color var(--dur) var(--ease);
}

.pill:hover {
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 20%, #fff);
}

/* --- comparison table --------------------------------------------------- */
.table-wrap {
  overflow-x: auto;
}

.table {
  width: 100%;
  border-collapse: collapse;
  min-width: 560px;
}

.table th,
.table td {
  padding: var(--sp-4);
  text-align: left;
  border-bottom: 1px solid var(--c-line);
  font-size: var(--fs-small);
}

.table thead th {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
  border-bottom: 2px solid var(--c-primary-300);
}

.table tbody th {
  font-weight: var(--fw-semibold);
  color: var(--c-primary-900);
}

.table__note {
  margin-top: var(--sp-4);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

/* --- helpful links ------------------------------------------------------ */
.section--tintless {
  background: var(--c-surface-alt);
}

@media (min-width: 1000px) {
  /* Two cards per row, three rows — the reference layout. */
  .cards {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sp-6);
  }
}
</style>
