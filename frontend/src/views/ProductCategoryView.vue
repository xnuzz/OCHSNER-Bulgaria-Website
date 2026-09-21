<script setup>
/**
 * One page per heat-pump category, mirroring the structure of the corresponding
 * pages on ochsner.com (/en/heat-pumps/air-heat-pumps/ and siblings):
 *
 *   hero → intro sections → product overview (model cards) → how it works +
 *   consultation CTA → feature block → advantages → choosing → FAQ →
 *   helpful links → closing CTA band
 *
 * The catalogue entry (title, advantages, datasheet) still comes from the API so
 * the page cannot drift from the product data; the long-form editorial copy
 * lives in i18n/bg/categories.js like every other string on the site.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import AccordionList from '@/components/ui/AccordionList.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import RedirectNotice from '@/components/ui/RedirectNotice.vue'
import { useExternalLink } from '@/composables/useExternalLink.js'
import { downloadCenterUrl } from '@/i18n/bg/common.js'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import { fetchProducts, useAsyncData } from '@/api/catalog.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, products: copy, categories, categoryCommon } = useI18n()
const route = useRoute()

const slug = computed(() => route.params.slug)
const content = computed(() => categories[slug.value] || null)

/* The catalogue is cached in api/catalog.js, so this is free after the first page. */
const { data: all, load } = useAsyncData(fetchProducts)
const product = computed(() => (all.value || []).find((p) => p.slug === slug.value) || null)

/* Category header photo; the two accessory categories have none on the
   reference, so the card simply sits on the tint instead. */
const withPhoto = ['vazduh-voda', 'zemya-voda', 'voda-voda', 'topla-voda']
const photo = computed(() =>
  withPhoto.includes(slug.value) ? `/images/categories/${slug.value}.webp` : ''
)

const faqItems = computed(() =>
  content.value ? content.value.faq.items.map((i) => ({ title: i.q, text: i.a })) : []
)

function applySeo() {
  if (!content.value) return
  useSeo({
    title: `${content.value.title} | OCHSNER България`,
    description: content.value.lead.slice(0, 155),
    path: `/produkti/${slug.value}`
  })
}

onMounted(() => {
  load()
  applySeo()
})

/* Category pages share a component, so a slug change has to re-run the meta. */
watch(slug, applySeo)

const page = ref(null)

/* External destinations open behind the redirect notice. */
const { leavingFor, confirmLeave, cancelLeave } = useExternalLink()
</script>

<template>
  <div v-if="content" ref="page" :style="{ '--type-tint': content.tint }">
    <!-- Hero: full-bleed photo with the intro card overlapping it, as on the
         reference. The card carries the eyebrow, the two-weight headline, the
         lead and the introductory sections. -->
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

      <div class="container">
        <div class="card">
          <p class="card__eyebrow">{{ content.eyebrow }}</p>
          <h1 class="card__title">
            <strong>{{ content.heading.strong }}</strong><br />{{ content.heading.light }}
          </h1>
          <p class="card__lead">{{ content.lead }}</p>

          <div v-for="block in content.intro" :key="block.title" class="card__block">
            <h2 class="card__heading">{{ block.title }}</h2>
            <p class="prose">{{ block.body }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Product overview: one card per model -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading :strong="content.models.title.split(' — ')[0]" :title="content.models.title.split(' — ')[1] || ''" level="h2" align="center" rule />
        <ul class="models">
          <li v-for="model in content.models.items" :key="model.name" class="model">
            <div class="model__media">
              <PlaceholderImage
                :src="model.image"
                :label="model.name"
                surface="none"
                inset="6%"
                ratio="1 / 1"
              />
            </div>
            <div class="model__body">
              <h3 class="model__name">{{ model.name }}</h3>
              <p class="model__range">{{ model.range }}</p>
              <p class="model__text">{{ model.text }}</p>
              <BaseButton
                v-if="!content.hideModelsCta"
                :to="model.key
                  ? { name: 'product-model', params: { slug, model: model.key } }
                  : { name: 'contact' }"
                size="sm"
              >
                {{ categoryCommon.modelsCta }}
              </BaseButton>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- How it works — tinted band, as on the reference -->
    <section class="section section--tint">
      <div class="container container--narrow">
        <SectionHeading :strong="content.fn.title.split(' ').slice(0, 2).join(' ')" :title="content.fn.title.split(' ').slice(2).join(' ')" level="h2" />
        <p v-for="para in content.fn.body" :key="para" class="prose">{{ para }}</p>
        <BaseButton :to="{ name: 'contact' }" size="lg" class="fn__cta">
          {{ common.ctaPrimary }}
        </BaseButton>
      </div>
    </section>

    <!-- Category-specific feature block -->
    <section class="section">
      <div class="container">
        <SectionHeading :title="content.features.title" :subtitle="content.features.intro" level="h2" />
        <ul class="features">
          <li v-for="item in content.features.items" :key="item.title" class="feature">
            <h3 class="feature__title">{{ item.title }}</h3>
            <p class="feature__text">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Advantages: prose from i18n, bullet list from the catalogue -->
    <section class="section">
      <div class="container advantages">
        <div>
          <SectionHeading :strong="content.advantages.title.split(' ')[0]" :title="content.advantages.title.split(' ').slice(1).join(' ')" level="h2" />
          <p class="prose">{{ content.advantages.body }}</p>
        </div>
        <ul v-if="product" class="advantages__list">
          <li v-for="item in product.advantages" :key="item">{{ item }}</li>
        </ul>
      </div>
    </section>

    <!-- Choosing / suitability -->
    <section class="section section--alt">
      <div class="container container--narrow">
        <SectionHeading :strong="content.choosing.title.split(' ').slice(0, 2).join(' ')" :title="content.choosing.title.split(' ').slice(2).join(' ')" level="h2" />
        <p class="prose">{{ content.choosing.body }}</p>
        <p v-if="product" class="prose prose--note">{{ product.suitableFor }}</p>
        <!-- The datasheets live in OCHSNER Austria's download centre. -->
        <a
          v-if="product"
          class="datasheet"
          :href="downloadCenterUrl"
          @click="confirmLeave($event, downloadCenterUrl)"
        >
          {{ common.downloadSpec }}
          <AppIcon name="arrowRight" :size="16" />
        </a>
      </div>
    </section>

    <!-- FAQ -->
    <section class="section">
      <div class="container container--narrow">
        <SectionHeading :strong="content.faq.title.split(' ').slice(0, 2).join(' ')" :title="content.faq.title.split(' ').slice(2).join(' ')" level="h2" rule />
        <AccordionList :items="faqItems" :default-open="-1" />
      </div>
    </section>

    <!-- Helpful links — tinted band, as on the reference -->
    <section class="section section--tint">
      <div class="container">
        <SectionHeading :title="categoryCommon.linksTitle" level="h2" align="center" />
        <ul class="links">
          <li v-for="link in categoryCommon.links" :key="link.title">
            <a
              v-if="link.href"
              class="link-card"
              :href="link.href"
              @click="confirmLeave($event, link.href)"
            >
              <h3 class="link-card__title">{{ link.title }}</h3>
              <p class="link-card__text">{{ link.text }}</p>
              <span class="link-card__more">
                {{ common.ctaMore }}
                <AppIcon name="arrowRight" :size="16" />
              </span>
            </a>
            <RouterLink v-else class="link-card" :to="{ name: link.to }">
              <h3 class="link-card__title">{{ link.title }}</h3>
              <p class="link-card__text">{{ link.text }}</p>
              <span class="link-card__more">
                {{ common.ctaMore }}
                <AppIcon name="arrowRight" :size="16" />
              </span>
            </RouterLink>
          </li>
        </ul>
      </div>
    </section>

    <CtaBand :title="copy.ctaBand.title" :text="copy.ctaBand.text" />

    <RedirectNotice :url="leavingFor" @close="cancelLeave" />
  </div>
</template>

<style scoped>
/* --- hero: photo with an overlapping white card ------------------------- */
/*
 * Measured on the reference at a 1920 viewport: photo band 700px tall, card
 * inset ~22% from each side, 20px radius, 70px padding, lifted so it overlaps
 * the lower half of the photo.
 */
.hero {
  position: relative;
  /* Padding rather than a margin on the card: a margin would collapse through
     the container and push the whole band down instead of the card. */
  padding-top: clamp(96px, 9vw, 172px);
  padding-bottom: var(--section-y);
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 10%, #fff);
}

.hero__photo {
  position: absolute;
  inset: 0 0 auto;
  height: clamp(280px, 36vw, 700px);
  overflow: hidden;
  background: var(--c-surface-deep);
}

.hero__photo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card {
  position: relative;
  margin-top: 0;
  padding: clamp(var(--sp-5), 3.6vw, 70px);
  background: #fff;
  border-radius: 20px;
}

.card__eyebrow {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: var(--fw-medium);
  color: var(--c-ink);
  margin-bottom: 8px;
}

/* Bold line over light line, both at h1 size. */
.card__title {
  font-size: var(--fs-h1);
  font-weight: var(--fw-light);
  line-height: 1.19;
  color: var(--c-ink);
  max-width: none;
}

.card__title strong {
  font-weight: var(--fw-bold);
}

.card__lead {
  margin-top: var(--sp-5);
  max-width: 68ch;
  color: var(--c-ink);
  line-height: var(--lh-body);
}

.card__block {
  margin-top: var(--sp-7);
}

.card__heading {
  margin-bottom: var(--sp-4);
}

@media (min-width: 900px) {
  /* Inset so the card spans ~63% of the viewport, as on the reference, leaving
     the photo visible either side. */
  .card {
    margin-inline: 18.4%;
  }
}

/*
 * Each heat-pump type carries its own accent on the reference site
 * (--heatpumptype-color), painted as a full-bleed band at 10% alpha:
 *   air #6b8fa3 · ground #7d6e5a · groundwater #4a5e6b · hot water #5a7875
 * colour-mix keeps the tint honest against whatever the band sits on.
 */
.section--tint {
  background: color-mix(in srgb, var(--type-tint, #6b8fa3) 10%, #fff);
}

.prose {
  color: var(--c-ink);
  line-height: var(--lh-body);
  max-width: 62ch;
}

.prose + .prose {
  margin-top: var(--sp-4);
}

.prose--note {
  color: var(--c-ink-muted);
}

/* --- model cards -------------------------------------------------------- */
.models {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-5);
}

.model {
  display: grid;
  gap: var(--sp-4);
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
}

.model__media {
  background: var(--c-surface-alt);
}

.model__name {
  color: var(--c-primary-900);
}

.model__range {
  margin-top: var(--sp-1);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-accent-600);
}

.model__text {
  margin-block: var(--sp-3) var(--sp-5);
  font-size: var(--fs-small);
  color: var(--c-ink);
  line-height: var(--lh-body);
}

.fn__cta {
  margin-top: var(--sp-6);
}

/* --- features ----------------------------------------------------------- */
.features {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-5);
}

/* The card was white on a white band, so only the red rule showed and the copy
   read as loose text. A filled, rounded card anchors it. */
.feature {
  display: flex;
  flex-direction: column;
  padding: var(--sp-6);
  background: var(--c-surface-alt);
  border-top: 3px solid var(--c-accent-500);
  border-radius: 0 0 20px 20px;
}

.feature__title {
  color: var(--c-primary-800);
}

.feature__text {
  margin-top: var(--sp-3);
  font-size: var(--fs-small);
  color: var(--c-ink);
  line-height: var(--lh-body);
}

/* --- advantages --------------------------------------------------------- */
.advantages {
  display: grid;
  gap: var(--sp-6);
  align-items: start;
}

.advantages__list {
  align-self: start;
  list-style: none;
  margin: 0;
  padding: var(--sp-6);
  display: grid;
  gap: var(--sp-4);
  background: var(--c-surface-alt);
  border-radius: 20px;
}

.advantages__list li {
  position: relative;
  padding-left: var(--sp-5);
  font-size: var(--fs-small);
  color: var(--c-primary-900);
}

.advantages__list li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-accent-600);
}

.datasheet {
  margin-top: var(--sp-5);
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-weight: var(--fw-semibold);
  color: var(--c-accent-600);
  text-decoration: none;
}

.datasheet:hover {
  text-decoration: underline;
}

/* --- helpful links ------------------------------------------------------ */
.links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-4);
}

.link-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  text-decoration: none;
  color: inherit;
  transition: border-color var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.link-card:hover {
  border-color: var(--c-accent-500);
  transform: translateY(-3px);
}

.link-card__title {
  color: var(--c-primary-800);
}

.link-card__text {
  margin-top: var(--sp-2);
  flex: 1;
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.link-card__more {
  margin-top: var(--sp-4);
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: var(--fs-small);
  color: var(--c-accent-600);
}

@media (min-width: 720px) {
  .model {
    grid-template-columns: 260px 1fr;
    gap: var(--sp-6);
    align-items: center;
  }

  .features {
    grid-template-columns: repeat(3, 1fr);
  }

  .links {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .advantages {
    grid-template-columns: 1.3fr 1fr;
    gap: var(--sp-8);
  }

  .links {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
