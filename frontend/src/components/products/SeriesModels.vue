<script setup>
/**
 * "All models of the series" grid, mirroring the reference's msp-widget on both
 * the series page and every unit page (/en/heat-pumps/air-heat-pumps/air-milan/):
 *
 *   bold-lead heading over a hairline → pill filter by output range → white
 *   cards with name, range, render, colour-coded tags, a 2×2 spec grid, the
 *   properties line and one button
 *
 * Card data comes from the series (models.js); the render is the first image of
 * the unit's own gallery (variants.js), so each unit has one image source.
 */
import { computed, ref, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { useI18n } from '@/i18n'

const props = defineProps({
  model: { type: String, required: true },
  strong: { type: String, required: true },
  title: { type: String, default: '' },
  /** Unit key to leave out — the page the grid sits on. */
  exclude: { type: String, default: '' }
})

const { models, modelCommon, variants } = useI18n()

const cards = computed(() => {
  const series = models[props.model]
  const keyByName = {}
  for (const [k, v] of Object.entries(variants)) {
    if (v.model === props.model) keyByName[v.name.replace('OCHSNER ', '')] = k
  }
  return series.variants.items
    .map((item) => ({ ...item, key: keyByName[item.name] }))
    .filter((c) => c.key !== props.exclude)
    .map((c) => ({ ...c, image: c.key ? variants[c.key].gallery[0] : '' }))
})

const ranges = computed(() => [...new Set(cards.value.map((c) => c.range))])
const active = ref('')
/* Moving to another unit reuses this component; start it unfiltered, as a fresh page would. */
watch(() => props.exclude, () => (active.value = ''))
const shown = computed(() => cards.value.filter((c) => !active.value || c.range === active.value))

/* Tag colours are the reference's own, keyed by what the tag describes. */
function tagColor(tag) {
  if (/R\d{2,}/.test(tag)) return '#6ab291'
  if (/модул|tower/i.test(tag)) return '#b19f62'
  if (/OTS|OTF|управление|дисплей|modbus/i.test(tag)) return '#cc7279'
  return '#6b8fa3'
}
</script>

<template>
  <div class="msp">
    <h2 class="msp__title"><strong>{{ strong }}</strong> {{ title }}</h2>

    <div v-if="ranges.length > 1" class="msp__filter">
      <button type="button" class="msp__btn" :class="{ 'is-active': !active }" @click="active = ''">
        {{ modelCommon.showAll }}
      </button>
      <button
        v-for="r in ranges"
        :key="r"
        type="button"
        class="msp__btn"
        :class="{ 'is-active': active === r }"
        @click="active = r"
      >
        {{ r }}
      </button>
    </div>

    <ul class="msp__grid">
      <li v-for="c in shown" :key="c.name" class="card">
        <h3 class="card__title">{{ c.name }}</h3>
        <p class="card__range">{{ c.range }}</p>

        <div class="card__image">
          <img v-if="c.image" :src="c.image" :alt="c.name" loading="lazy" decoding="async" />
        </div>

        <ul class="card__tags">
          <li v-for="t in c.tags" :key="t" :style="{ background: tagColor(t) }">{{ t }}</li>
        </ul>

        <dl class="card__specs">
          <div v-for="s in c.specs" :key="s.label">
            <dt>{{ s.label }}</dt>
            <dd>{{ s.value }}</dd>
          </div>
        </dl>

        <p class="card__props">{{ c.footnote }}</p>

        <div class="card__action">
          <BaseButton
            :to="c.key
              ? { name: 'product-variant', params: { slug: models[model].category, model, variant: c.key } }
              : { name: 'contact' }"
          >
            {{ modelCommon.viewProduct }}
          </BaseButton>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.msp__title {
  font-size: var(--fs-h2);
  font-weight: var(--fw-light);
  line-height: var(--lh-snug);
  color: var(--c-primary-900);
  max-width: none;
  padding-bottom: var(--sp-4);
  margin-bottom: var(--sp-5);
  border-bottom: 1px solid var(--c-primary-800);
}

.msp__title strong {
  font-weight: var(--fw-bold);
}

/* --- range filter --------------------------------------------------------- */
.msp__filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-2);
  margin-bottom: var(--sp-6);
}

.msp__btn {
  padding: 0.5rem 1.25rem;
  border: 0;
  border-radius: 2rem;
  background: #fff;
  color: var(--c-primary-800);
  font-family: var(--font-heading);
  font-size: var(--fs-small);
  font-weight: var(--fw-semibold);
  text-transform: uppercase;
  cursor: pointer;
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.msp__btn:hover,
.msp__btn.is-active {
  background: var(--c-primary-800);
  color: #fff;
}

/* --- cards ---------------------------------------------------------------- */
.msp__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-5);
}

.card {
  display: flex;
  flex-direction: column;
  padding: var(--sp-5);
  background: #fff;
  border-radius: 1.25rem;
  box-shadow: 0 0.125rem 0.5rem rgba(0, 0, 0, 0.06);
  text-align: center;
}

.card__title {
  font-size: 1.5rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  color: var(--c-primary-900);
  max-width: none;
}

.card__range {
  margin-top: var(--sp-1);
  color: #555;
}

.card__image {
  margin-block: var(--sp-4);
  aspect-ratio: 1;
  max-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card__image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
}

.card__tags {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--sp-4);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.375rem;
}

.card__tags li {
  padding: 0.25rem 0.625rem;
  border-radius: 0.25rem;
  color: #fff;
  font-size: var(--fs-small);
  font-weight: var(--fw-medium);
  text-transform: uppercase;
}

/* 2×2 grid with inner hairlines only. */
.card__specs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 var(--sp-4);
}

.card__specs div {
  padding: 0.75rem 0.5rem;
  border-bottom: 1px solid var(--c-line);
}

.card__specs div:nth-child(odd) {
  border-right: 1px solid var(--c-line);
}

.card__specs div:nth-last-child(-n + 2) {
  border-bottom: 0;
}

.card__specs dt {
  font-size: 0.75rem;
  color: #5c6e66;
}

.card__specs dd {
  margin: 0;
  font-size: 1.125rem;
  font-weight: var(--fw-medium);
  color: var(--c-primary-900);
}

.card__props {
  font-weight: var(--fw-light);
  line-height: 1.5;
  color: var(--c-primary-800);
}

.card__action {
  margin-top: auto;
  padding-top: var(--sp-5);
}

@media (min-width: 720px) {
  .msp__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1240px) {
  .card {
    padding: 2.5rem;
  }

  /* Side by side once the cards are wide enough, as on the reference. */
  .card__specs {
    grid-template-columns: repeat(4, 1fr);
  }

  .card__specs div {
    padding: 0 1rem;
    border-bottom: 0;
    border-right: 1px solid var(--c-line);
  }

  .card__specs div:last-child {
    border-right: 0;
  }
}

@media (min-width: 1700px) {
  .msp__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
