<script setup>
/**
 * Individual model page, mirroring ochsner.com's product pages
 * (/en/heat-pumps/air-heat-pumps/air-hawk/):
 *
 *   dark hero with the product cut-out and two CTAs → alternating highlight
 *   sections → feature grid → awards → "all models of the series" spec cards →
 *   FAQ → back to category
 *
 * The spec cards are the distinctive element of the reference design: a chip row
 * of properties (refrigerant, controller, evaporator) over a small grid of
 * measured values, with a footnote strip underneath.
 */
import { computed, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import AccordionList from '@/components/ui/AccordionList.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, products: copy, models, modelCommon, categories, categoryCommon, heroes, variants } = useI18n()
const route = useRoute()

const key = computed(() => route.params.model)
const model = computed(() => models[key.value] || null)
const category = computed(() => (model.value ? categories[model.value.category] : null))
/* Each model inherits its category's --heatpumptype-color from the reference. */
const tint = computed(() => (category.value && category.value.tint) || '#6b8fa3')

/* Manufacturer header image plus the Bulgarian tiles that cover its baked-in
   English/German ones. Percentages so the overlay tracks the photo at any size. */
const hero = computed(() => heroes[key.value] || null)

/* The reference splits these: the icon-led points sit as two cards lifted onto a
   band of the type colour, the illustrated one runs full width below. */
const cardPoints = computed(() => (model.value ? model.value.highlights.filter((h) => !h.image) : []))
const widePoints = computed(() => (model.value ? model.value.highlights.filter((h) => h.image) : []))
const pct = (box, h) => ({
  left: (box.x / h.w) * 100 + '%',
  top: (box.y / h.h) * 100 + '%',
  width: (box.w / h.w) * 100 + '%',
  height: (box.h / h.h) * 100 + '%'
})

/* Series variants that have their own detail page, keyed by display name. */
const variantKeyByName = computed(() => {
  const map = {}
  for (const [k, v] of Object.entries(variants)) {
    if (v.model === key.value) map[v.name.replace('OCHSNER ', '')] = k
  }
  return map
})

const faqItems = computed(() =>
  model.value ? model.value.faq.map((i) => ({ title: i.q, text: i.a })) : []
)

function applySeo() {
  if (!model.value) return
  useSeo({
    title: `${model.value.name} | OCHSNER България`,
    description: model.value.tagline.slice(0, 155),
    path: `/produkti/${model.value.category}/${key.value}`
  })
}

applySeo()
watch(key, applySeo)

const page = ref(null)

/* Artwork that fails to load is dropped rather than left as a broken image. */
const failed = reactive({})
</script>

<template>
  <div v-if="model" ref="page" :style="{ '--type-tint': tint }">
    <!-- Hero: manufacturer header image, spec tiles re-set in Bulgarian -->
    <section class="hero">
      <div class="container">
        <div class="hero__body">
          <p class="hero__kicker">{{ model.kicker }}</p>
          <h1 class="hero__title"><strong>{{ model.name }}</strong></h1>
          <p v-if="model.tagline" class="hero__tagline">{{ model.tagline }}</p>
          <!-- Range only where there is no artwork; the photo carries its own kW tile. -->
          <p v-if="!hero" class="hero__range">{{ model.range }}</p>
        </div>

        <div v-if="hero" class="shot" :style="{ aspectRatio: hero.w + ' / ' + hero.h }">
          <img class="shot__img" :src="hero.src" :alt="model.name" fetchpriority="high" decoding="async" />

          <!-- Spec tiles, covering the originals -->
          <div
            class="shot__tiles"
            :class="`shot__tiles--${hero.tiles.direction}`"
            :style="pct(hero.tiles.box, hero)"
          >
            <div v-for="(t, i) in hero.tiles.items" :key="i" class="tile">
              <template v-if="t.text">
                <span class="tile__text">{{ t.text }}</span>
              </template>
              <template v-else>
                <span v-if="t.small" class="tile__small">{{ t.small }}</span>
                <span class="tile__big">
                  {{ t.big }}<span v-if="t.unit" class="tile__unit">{{ t.unit }}</span>
                </span>
                <span v-if="t.label" class="tile__label">{{ t.label }}</span>
              </template>
            </div>
          </div>

          <!-- Green feature pills, where the artwork has them -->
          <div v-if="hero.pills" class="shot__pills" :style="pct(hero.pills.box, hero)">
            <span v-for="p in hero.pills.items" :key="p" class="pill">{{ p }}</span>
          </div>
        </div>

        <div class="hero__actions">
          <BaseButton href="#modeli" size="lg">{{ modelCommon.allModels }}</BaseButton>
        </div>
      </div>
    </section>

    <!-- Icon-led points: cards lifted onto a band of the type colour -->
    <section v-if="cardPoints.length" class="points">
      <div class="points__band"></div>
      <div class="container">
        <ul class="points__grid">
          <li v-for="block in cardPoints" :key="block.title" class="point">
            <AppIcon v-if="block.icon" :name="block.icon" :size="34" class="point__icon" />
            <h2 class="point__title">{{ block.title }}</h2>
            <p class="point__text">{{ block.text }}</p>
            <p v-if="block.note" class="point__note">{{ block.note }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Illustrated point: wide image over centred copy -->
    <section v-for="block in widePoints" :key="block.title" class="section">
      <div class="container">
        <figure v-if="!failed[block.image]" class="shout__media">
          <img
            :src="block.image"
            :alt="block.title"
            loading="lazy"
            decoding="async"
            @error="failed[block.image] = true"
          />
        </figure>

        <div class="shout">
          <h2 class="shout__title">
            <template v-if="block.strong">
              <strong>{{ block.strong }}</strong>
              {{ block.title.replace(block.strong, '').trim() }}
            </template>
            <template v-else>
              <strong>{{ block.title.split(' ').slice(0, 2).join(' ') }}</strong>
              {{ block.title.split(' ').slice(2).join(' ') }}
            </template>
          </h2>
          <p class="shout__text">{{ block.text }}</p>
          <p v-if="block.note" class="shout__note">{{ block.note }}</p>
          <BaseButton :to="{ name: 'contact' }" size="lg" class="shout__cta">
            {{ modelCommon.quote }}
          </BaseButton>
        </div>
      </div>
    </section>

    <!-- Feature grid: image cards, two across -->
    <section class="section" :class="{ 'section--tint': !!model.awards }">
      <div class="container">
        <ul class="features">
          <li v-for="item in model.features" :key="item.title" class="feature">
            <figure v-if="item.image && !failed[item.image]" class="feature__media">
              <img
                :src="item.image"
                :alt="item.title"
                loading="lazy"
                decoding="async"
                @error="failed[item.image] = true"
              />
            </figure>
            <h3 class="feature__title">{{ item.title }}</h3>
            <p class="feature__text">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Awards, where the series has them -->
    <section v-if="model.awards" class="section section--alt">
      <div class="container container--narrow">
        <div class="awards">
          <h2 class="awards__title">
            <strong>{{ model.awards.strong }}</strong> {{ model.awards.title }}
          </h2>
          <p v-for="a in model.awards.items" :key="a.lead" class="award">
            <strong>{{ a.lead }}</strong> {{ a.text }}
          </p>
        </div>
      </div>
    </section>

    <!-- All models of the series: spec cards -->
    <section id="modeli" class="section section--tint">
      <div class="container">
        <SectionHeading :strong="model.variants.title.split(' — ')[0]" :title="model.variants.title.split(' — ')[1] || ''" level="h2" align="center" rule />
        <ul class="variants">
          <li v-for="v in model.variants.items" :key="v.name" class="variant">
            <div class="variant__media">
              <PlaceholderImage :src="v.image" :label="v.name" surface="alt" inset="8%" ratio="1 / 1" />
            </div>

            <h3 class="variant__name">{{ v.name }}</h3>
            <p class="variant__range">{{ v.range }}</p>

            <ul class="chips">
              <li v-for="tag in v.tags" :key="tag" class="chip">{{ tag }}</li>
            </ul>

            <dl class="specs">
              <div v-for="s in v.specs" :key="s.label" class="specs__row">
                <dt>{{ s.label }}</dt>
                <dd>{{ s.value }}</dd>
              </div>
            </dl>

            <p class="variant__footnote">{{ v.footnote }}</p>

            <BaseButton
              :to="variantKeyByName[v.name]
                ? { name: 'product-variant', params: { slug: model.category, model: key, variant: variantKeyByName[v.name] } }
                : { name: 'contact' }"
              size="sm"
            >
              {{ modelCommon.viewProduct }}
            </BaseButton>
          </li>
        </ul>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <div class="container container--narrow">
        <SectionHeading :strong="modelCommon.faqTitle" :title="model.name" level="h2" />
        <AccordionList :items="faqItems" :default-open="-1" />
      </div>
    </section>

    <!-- Helpful links -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :strong="categoryCommon.linksTitle.split(' ')[0]"
          :title="categoryCommon.linksTitle.split(' ').slice(1).join(' ')"
          level="h2"
          rule
        />
        <ul class="links">
          <li v-for="link in categoryCommon.links" :key="link.title">
            <RouterLink class="link" :to="{ name: link.to }">
              <span class="link__thumb" aria-hidden="true"></span>
              <span class="link__body">
                <span class="link__title">
                  {{ link.title }}
                  <AppIcon name="arrowRight" :size="16" />
                </span>
                <span class="link__text">{{ link.text }}</span>
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <!-- Back to the category -->
    <section class="section">
      <div class="container container--narrow">
        <RouterLink class="back" :to="{ name: 'product-category', params: { slug: model.category } }">
          <AppIcon name="arrowLeft" :size="18" />
          {{ modelCommon.backToCategory }}: {{ category.title }}
        </RouterLink>
      </div>
    </section>

    <CtaBand :title="copy.ctaBand.title" :text="copy.ctaBand.text" />
  </div>
</template>

<style scoped>
/* Type accent band at 10% alpha, matching bg-heatpumptype-color-light. */
.section--tint {
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 10%, #fff);
}

/* --- hero --------------------------------------------------------------- */
/*
 * The reference sits the header image on a full-bleed band of the type colour,
 * with the artwork rounded and inset.
 */
/* Full-strength type colour, matching the reference band. */
.hero {
  padding-block: clamp(var(--sp-6), 5.3vw, 100px) clamp(var(--sp-7), 10.5vw, 200px);
  background: var(--type-tint, #6b8fa3);
}

.shot {
  position: relative;
  margin-top: clamp(var(--sp-6), 5.7vw, 110px);
  container-type: inline-size;
  width: 100%;
  overflow: hidden;
  border-radius: 20px;
  background: #0d0d0d;
}

.shot__img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* --- spec tiles --------------------------------------------------------- */
.shot__tiles {
  position: absolute;
  display: flex;
  gap: 0.8%;
}

.shot__tiles--row {
  flex-direction: row;
  align-items: stretch;
}

.shot__tiles--column {
  flex-direction: column;
  gap: 3%;
}

.tile {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0.6cqw 0.8cqw;
  border-radius: 10px;
  background: var(--type-tint, #6b8fa3);
  color: #fff;
  text-align: center;
  font-family: var(--font-heading);
  line-height: 1.05;
  white-space: pre-line;
}

.tile__small {
  font-size: 0.72cqw;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  letter-spacing: 0.01em;
}

.tile__big {
  font-size: 2.1cqw;
  font-weight: var(--fw-bold);
  letter-spacing: -0.01em;
}

.tile__unit {
  margin-left: 0.15em;
  font-size: 0.9cqw;
  font-weight: var(--fw-bold);
}

.tile__label {
  font-size: 0.72cqw;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
}

.tile__text {
  font-size: 1.15cqw;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
}

/* --- green feature pills ------------------------------------------------ */
.shot__pills {
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.6%;
}

.pill {
  display: inline-flex;
  align-items: center;
  padding: 0.35cqw 0.9cqw;
  border-radius: 6px;
  background: #5eb85e;
  color: #fff;
  font-family: var(--font-heading);
  font-size: 0.78cqw;
  font-weight: var(--fw-semibold);
  line-height: 1.2;
  white-space: nowrap;
}

/* --- hero copy ---------------------------------------------------------- */
/*
 * Reference: a 1130px centred column of white copy sitting on the band, the
 * artwork below it, then one red pill. Kicker and heading share the light
 * weight, with the model name set bold inside it.
 */
.hero__body {
  max-width: 1130px;
  margin-inline: auto;
  color: #fff;
  text-align: center;
}

.hero__kicker {
  margin: 0 0 var(--sp-6);
  font-size: 1.125rem;
  font-weight: 300;
  line-height: 1.34;
  color: #fff;
}

.hero__title {
  margin: 0 0 var(--sp-6);
  font-size: var(--fs-hero);
  font-weight: 300;
  line-height: 1.19;
  color: #fff;
}

.hero__title strong {
  font-weight: var(--fw-bold);
}

/* The reference sets the standfirst at 24px/500 with a 16px gap to the artwork. */
.hero__tagline {
  margin: 0 0 var(--sp-4);
  font-size: 1.5rem;
  font-weight: var(--fw-medium);
  line-height: 1.417;
  color: #fff;
}

.hero__range {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: var(--fs-h3);
  color: #fff;
}

.hero__actions {
  margin-top: var(--sp-6);
  display: flex;
  justify-content: center;
}

/* --- icon points ---------------------------------------------------------- */
/*
 * Reference treatment: a band of the type colour behind the top of the cards,
 * so the white cards lift out of it onto the light field below.
 */
.points {
  position: relative;
  padding-bottom: var(--section-y);
  background: var(--c-surface-alt);
}

.points__band {
  position: absolute;
  inset: 0 0 auto;
  height: 150px;
  background: var(--type-tint, #6b8fa3);
}

.points__grid {
  position: relative;
  list-style: none;
  margin: 0 auto;
  padding: var(--sp-7) 0 0;
  max-width: 1082px;
  display: grid;
  gap: 30px;
}

.point {
  display: flex;
  flex-direction: column;
  padding: clamp(var(--sp-5), 3vw, 50px);
  background: var(--c-surface);
  border-radius: 20px;
}

/* A series with an odd number of points leaves one card alone on its last row;
   centre it rather than letting it hang off to the left. */
.point:last-child:nth-child(odd) {
  grid-column: 1 / -1;
  width: 100%;
  max-width: 526px;
  margin-inline: auto;
}

.point__icon {
  color: var(--type-tint, #6b8fa3);
  margin-bottom: var(--sp-5);
}

.point__title {
  font-size: clamp(1.3rem, 1.05rem + 0.8vw, 1.75rem);
  font-weight: var(--fw-bold);
  line-height: 1.15;
  color: var(--c-primary-900);
  max-width: none;
  text-wrap: balance;
}

.point__text {
  margin-top: var(--sp-4);
  flex: 1;
  color: var(--c-ink);
  line-height: var(--lh-body);
}

.point__note {
  margin-top: var(--sp-6);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

/* --- highlight blocks --------------------------------------------------- */
/*
 * Reference treatment: one wide rounded image, then the copy centred beneath it
 * on a narrow measure, so each section reads as a single object rather than a
 * heading with text trailing off to one side.
 */
.shout__media {
  margin: 0 0 var(--sp-7);
  border-radius: 24px;
  overflow: hidden;
  /* Shallower than a full 16:9 so a single image does not fill the viewport. */
  aspect-ratio: 21 / 8;
  max-width: 1100px;
  margin-inline: auto;
  background: var(--c-surface-alt);
}

.shout__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.shout {
  max-width: 74ch;
  margin-inline: auto;
  text-align: center;
}

.shout__title {
  font-size: var(--fs-h2);
  font-weight: var(--fw-light);
  line-height: var(--lh-snug);
  color: var(--c-ink);
  max-width: none;
  text-wrap: balance;
}

.shout__title strong {
  font-weight: var(--fw-bold);
}

.shout__text {
  margin-top: var(--sp-5);
  color: var(--c-ink);
  line-height: var(--lh-body);
}

.shout__note {
  margin-top: var(--sp-5);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.shout__cta {
  margin-top: var(--sp-6);
}

/* --- feature cards ------------------------------------------------------ */
.features {
  list-style: none;
  padding: 0;
  /* Same block as the icon cards on the reference: two 526px cards, 30px
     apart, inside a 1082px column. */
  margin: 0 auto;
  max-width: 1082px;
  display: grid;
  gap: 30px;
}

.feature {
  display: flex;
  flex-direction: column;
  padding: clamp(var(--sp-4), 1.6vw, 25px);
  background: var(--c-surface);
  border-radius: 20px;
  text-align: center;
}

.feature__media {
  margin: 0 0 var(--sp-5);
  border-radius: 14px;
  overflow: hidden;
  aspect-ratio: 16 / 8;
  background: var(--c-surface-alt);
}

.feature__media img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.feature__title {
  font-size: clamp(1.1rem, 0.95rem + 0.5vw, 1.375rem);
  font-weight: var(--fw-bold);
  line-height: 1.15;
  color: var(--c-primary-900);
  text-wrap: balance;
}

.feature__text {
  margin-top: var(--sp-3);
  font-size: var(--fs-small);
  color: var(--c-ink);
  line-height: var(--lh-body);
}

/* --- helpful links ------------------------------------------------------ */
.links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-4);
}

.link {
  display: flex;
  gap: var(--sp-4);
  height: 100%;
  padding: var(--sp-5);
  background: var(--c-surface);
  border-radius: 16px;
  text-decoration: none;
  color: inherit;
  transition: transform var(--dur) var(--ease);
}

.link:hover {
  transform: translateY(-3px);
}

.link__thumb {
  flex: 0 0 auto;
  width: 76px;
  height: 76px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 18%, #fff);
}

.link__body {
  display: flex;
  flex-direction: column;
}

.link__title {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
}

.link__text {
  margin-top: var(--sp-2);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
  line-height: var(--lh-body);
}

/* --- awards ------------------------------------------------------------- */
/* White card on a light band, bold lead-in per line, as on the reference. */
.awards {
  padding: clamp(var(--sp-5), 3vw, var(--sp-8));
  background: var(--c-surface);
  border-radius: 24px;
}

.awards__title {
  font-size: var(--fs-h2);
  font-weight: var(--fw-light);
  line-height: var(--lh-snug);
  color: var(--c-ink);
  max-width: none;
  margin-bottom: var(--sp-5);
}

.awards__title strong {
  font-weight: var(--fw-bold);
}

.award {
  color: var(--c-ink);
  line-height: var(--lh-body);
}

.award + .award {
  margin-top: var(--sp-4);
}

.award strong {
  font-weight: var(--fw-bold);
}

/* --- variant spec cards ------------------------------------------------- */
.variants {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-5);
}

.variant {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
}

.variant__media {
  margin-bottom: var(--sp-4);
}

.variant__name {
  /* The reference sets unit names bold at 24px, not in the medium h3 weight. */
  font-size: 1.5rem;
  font-weight: var(--fw-bold);
  line-height: 1.3;
  color: var(--c-primary-900);
}

.variant__range {
  margin-top: var(--sp-1);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-accent-600);
}

.chips {
  margin-top: var(--sp-4);
  list-style: none;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
}

.chip {
  padding: 4px 10px;
  background: var(--c-primary-50);
  border: 1px solid var(--c-line);
  font-size: 0.75rem;
  color: var(--c-ink-muted);
}

.specs {
  margin: var(--sp-4) 0 0;
  display: grid;
  gap: 0;
  border-top: 1px solid var(--c-line);
}

.specs__row {
  display: flex;
  justify-content: space-between;
  gap: var(--sp-3);
  padding-block: var(--sp-2);
  border-bottom: 1px solid var(--c-line);
}

.specs__row dt {
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.specs__row dd {
  margin: 0;
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: var(--fs-small);
  color: var(--c-primary-900);
}

.variant__footnote {
  margin: var(--sp-4) 0 var(--sp-5);
  flex: 1;
  font-size: 0.75rem;
  color: var(--c-ink-muted);
  line-height: 1.5;
}

/* --- back link ---------------------------------------------------------- */
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
  .points__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--sp-6);
  }

  .features {
    grid-template-columns: repeat(2, 1fr);
  }

  .links {
    grid-template-columns: repeat(2, 1fr);
  }

  .variants {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .hero__inner {
    grid-template-columns: 1.25fr 1fr;
    gap: var(--sp-8);
  }

  .variants {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
