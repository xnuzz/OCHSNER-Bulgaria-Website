<script setup>
/**
 * Individual unit page, mirroring the reference's numbered product pages
 * (/en/heat-pumps/air-heat-pumps/air-hawk/397/):
 *
 *   full-strength band of the category colour with a centred kicker, name,
 *   output range and description → white card with the product render beside
 *   four colour-coded spec tiles → "suitable for" → the rest of the series →
 *   back to the series
 */
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, products: copy, variants, variantCommon, models, categories } = useI18n()
const route = useRoute()

const key = computed(() => route.params.variant)
const unit = computed(() => variants[key.value] || null)
const series = computed(() => (unit.value ? models[unit.value.model] : null))
const category = computed(() => (series.value ? categories[series.value.category] : null))
const tint = computed(() => (category.value && category.value.tint) || '#6b8fa3')

/* The rest of the series, for the cards at the foot of the page. */
const siblings = computed(() =>
  Object.entries(variants)
    .filter(([k, v]) => unit.value && v.model === unit.value.model && k !== key.value)
    .map(([k, v]) => ({ key: k, ...v }))
)

/* "Properties" mirrors the reference's second accordion: the series-level
   characteristics rather than measured figures. */
const properties = computed(() => {
  if (!series.value) return []
  const v = series.value.variants.items.find((x) => x.name === unit.value.name.replace('OCHSNER ', ''))
  const rows = []
  if (v) {
    v.tags.forEach((t) => rows.push(['Изпълнение', t]))
    if (v.footnote) rows.push(['Допълнително', v.footnote])
  }
  rows.push(['Серия', series.value.name])
  rows.push(['Диапазон на серията', series.value.range])
  return rows
})

function applySeo() {
  if (!unit.value) return
  useSeo({
    title: `${unit.value.name} | OCHSNER България`,
    description: unit.value.description.slice(0, 155),
    path: `/produkti/${series.value.category}/${unit.value.model}/${key.value}`
  })
}

applySeo()
watch(key, applySeo)

const page = ref(null)
</script>

<template>
  <div v-if="unit" ref="page" :style="{ '--type-tint': tint }">
    <!-- Band of the category colour carrying the whole introduction -->
    <section class="intro">
      <div class="container container--narrow intro__inner">
        <p class="intro__kicker">{{ series.kicker }}</p>
        <h1 class="intro__title">{{ unit.name }}</h1>
        <p class="intro__range">{{ unit.range }}</p>
        <p class="intro__text">{{ unit.description }}</p>
      </div>

      <!-- Product render beside the specification tiles -->
      <div class="container">
        <div class="panel">
          <div class="panel__media">
            <PlaceholderImage
              :src="unit.image"
              :label="unit.name"
              surface="none"
              inset="6%"
              ratio="1 / 1"
              eager
            />
          </div>

          <div class="panel__specs">
            <p class="climate">
              <span class="climate__note">{{ variantCommon.climateNote }}</span>
              <span class="climate__value">
                {{ variantCommon.climateValue }}
                <AppIcon name="ecology" :size="22" />
              </span>
            </p>

            <ul class="tiles">
              <li v-for="t in unit.tiles" :key="t.label" class="tile" :class="`tile--${t.tone}`">
                <span class="tile__value">{{ t.value }}</span>
                <span class="tile__label">{{ t.label }}</span>
              </li>
            </ul>

            <div class="panel__actions">
              <BaseButton :to="{ name: 'contact' }" size="lg">{{ variantCommon.quote }}</BaseButton>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Suitable for -->
    <section class="section">
      <div class="container container--narrow">
        <SectionHeading strong="Подходяща" title="за" level="h2" />
        <ul class="suitable">
          <li v-for="s in unit.suitableFor" :key="s">
            <AppIcon name="check" :size="18" />
            <span>{{ s }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Technical details, as the reference presents them -->
    <section class="section">
      <div class="container container--narrow">
        <SectionHeading
          :strong="variantCommon.techTitleStrong"
          :title="unit.name.replace('OCHSNER ', '')"
          level="h2"
          rule
        />

        <div class="acc">
          <details v-for="(g, gi) in unit.tech" :key="g.title" class="acc__item">
            <summary class="acc__head">
              <span class="acc__icon" aria-hidden="true"></span>
              <span>{{ g.title }}</span>
            </summary>
            <dl class="acc__body">
              <div v-for="row in g.rows" :key="row[0]" class="acc__row">
                <dt>{{ row[0] }}</dt>
                <dd>{{ row[1] }}</dd>
              </div>
            </dl>
          </details>

          <details class="acc__item">
            <summary class="acc__head">
              <span class="acc__icon" aria-hidden="true"></span>
              <span>{{ variantCommon.propsTitle }}</span>
            </summary>
            <dl class="acc__body">
              <div v-for="(row, i) in properties" :key="i" class="acc__row">
                <dt>{{ row[0] }}</dt>
                <dd>{{ row[1] }}</dd>
              </div>
            </dl>
          </details>
        </div>

        <!-- Full technical sheets live in the download centre. -->
        <p class="tech-more">
          {{ variantCommon.techMore }}
          <RouterLink :to="{ name: 'downloads' }">{{ variantCommon.techMoreLink }}</RouterLink>
        </p>
      </div>
    </section>

    <!-- The rest of the series -->
    <section v-if="siblings.length" class="section section--tint">
      <div class="container">
        <SectionHeading
          :title="`${series.name} — ${variantCommon.seriesTitle}`"
          level="h2"
          align="center"
        />
        <ul class="series">
          <li v-for="sib in siblings" :key="sib.key" class="sib">
            <div class="sib__media">
              <PlaceholderImage :src="sib.image" :label="sib.name" surface="alt" inset="8%" ratio="1 / 1" />
            </div>
            <h3 class="sib__name">{{ sib.name.replace('OCHSNER ', '') }}</h3>
            <p class="sib__range">{{ sib.range }}</p>
            <dl class="sib__specs">
              <div v-for="t in sib.tiles.slice(0, 3)" :key="t.label" class="sib__row">
                <dt>{{ t.label.split('(')[0].trim() }}</dt>
                <dd>{{ t.value }}</dd>
              </div>
            </dl>
            <BaseButton
              :to="{ name: 'product-variant', params: { slug: series.category, model: sib.model, variant: sib.key } }"
              size="sm"
            >
              {{ common.ctaMore }}
            </BaseButton>
          </li>
        </ul>
      </div>
    </section>

    <!-- Back to the series -->
    <section class="section">
      <div class="container container--narrow">
        <RouterLink
          class="back"
          :to="{ name: 'product-model', params: { slug: series.category, model: unit.model } }"
        >
          <AppIcon name="arrowLeft" :size="18" />
          {{ variantCommon.backToModel }}: {{ series.name }}
        </RouterLink>
      </div>
    </section>

    <CtaBand :title="copy.ctaBand.title" :text="copy.ctaBand.text" />
  </div>
</template>

<style scoped>
/* --- intro band --------------------------------------------------------- */
.intro {
  padding-block: var(--section-y);
  background: var(--type-tint, #6b8fa3);
  color: #fff;
}

.intro__inner {
  text-align: center;
}

.intro__kicker {
  font-family: var(--font-heading);
  font-size: 0.8rem;
  font-weight: var(--fw-light);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.92);
}

.intro__title {
  margin-top: var(--sp-4);
  font-size: var(--fs-h1);
  font-weight: var(--fw-bold);
  line-height: 1.1;
  color: #fff;
  max-width: none;
  text-transform: uppercase;
}

.intro__range {
  margin-top: var(--sp-3);
  font-size: var(--fs-lead);
  color: rgba(255, 255, 255, 0.94);
}

.intro__text {
  margin: var(--sp-5) auto 0;
  max-width: 76ch;
  color: rgba(255, 255, 255, 0.94);
  line-height: var(--lh-body);
}

/* --- product panel ------------------------------------------------------ */
.panel {
  margin-top: var(--sp-7);
  display: grid;
  gap: var(--sp-5);
}

.panel__media {
  background: #fff;
  border-radius: 20px;
  overflow: hidden;
}

.panel__specs {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.climate {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--sp-4);
  color: #fff;
}

.climate__note {
  font-size: var(--fs-small);
}

.climate__value {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-size: var(--fs-h3);
  font-weight: var(--fw-bold);
}

.tiles {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-4);
}

/* Tone palette taken from the reference's own tiles. */
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--sp-1);
  padding: var(--sp-5) var(--sp-4);
  border-radius: 10px;
  color: #fff;
  text-align: center;
}

.tile--class {
  background: #2d5a3d;
}

.tile--power {
  background: #8b2e2e;
}

.tile--eff {
  background: #2e4a5a;
}

.tile--sound {
  background: #5c4f3a;
}

.tile__value {
  font-family: var(--font-heading);
  font-size: clamp(1.4rem, 1rem + 1.4vw, 2rem);
  font-weight: var(--fw-bold);
  line-height: 1.1;
}

.tile__label {
  font-size: 0.8rem;
  line-height: 1.3;
  color: rgba(255, 255, 255, 0.9);
}

.panel__actions {
  margin-top: var(--sp-5);
}

/* --- suitable for ------------------------------------------------------- */
.suitable {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-3);
}

.suitable li {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  color: var(--c-ink);
}

.suitable :deep(svg) {
  flex: 0 0 auto;
  margin-top: 4px;
  color: var(--type-tint, #6b8fa3);
}

/* --- technical details accordion ---------------------------------------- */
.acc {
  display: grid;
  gap: var(--sp-4);
}

.acc__item {
  background: var(--c-surface);
  border-radius: 14px;
  box-shadow: var(--shadow-sm);
}

.acc__head {
  display: flex;
  align-items: center;
  gap: var(--sp-5);
  padding: 40px var(--sp-5);
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: var(--fw-regular);
  color: var(--c-primary-800);
  cursor: pointer;
  list-style: none;
}

.acc__head::-webkit-details-marker {
  display: none;
}

/* Outlined circle with a plus that becomes a minus when open. */
.acc__icon {
  position: relative;
  flex: 0 0 auto;
  width: 34px;
  height: 34px;
  border: 2px solid var(--c-primary-800);
  border-radius: 50%;
}

.acc__icon::before,
.acc__icon::after {
  content: '';
  position: absolute;
  inset: 50% 24% auto;
  height: 2px;
  background: var(--c-primary-800);
  transform: translateY(-50%);
}

.acc__icon::after {
  transform: translateY(-50%) rotate(90deg);
  transition: transform var(--dur) var(--ease), opacity var(--dur) var(--ease);
}

.acc__item[open] .acc__icon::after {
  transform: translateY(-50%) rotate(0deg);
  opacity: 0;
}

.acc__body {
  margin: 0;
  padding: 0 var(--sp-5) var(--sp-5);
}

.acc__row {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-4);
  padding-block: var(--sp-3);
  border-top: 1px solid var(--c-line);
}

.acc__row dt {
  color: var(--c-ink-muted);
  font-size: var(--fs-small);
}

.acc__row dd {
  margin: 0;
  text-align: right;
  font-family: var(--font-heading);
  font-weight: var(--fw-semibold);
  font-size: var(--fs-small);
  color: var(--c-primary-900);
}

/* --- rest of the series ------------------------------------------------- */
.section--tint {
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 10%, #fff);
}

.series {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-5);
}

.sib {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
  background: var(--c-surface);
  border-radius: 20px;
}

.sib__media {
  margin-bottom: var(--sp-4);
}

.sib__name {
  color: var(--c-primary-900);
}

.sib__range {
  margin-top: var(--sp-1);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--type-tint, #6b8fa3);
}

.sib__specs {
  margin: var(--sp-4) 0 var(--sp-5);
  flex: 1;
  border-top: 1px solid var(--c-line);
}

.sib__row {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-3);
  padding-block: var(--sp-2);
  border-bottom: 1px solid var(--c-line);
}

.sib__row dt {
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.sib__row dd {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: var(--fs-small);
  color: var(--c-primary-900);
}

.back {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-accent-600);
  text-decoration: none;
}

.back:hover {
  text-decoration: underline;
}

@media (min-width: 720px) {
  .tiles {
    grid-template-columns: repeat(2, 1fr);
  }

  .series {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .panel {
    grid-template-columns: 1fr 1fr;
    gap: var(--sp-7);
    align-items: center;
  }

  .series {
    grid-template-columns: repeat(3, 1fr);
  }
}
.tech-more {
  margin-top: var(--sp-5);
  font-size: var(--fs-small);
  color: var(--c-ink-soft);
}

.tech-more a {
  color: var(--c-accent-500);
  font-weight: var(--fw-medium);
}
</style>
