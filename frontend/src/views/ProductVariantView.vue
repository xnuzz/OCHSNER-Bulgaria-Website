<script setup>
/**
 * Individual unit page, mirroring the reference's product pages
 * (/en/heat-pumps/air-heat-pumps/air-milan/air-milan-612-c11a-cm1/):
 *
 *   band of the category colour with a centred kicker, name, output range and
 *   description → image gallery lifted onto the band, beside the four
 *   colour-coded spec tiles and "suitable for" → technical details (data and
 *   properties) → the rest of the series
 */
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import SeriesModels from '@/components/products/SeriesModels.vue'
import HelpfulLinks from '@/components/products/HelpfulLinks.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { products: copy, variants, variantCommon, models, modelCommon, categories } = useI18n()
const route = useRoute()

const key = computed(() => route.params.variant)
const unit = computed(() => variants[key.value] || null)
const series = computed(() => (unit.value ? models[unit.value.model] : null))
const category = computed(() => (series.value ? categories[series.value.category] : null))
const tint = computed(() => (category.value && category.value.tint) || '#6b8fa3')
const shortName = computed(() => unit.value.name.replace('OCHSNER ', ''))

/* Gallery: the thumbnails swap the large image, as on the reference. */
const current = ref(0)
watch(key, () => (current.value = 0))

const techGroups = computed(() => unit.value.tech.filter((g) => g.rows.length))

/* "Properties" mirrors the reference's second panel, one property per row. */
const properties = computed(() => unit.value.props || [])

function applySeo() {
  if (!unit.value) return
  useSeo({
    title: `${unit.value.name} | OCHSNER България`,
    description: unit.value.description,
    path: `/produkti/${series.value.category}/${unit.value.model}/${key.value}`
  })
}

applySeo()
watch(key, applySeo)
</script>

<template>
  <div v-if="unit" :style="{ '--type-tint': tint }">
    <!-- Band of the category colour carrying the introduction -->
    <section class="intro">
      <div class="container wrap intro__inner">
        <p class="intro__kicker">{{ series.kicker }}</p>
        <h1 class="intro__title">{{ unit.name }}</h1>
        <p class="intro__range">{{ unit.range }}</p>
        <p class="intro__text">{{ unit.description }}</p>
        <!-- Award line, where the reference has one -->
        <p v-if="unit.note" class="intro__text">{{ unit.note }}</p>
      </div>
    </section>

    <!-- Gallery lifted onto the band, spec tiles and "suitable for" beside it -->
    <section class="product">
      <div class="container wrap product__grid">
        <div class="gallery">
          <div class="gallery__main">
            <img
              :src="unit.gallery[current]"
              :alt="unit.name"
              fetchpriority="high"
              decoding="async"
            />
          </div>

          <div v-if="unit.gallery.length > 1" class="gallery__thumbs">
            <button
              v-for="(src, i) in unit.gallery"
              :key="src"
              type="button"
              class="gallery__thumb"
              :class="{ 'is-active': i === current }"
              :aria-label="`${unit.name} — ${i + 1}`"
              :aria-pressed="i === current"
              @click="current = i"
            >
              <img :src="src" alt="" loading="lazy" decoding="async" />
            </button>
          </div>
        </div>

        <div class="side">
          <div class="energy">
            <p class="energy__head">
              <span class="energy__note">{{ variantCommon.climateNote }}</span>
              <span class="energy__title">
                {{ variantCommon.climateValue }}
                <AppIcon name="ecology" :size="30" class="energy__leaf" />
              </span>
            </p>

            <ul class="tiles">
              <li v-for="t in unit.tiles" :key="t.label" class="tile" :class="`tile--${t.tone}`">
                <span class="tile__value">{{ t.value }}</span>
                <span class="tile__label">{{ t.label }}</span>
              </li>
            </ul>
          </div>

          <div class="suitable">
            <h2 class="suitable__title">{{ variantCommon.suitableTitle }}</h2>
            <ul class="suitable__list">
              <li v-for="s in unit.suitableFor" :key="s">
                <AppIcon name="check" :size="16" class="suitable__icon" />
                <span>{{ s }}</span>
              </li>
            </ul>
          </div>

          <BaseButton :to="{ name: 'contact' }" size="lg" class="side__cta">
            {{ variantCommon.quote }}
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Technical details: one panel of measured data, one of properties -->
    <section class="section tech">
      <div class="container wrap">
        <SectionHeading :strong="variantCommon.techTitleStrong" :title="shortName" level="h2" rule />

        <div class="acc">
          <details v-if="techGroups.length" class="acc__item">
            <summary class="acc__head">
              <span class="acc__icon" aria-hidden="true"></span>
              <span>{{ variantCommon.specsTitle }}</span>
            </summary>
            <div class="acc__body">
              <div v-for="g in techGroups" :key="g.title" class="acc__group">
                <p class="acc__group-title">{{ g.title }}</p>
                <dl>
                  <div v-for="row in g.rows" :key="row[0]" class="acc__row">
                    <dt>{{ row[0] }}</dt>
                    <dd>{{ row[1] }}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </details>

          <details v-if="properties.length" class="acc__item">
            <summary class="acc__head">
              <span class="acc__icon" aria-hidden="true"></span>
              <span>{{ variantCommon.propsTitle }}</span>
            </summary>
            <ul class="acc__body props">
              <li v-for="p in properties" :key="p">
                <AppIcon name="check" :size="16" />
                <span>{{ p }}</span>
              </li>
            </ul>
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
    <section v-if="series.variants.items.length > 1" class="section section--tint">
      <div class="container">
        <SeriesModels
          :model="unit.model"
          :exclude="key"
          :strong="series.name"
          :title="modelCommon.moreModels"
        />
      </div>
    </section>

    <section class="section section--tint">
      <div class="container">
        <HelpfulLinks />
      </div>
    </section>

    <CtaBand :title="copy.ctaBand.title" :text="copy.ctaBand.text" />
  </div>
</template>

<style scoped>
/*
 * The reference's narrow section: a 1082px column. The band stops part-way
 * down the gallery — its bottom padding equals the gallery's negative top
 * margin — so the white image card sits half on the colour, half below it.
 */
.wrap {
  max-width: calc(1082px + 2 * var(--gutter));
}

/* --- intro band --------------------------------------------------------- */
.intro {
  padding-bottom: 100px;
  background: var(--type-tint, #6b8fa3);
  color: #fff;
}

.intro__inner {
  padding-block: var(--sp-7);
  text-align: center;
}

.intro__kicker {
  font-family: var(--font-heading);
  font-size: var(--fs-small);
  letter-spacing: 0.1em;
  text-transform: uppercase;
  opacity: 0.85;
}

.intro__title {
  margin-top: var(--sp-4);
  font-size: clamp(2.25rem, 1.5rem + 2.4vw, 3.375rem);
  font-weight: var(--fw-bold);
  line-height: 1.05;
  color: #fff;
  max-width: none;
  text-transform: uppercase;
}

.intro__range {
  margin-top: var(--sp-4);
  font-size: 1.125rem;
  opacity: 0.9;
}

.intro__text {
  margin: var(--sp-5) auto 0;
  max-width: 900px;
  font-size: clamp(1.0625rem, 1rem + 0.3vw, 1.25rem);
  font-weight: var(--fw-light);
  line-height: 1.6;
  opacity: 0.9;
}

/* --- product row -------------------------------------------------------- */
.product__grid {
  position: relative;
  margin-top: -100px;
  display: grid;
  gap: var(--sp-6);
}

.gallery__main {
  position: relative;
  aspect-ratio: 1;
  border-radius: 20px;
  overflow: hidden;
  background: #fff;
  box-shadow: var(--shadow-sm);
}

.gallery__main img {
  position: absolute;
  inset: 20px;
  width: calc(100% - 40px);
  height: calc(100% - 40px);
  object-fit: contain;
  border-radius: 10px;
}

.gallery__thumbs {
  margin-top: var(--sp-4);
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-2);
}

.gallery__thumb {
  display: block;
  padding: 0;
  border: 0;
  border-radius: 10px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
  transition: opacity var(--dur) var(--ease);
}

.gallery__thumb:hover {
  opacity: 0.8;
}

.gallery__thumb.is-active {
  opacity: 0.6;
}

.gallery__thumb img {
  display: block;
  width: 100%;
  aspect-ratio: 1;
  object-fit: contain;
}

/* --- energy block ------------------------------------------------------- */
.energy__head {
  display: flex;
  flex-direction: column;
  margin-bottom: var(--sp-5);
  color: var(--type-tint, #6b8fa3);
}

.energy__note {
  font-size: 1.125rem;
  line-height: 1.1;
}

.energy__title {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-size: 1.625rem;
  font-weight: var(--fw-bold);
  line-height: 1.2;
}

.energy__leaf {
  opacity: 0.4;
}

.tiles {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.9375rem 1.875rem;
}

/* Tone palette taken from the reference's own tiles. */
.tile {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 6rem;
  padding: 0.75rem 1rem;
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
  font-size: clamp(1.4rem, 1rem + 1.2vw, 2.125rem);
  font-weight: var(--fw-bold);
  line-height: 1.2;
}

.tile__label {
  margin-top: var(--sp-1);
  font-size: 0.8125rem;
  line-height: 1.2;
  opacity: 0.8;
}

/* --- suitable for ------------------------------------------------------- */
.suitable {
  margin-top: var(--sp-7);
  color: var(--type-tint, #6b8fa3);
}

.suitable__title {
  margin-bottom: var(--sp-4);
  font-size: 1.625rem;
  font-weight: var(--fw-bold);
  color: inherit;
}

.suitable__list {
  list-style: none;
  margin: 0;
  padding: 1.25rem;
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.03);
}

.suitable__list li {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding-block: 0.375rem;
  font-weight: var(--fw-medium);
}

/* Outlined circle around the tick, as the reference's icon draws it. */
.suitable__icon {
  flex: 0 0 auto;
  box-sizing: content-box;
  padding: 3px;
  border: 1.5px solid currentColor;
  border-radius: 50%;
}

.side__cta {
  margin-top: var(--sp-6);
}

/* --- technical details accordion ---------------------------------------- */
/* One line over a full-width hairline, as on the reference. */
.tech :deep(.heading__title) {
  max-width: none;
}

.acc__item {
  margin-bottom: var(--sp-3);
  background: #fff;
  border-radius: 0.75rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.acc__head {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: 1.25rem 1rem 1.25rem 0.75rem;
  font-size: 0.9375rem;
  color: #383838;
  cursor: pointer;
  list-style: none;
  transition: color var(--dur) var(--ease);
}

.acc__head:hover {
  color: var(--c-accent-600);
}

.acc__head::-webkit-details-marker {
  display: none;
}

/* Outlined circle with a plus that becomes a minus when open. */
.acc__icon {
  position: relative;
  flex: 0 0 auto;
  width: 1.75rem;
  height: 1.75rem;
  border: 2px solid currentColor;
  border-radius: 50%;
}

.acc__icon::before,
.acc__icon::after {
  content: '';
  position: absolute;
  inset: 50% 22% auto;
  height: 2px;
  background: currentColor;
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
  padding: 0 1.5rem 1.25rem;
  color: #383838;
}

.acc__group + .acc__group {
  margin-top: var(--sp-6);
}

.acc__group-title {
  margin-bottom: var(--sp-4);
  font-weight: var(--fw-bold);
}

.acc__group dl {
  margin: 0;
}

/* Label and value in an 8 : 4 split, as the reference's two columns. */
.acc__row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--sp-4);
  margin-bottom: var(--sp-1);
}

.acc__row dd {
  margin: 0;
}

.props {
  list-style: none;
}

.props li {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  padding-block: var(--sp-2);
  border-bottom: 1px solid var(--c-line);
}

.props li:last-child {
  border-bottom: 0;
}

.props :deep(svg) {
  flex: 0 0 auto;
  color: var(--type-tint, #6b8fa3);
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

/* --- rest of the series ------------------------------------------------- */
.section--tint {
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 10%, #fff);
}

@media (min-width: 576px) {
  .gallery__thumbs {
    grid-template-columns: repeat(5, 1fr);
  }
}

@media (min-width: 1024px) {
  .intro {
    padding-bottom: 200px;
  }

  .intro__inner {
    padding-block: 5rem;
  }

  .product__grid {
    margin-top: -200px;
    grid-template-columns: 1fr 1fr;
    gap: 0;
  }

  .gallery {
    padding-right: 2.5rem;
  }

  .gallery__main img {
    inset: 30px;
    width: calc(100% - 60px);
    height: calc(100% - 60px);
  }

  /* The heading sits on the band from here up. */
  .energy__head {
    color: #fff;
  }

  .acc__head {
    gap: var(--sp-5);
    padding: 2.5rem 1.5rem 2.5rem 1.25rem;
    font-size: 1.25rem;
  }

  .acc__icon {
    width: 2.5rem;
    height: 2.5rem;
  }
}

@media (min-width: 1240px) {
  .intro {
    padding-bottom: 330px;
  }

  .product__grid {
    margin-top: -330px;
  }

  .gallery__main img {
    inset: 50px;
    width: calc(100% - 100px);
    height: calc(100% - 100px);
  }

  /* Exactly the band's overlap, so the tiles end where the colour does. */
  .energy {
    height: 330px;
    padding-bottom: 3.125rem;
  }

  .tile {
    height: 6rem;
  }
}
</style>
