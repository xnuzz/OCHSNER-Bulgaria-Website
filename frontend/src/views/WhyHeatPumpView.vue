<script setup>
import { ref } from 'vue'
import PageHero from '@/components/ui/PageHero.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import HeatPumpDiagram from '@/components/why/HeatPumpDiagram.vue'
import { useReveal } from '@/composables/useReveal.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { why } = useI18n()
const page = ref(null)

useSeo({ title: why.meta.title, description: why.meta.description, path: '/zashto-termopompa' })
useReveal(page)
</script>

<template>
  <div ref="page">
    <PageHero :eyebrow="why.hero.eyebrow" :title="why.hero.title" :subtitle="why.hero.subtitle" />

    <!-- How it works -->
    <section class="section">
      <div class="container">
        <SectionHeading
          :eyebrow="why.cycle.eyebrow"
          :title="why.cycle.title"
          :subtitle="why.cycle.intro"
        />

        <HeatPumpDiagram />

        <ol class="steps">
          <li v-for="step in why.cycle.steps" :key="step.number" class="step" data-reveal>
            <span class="step__num" aria-hidden="true">{{ step.number }}</span>
            <h3 class="step__title">{{ step.title }}</h3>
            <p class="step__text">{{ step.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- 3-in-1 -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :eyebrow="why.threeInOne.eyebrow"
          :title="why.threeInOne.title"
          :subtitle="why.threeInOne.intro"
        />
        <ul class="triple">
          <li v-for="item in why.threeInOne.items" :key="item.title" class="triple__item" data-reveal>
            <h3 class="triple__title">{{ item.title }}</h3>
            <p class="triple__text">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <!-- Heat pump + PV -->
    <section class="section">
      <div class="container pv">
        <div>
          <SectionHeading :eyebrow="why.pv.eyebrow" :title="why.pv.title" />
          <p v-for="paragraph in why.pv.body" :key="paragraph" class="pv__paragraph">
            {{ paragraph }}
          </p>
        </div>
        <ul class="pv__points" data-reveal>
          <li v-for="point in why.pv.points" :key="point">{{ point }}</li>
        </ul>
      </div>
    </section>

    <!-- New build vs retrofit -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading :eyebrow="why.buildings.eyebrow" :title="why.buildings.title" />
        <div class="cases">
          <article
            v-for="entry in [why.buildings.newBuild, why.buildings.retrofit]"
            :key="entry.title"
            class="case"
            data-reveal
          >
            <h3 class="case__title">{{ entry.title }}</h3>
            <p class="case__text">{{ entry.text }}</p>
            <ul class="case__points">
              <li v-for="point in entry.points" :key="point">{{ point }}</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- State subsidy programmes: intentionally free of concrete figures -->
    <section class="section">
      <div class="container container--narrow">
        <SectionHeading :eyebrow="why.subsidies.eyebrow" :title="why.subsidies.title" />
        <p v-for="paragraph in why.subsidies.body" :key="paragraph" class="subsidy__paragraph">
          {{ paragraph }}
        </p>
        <aside class="notice">
          <h3 class="notice__title">{{ why.subsidies.placeholderTitle }}</h3>
          <p class="notice__text">{{ why.subsidies.note }}</p>
        </aside>
        <BaseButton :to="{ name: 'contact' }" variant="secondary" class="subsidy__cta">
          {{ why.subsidies.cta }}
        </BaseButton>
      </div>
    </section>

    <CtaBand :title="why.ctaBand.title" :text="why.ctaBand.text" />
  </div>
</template>

<style scoped>
.steps {
  margin-top: var(--sp-6);
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-5);
  counter-reset: step;
}

.step {
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.step__num {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin-bottom: var(--sp-3);
  border-radius: 50%;
  background: var(--c-primary-700);
  color: #fff;
  font-family: var(--font-heading);
  font-weight: 700;
}

.step__title {
  color: var(--c-primary-800);
}

.step__text {
  margin-top: var(--sp-2);
  font-size: 0.95rem;
  color: var(--c-ink-soft);
}

.triple {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-5);
}

.triple__item {
  padding: var(--sp-5);
  background: var(--c-surface);
  border-top: 3px solid var(--c-accent-500);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.triple__title {
  color: var(--c-primary-800);
}

.triple__text {
  margin-top: var(--sp-3);
  font-size: 0.95rem;
  color: var(--c-ink-soft);
}

.pv {
  display: grid;
  gap: var(--sp-6);
}

.pv__paragraph {
  color: var(--c-ink-soft);
  max-width: 62ch;
}

.pv__paragraph + .pv__paragraph {
  margin-top: var(--sp-4);
}

.pv__points {
  align-self: start;
  list-style: none;
  padding: var(--sp-5);
  margin: 0;
  display: grid;
  gap: var(--sp-4);
  background: var(--c-primary-50);
  border-radius: var(--radius-lg);
}

.pv__points li {
  position: relative;
  padding-left: var(--sp-5);
  font-size: 0.95rem;
  color: var(--c-primary-900);
}

.pv__points li::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.55em;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--c-accent-600);
}

.cases {
  display: grid;
  gap: var(--sp-5);
}

.case {
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.case__title {
  color: var(--c-primary-800);
}

.case__text {
  margin-top: var(--sp-3);
  color: var(--c-ink-soft);
  font-size: 0.95rem;
}

.case__points {
  margin-top: var(--sp-4);
  padding-left: var(--sp-5);
  display: grid;
  gap: var(--sp-2);
  font-size: 0.92rem;
  color: var(--c-ink-soft);
}

.subsidy__paragraph {
  color: var(--c-ink-soft);
}

.subsidy__paragraph + .subsidy__paragraph {
  margin-top: var(--sp-4);
}

/* Deliberately styled as an editorial note — it is unfinished content. */
.notice {
  margin-top: var(--sp-5);
  padding: var(--sp-5);
  border: 1px dashed var(--c-accent-600);
  border-radius: var(--radius);
  background: var(--c-accent-100);
}

.notice__title {
  color: var(--c-accent-700);
  font-size: var(--fs-body);
}

.notice__text {
  margin-top: var(--sp-2);
  font-size: 0.9rem;
  color: var(--c-ink-soft);
}

.subsidy__cta {
  margin-top: var(--sp-5);
}

@media (min-width: 640px) {
  .steps {
    grid-template-columns: repeat(2, 1fr);
  }

  .cases {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 900px) {
  .triple {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1000px) {
  .steps {
    grid-template-columns: repeat(4, 1fr);
  }

  .pv {
    grid-template-columns: 1.4fr 1fr;
    gap: var(--sp-7);
  }
}
</style>
