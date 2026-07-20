<script setup>
import { computed, onMounted, ref } from 'vue'
import PageHero from '@/components/ui/PageHero.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import { fetchProducts, fetchReferences, useAsyncData } from '@/api/catalog.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, references: copy } = useI18n()
const page = ref(null)

const { data: items, loading, failed, load } = useAsyncData(async () => {
  // Products are fetched alongside so the technology label can be resolved by slug.
  const [refs, products] = await Promise.all([fetchReferences(), fetchProducts()])
  const titleBySlug = Object.fromEntries(products.map((p) => [p.slug, p.title]))
  return refs.map((entry) => ({ ...entry, categoryTitle: titleBySlug[entry.categorySlug] || '' }))
})

const tones = ['blue', 'teal', 'deep', 'warm']
const isEmpty = computed(() => !loading.value && !failed.value && items.value?.length === 0)

useSeo({ title: copy.meta.title, description: copy.meta.description, path: '/referencii' })

onMounted(() => load())
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
        <p v-if="loading" class="state muted">{{ common.loading }}</p>

        <div v-else-if="failed" class="state state--error">
          <p>{{ common.loadError }}</p>
          <BaseButton variant="secondary" size="sm" @click="load">{{ common.retry }}</BaseButton>
        </div>

        <div v-else-if="isEmpty" class="state">
          <h2>{{ copy.emptyTitle }}</h2>
          <p class="muted">{{ copy.emptyText }}</p>
        </div>

        <template v-else>
          <ul class="refs">
            <li v-for="(item, index) in items" :key="item.id" class="ref">
              <PlaceholderImage
                :label="item.title"
                :tone="tones[index % tones.length]"
                ratio="4 / 3"
              />
              <div class="ref__body">
                <h2 class="ref__title">{{ item.title }}</h2>
                <p class="ref__meta">
                  <span>{{ item.location }}</span>
                  <span v-if="item.year" aria-hidden="true">·</span>
                  <span v-if="item.year">{{ item.year }}</span>
                </p>
                <p class="ref__summary">{{ item.summary }}</p>
                <p v-if="item.categoryTitle" class="ref__tag">{{ item.categoryTitle }}</p>
              </div>
            </li>
          </ul>
          <p class="disclaimer">{{ copy.placeholderNote }}</p>
        </template>
      </div>
    </section>

    <CtaBand :title="copy.ctaBand.title" :text="copy.ctaBand.text" />
  </div>
</template>

<style scoped>
.state {
  padding-block: var(--sp-6);
  display: grid;
  gap: var(--sp-3);
  justify-items: start;
}

.refs {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-5);
}

.ref {
  display: flex;
  flex-direction: column;
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

.ref:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-lg);
}

.ref__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: var(--sp-5);
}

.ref__title {
  font-size: var(--fs-h3);
  color: var(--c-primary-800);
}

.ref__meta {
  margin-top: var(--sp-2);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.ref__summary {
  margin-top: var(--sp-3);
  font-size: 0.95rem;
  color: var(--c-ink-soft);
}

.ref__tag {
  margin-top: auto;
  padding-top: var(--sp-4);
  font-family: var(--font-heading);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--c-primary-600);
}

.disclaimer {
  margin-top: var(--sp-6);
  font-size: 0.8rem;
  color: var(--c-ink-muted);
}

@media (min-width: 640px) {
  .refs {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .refs {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
