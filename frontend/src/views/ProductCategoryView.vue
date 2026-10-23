<script setup>
/**
 * One page per heat-pump category, rebuilt on the corresponding pages on
 * ochsner.com (/en/heat-pumps/air-heat-pumps/ and siblings):
 *
 *   photo hero with overlapping card → product overview cards → type-colour
 *   band (function, consultation CTA, quote, feature cards) → advantages and
 *   choosing cards → FAQ → helpful links → closing CTA band
 *
 * The editorial copy, images and quotes live in i18n/bg/categories.js; optional
 * fields (fn.image, quote, item.image) simply drop out where a category has none.
 */
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import AccordionList from '@/components/ui/AccordionList.vue'
import HelpfulLinks from '@/components/products/HelpfulLinks.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, products: copy, categories, categoryCommon } = useI18n()
const route = useRoute()

const slug = computed(() => route.params.slug)
const content = computed(() => categories[slug.value] || null)

/* Category header photo; the two accessory categories have none on the
   reference, so the card simply sits on the tint instead. */
const withPhoto = ['vazduh-voda', 'zemya-voda', 'voda-voda', 'topla-voda']
const photo = computed(() =>
  withPhoto.includes(slug.value) ? `/images/categories/${slug.value}.webp` : ''
)

/* Bold lead + light remainder, as every heading on the reference is set:
   split at " — " where the title has one, otherwise after the first n words. */
function split(title, n = 2) {
  const [a, b] = title.split(' — ')
  if (b) return { strong: a, title: b }
  const words = title.split(' ')
  return { strong: words.slice(0, n).join(' '), title: words.slice(n).join(' ') }
}

/* Feature items with a picture become image cards; the rest follow as centred
   text, as on the reference. With no pictures at all, every item is a card. */
const featureCards = computed(() => {
  const items = content.value ? content.value.features.items : []
  return items.some((i) => i.image) ? items.filter((i) => i.image) : items
})
const featureNotes = computed(() => {
  const items = content.value ? content.value.features.items : []
  return items.some((i) => i.image) ? items.filter((i) => !i.image) : []
})

const faqItems = computed(() =>
  content.value ? content.value.faq.items.map((i) => ({ title: i.q, text: i.a })) : []
)

function applySeo() {
  if (!content.value) return
  useSeo({
    title: `${content.value.title} | OCHSNER България`,
    description: content.value.lead,
    path: `/produkti/${slug.value}`
  })
}

applySeo()

/* Category pages share a component, so a slug change has to re-run the meta. */
watch(slug, applySeo)
</script>

<template>
  <div v-if="content" :style="{ '--type-tint': content.tint }">
    <!-- Hero: full-bleed photo with the intro card overlapping it -->
    <section class="hero">
      <div class="hero__photo">
        <img
          v-if="photo"
          :src="photo"
          :alt="content.title"
          fetchpriority="high"
          decoding="async"
        />
      </div>

      <div class="container narrow">
        <div class="card">
          <p class="card__eyebrow">{{ content.eyebrow }}</p>
          <h1 class="card__title">
            <strong>{{ content.heading.strong }}</strong><br />{{ content.heading.light }}
          </h1>
          <p class="card__lead">{{ content.lead }}</p>

          <div v-for="block in content.intro" :key="block.title" class="card__block">
            <h2 class="card__heading">{{ block.title }}</h2>
            <p>{{ block.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product overview: one card per series -->
    <section class="section">
      <div class="container">
        <SectionHeading v-bind="split(content.models.title)" level="h2" rule />
        <ul class="pcards">
          <li v-for="model in content.models.items" :key="model.name" class="pcard">
            <div class="pcard__media">
              <img :src="model.image" :alt="model.name" loading="lazy" decoding="async" />
            </div>
            <h3 class="pcard__name">{{ model.name }}</h3>
            <p class="pcard__range">{{ model.range }}</p>
            <p class="pcard__text">{{ model.text }}</p>
            <div v-if="!content.hideModelsCta" class="pcard__cta">
              <BaseButton
                :to="model.key
                  ? { name: 'product-model', params: { slug, model: model.key } }
                  : { name: 'contact' }"
              >
                {{ categoryCommon.modelsCta }}
              </BaseButton>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- Type-colour band: how it works, consultation, quote, feature cards -->
    <section class="section section--tint">
      <div class="container narrow">
        <SectionHeading v-bind="split(content.fn.title)" level="h2" align="center" />
        <p class="center">{{ content.fn.body[0] }}</p>
        <img
          v-if="content.fn.image"
          class="fn__image"
          :src="content.fn.image"
          alt=""
          width="2050"
          height="874"
          loading="lazy"
          decoding="async"
        />
        <p v-for="para in content.fn.body.slice(1)" :key="para" class="center">{{ para }}</p>
        <div class="center fn__cta">
          <BaseButton :to="{ name: 'contact' }" size="lg">{{ common.ctaPrimary }}</BaseButton>
        </div>

        <figure v-if="content.quote" class="quote">
          <div class="quote__rule" aria-hidden="true"><span>❝</span></div>
          <blockquote>
            <p>{{ content.quote.text }}</p>
          </blockquote>
          <figcaption>{{ content.quote.author }}</figcaption>
          <div class="quote__rule quote__rule--end" aria-hidden="true"><span>❞</span></div>
        </figure>

        <div class="features">
          <SectionHeading
            v-bind="split(content.features.title)"
            :subtitle="content.features.intro"
            level="h2"
            align="center"
          />
          <ul class="icards" :class="{ 'icards--3': featureCards.length === 3 }">
            <li v-for="item in featureCards" :key="item.title" class="icard">
              <img v-if="item.image" class="icard__img" :src="item.image" alt="" loading="lazy" decoding="async" />
              <h3 class="icard__title">{{ item.title }}</h3>
              <p class="icard__text">{{ item.text }}</p>
            </li>
          </ul>
          <div v-for="item in featureNotes" :key="item.title" class="note">
            <h3 class="note__title">{{ item.title }}</h3>
            <p class="center">{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Advantages and choosing as two cards, then the FAQ -->
    <section class="section">
      <div class="container narrow">
        <ul class="icards">
          <li v-for="item in [content.advantages, content.choosing]" :key="item.title" class="icard">
            <img v-if="item.image" class="icard__img" :src="item.image" alt="" loading="lazy" decoding="async" />
            <h3 class="icard__title">{{ item.title }}</h3>
            <p class="icard__text">{{ item.body }}</p>
          </li>
        </ul>

        <div class="faq">
          <SectionHeading v-bind="split(content.faq.title, 3)" level="h2" align="center" />
          <AccordionList :items="faqItems" :default-open="-1" />
        </div>
      </div>
    </section>

    <!-- Helpful links on the type-colour band -->
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
 * Measured on the reference at 1440: narrow sections hold a 1082px column,
 * cards are white with a 20px radius and a soft 0 6px 20px shadow.
 */
.narrow {
  max-width: calc(1082px + 2 * var(--gutter));
}

.center {
  text-align: center;
}

p + p {
  margin-top: 20px;
}

/* --- hero: photo with an overlapping white card ------------------------- */
.hero {
  position: relative;
  /* Padding rather than a margin on the card: a margin would collapse through
     the container and push the whole band down instead of the card. */
  padding-top: clamp(96px, 9vw, 172px);
  padding-bottom: var(--sp-6);
}

.hero__photo {
  position: absolute;
  inset: 0 0 auto;
  height: clamp(280px, 36vw, 700px);
  overflow: hidden;
  background: color-mix(in srgb, var(--type-tint) 10%, #fff);
}

.hero__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card {
  position: relative;
  padding: clamp(var(--sp-5), 4.9vw, 70px);
  background: #fff;
  border-radius: 20px;
}

.card__eyebrow {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: var(--fw-medium);
  margin-bottom: 8px;
}

/* Bold line over light line, both at h1 size: 54px on a 64px line box. */
.card__title {
  font-weight: var(--fw-light);
  line-height: 1.19;
  margin-bottom: var(--sp-6);
}

/* The reference sets the lead as an h3: 20.7px, medium. */
.card__lead {
  font-family: var(--font-heading);
  font-size: var(--fs-h3);
  font-weight: var(--fw-medium);
  line-height: var(--lh-h3);
}

.card__block {
  margin-top: var(--sp-6);
}

/* Intro headings are light on the reference, without a bold lead. */
.card__heading {
  font-weight: var(--fw-light);
  margin-bottom: 20px;
}

/* --- product overview cards -------------------------------------------- */
.pcards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-5);
}

.pcard {
  display: flex;
  flex-direction: column;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* The reference shots carry the type colour fading to white; our own product
   cut-outs get the same gradient behind them. */
.pcard__media {
  aspect-ratio: 629 / 400;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(var(--type-tint), #fff);
}

.pcard__media img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.pcard__name {
  padding: 24px 32px 0;
  margin-bottom: 8px;
  font-size: 1.5rem;
  font-weight: var(--fw-bold);
  line-height: 34px;
}

.pcard__range,
.pcard__text {
  padding-inline: 32px;
  line-height: 24px;
  color: var(--c-primary-700);
}

.pcard__range {
  margin-bottom: 12px;
}

.pcard__text {
  margin: 0 0 24px;
}

.pcard__cta {
  margin-top: auto;
  padding: 24px 32px 32px;
}

/* --- type-colour band -------------------------------------------------- */
.section--tint {
  background: color-mix(in srgb, var(--type-tint) 10%, #fff);
}

.fn__image {
  width: 100%;
  margin-block: var(--sp-6);
  border-radius: 20px;
}

.fn__cta {
  margin-top: var(--sp-6);
}

/* Testimonial: hairlines with a quote mark at either end, italic light text. */
.quote {
  max-width: 832px;
  margin: var(--sp-8) auto 0;
  text-align: center;
}

.quote__rule {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 56px;
  font-weight: var(--fw-light);
  line-height: 1;
  color: #383838;
}

.quote__rule::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--c-primary-600);
}

.quote__rule--end {
  flex-direction: row-reverse;
}

.quote blockquote {
  margin: 24px 16px 0;
  font-size: clamp(1.375rem, 1rem + 1.2vw, 2rem);
  font-style: italic;
  font-weight: var(--fw-light);
  line-height: 1.31;
}

.quote figcaption {
  margin: 12px 0 24px;
  color: #383838;
}

.features {
  margin-top: var(--sp-8);
}

/* --- image cards ------------------------------------------------------- */
.icards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-5);
}

.icard {
  padding: 25px;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.icard__img {
  width: 100%;
  aspect-ratio: 368 / 280;
  object-fit: cover;
  margin-bottom: 20px;
  border-radius: 10px;
}

.icard__title {
  margin-bottom: 16px;
  font-weight: var(--fw-bold);
  color: #383838;
}

.icard__text {
  font-size: var(--fs-small);
  line-height: 1.6;
  color: #383838;
}

.note {
  margin-top: var(--sp-7);
}

.note__title {
  margin-bottom: 16px;
  text-align: center;
  font-weight: var(--fw-bold);
}

.faq {
  margin-top: var(--sp-9);
}

@media (min-width: 720px) {
  .pcards,
  .icards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1100px) {
  .pcards,
  .icards--3 {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
