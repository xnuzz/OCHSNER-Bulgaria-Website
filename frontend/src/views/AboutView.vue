<script setup>
import { ref } from 'vue'
import PageHero from '@/components/ui/PageHero.vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { about } = useI18n()
const page = ref(null)

useSeo({ title: about.meta.title, description: about.meta.description, path: '/za-nas' })
</script>

<template>
  <div ref="page">
    <PageHero
      :eyebrow="about.hero.eyebrow"
      :title="about.hero.title"
      :subtitle="about.hero.subtitle"
    />

    <!-- The local representative — placeholder bio for the client to complete -->
    <section class="section">
      <div class="container rep">
        <div class="rep__media">
          <PlaceholderImage label="Портретна снимка" tone="deep" ratio="3 / 4" />
        </div>
        <div>
          <SectionHeading
            :eyebrow="about.representative.eyebrow"
            :title="about.representative.title"
          />
          <p v-for="paragraph in about.representative.body" :key="paragraph" class="rep__paragraph">
            {{ paragraph }}
          </p>

          <div class="notice">
            <p class="notice__text">{{ about.representative.placeholderNote }}</p>
          </div>

          <h3 class="rep__subtitle">{{ about.representative.credentials.title }}</h3>
          <ul class="rep__credentials">
            <li v-for="item in about.representative.credentials.items" :key="item">{{ item }}</li>
          </ul>
          <p class="rep__note">{{ about.representative.credentials.note }}</p>
        </div>
      </div>
    </section>

    <!-- Official partnership -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading :eyebrow="about.partnership.eyebrow" :title="about.partnership.title" />
        <div class="partnership">
          <div>
            <p v-for="paragraph in about.partnership.body" :key="paragraph" class="partnership__paragraph">
              {{ paragraph }}
            </p>
          </div>
          <dl class="facts">
            <div v-for="fact in about.partnership.facts" :key="fact.label" class="fact">
              <dt class="fact__value">{{ fact.value }}</dt>
              <dd class="fact__label">{{ fact.label }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Services -->
    <section class="section">
      <div class="container">
        <SectionHeading :eyebrow="about.services.eyebrow" :title="about.services.title" />
        <ol class="services">
          <li v-for="(service, index) in about.services.items" :key="service.title" class="service">
            <span class="service__num" aria-hidden="true">{{ String(index + 1).padStart(2, '0') }}</span>
            <h3 class="service__title">{{ service.title }}</h3>
            <p class="service__text">{{ service.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- Local partner vs unsupported import -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :eyebrow="about.whyLocal.eyebrow"
          :title="about.whyLocal.title"
          :subtitle="about.whyLocal.intro"
        />
        <div class="compare">
          <article class="compare__col compare__col--good">
            <h3 class="compare__title">{{ about.whyLocal.columns.local.title }}</h3>
            <ul class="compare__list">
              <li v-for="item in about.whyLocal.columns.local.items" :key="item">
                <span class="compare__icon compare__icon--good" aria-hidden="true">✓</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>
          <article class="compare__col">
            <h3 class="compare__title">{{ about.whyLocal.columns.import.title }}</h3>
            <ul class="compare__list">
              <li v-for="item in about.whyLocal.columns.import.items" :key="item">
                <span class="compare__icon compare__icon--bad" aria-hidden="true">–</span>
                <span>{{ item }}</span>
              </li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <CtaBand :title="about.ctaBand.title" :text="about.ctaBand.text" />
  </div>
</template>

<style scoped>
.rep,
.partnership {
  display: grid;
  gap: var(--sp-6);
}

.rep__paragraph + .rep__paragraph,
.partnership__paragraph + .partnership__paragraph {
  margin-top: var(--sp-4);
}

.rep__paragraph,
.partnership__paragraph {
  color: var(--c-ink-soft);
  max-width: 62ch;
}

.rep__subtitle {
  margin-top: var(--sp-6);
  color: var(--c-primary-800);
}

.rep__credentials {
  margin-top: var(--sp-3);
  padding-left: var(--sp-5);
  display: grid;
  gap: var(--sp-2);
  color: var(--c-ink-soft);
  font-size: 0.95rem;
}

.rep__note,
.notice__text {
  font-size: 0.82rem;
  color: var(--c-ink-muted);
}

.rep__note {
  margin-top: var(--sp-3);
}

.notice {
  margin-top: var(--sp-5);
  padding: var(--sp-4);
  border: 1px dashed var(--c-accent-600);
  border-radius: var(--radius);
  background: var(--c-accent-100);
}

.facts {
  margin: 0;
  display: grid;
  gap: var(--sp-4);
  align-self: start;
}

.fact {
  padding: var(--sp-4);
  background: var(--c-surface);
  border-left: 3px solid var(--c-primary-500);
  border-radius: 0 var(--radius) var(--radius) 0;
}

.fact__value {
  font-family: var(--font-heading);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--c-primary-800);
}

.fact__label {
  margin: var(--sp-1) 0 0;
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.services {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-5);
}

.service {
  padding: var(--sp-5);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  background: var(--c-surface);
}

.service__num {
  font-family: var(--font-heading);
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: var(--c-accent-600);
}

.service__title {
  margin-top: var(--sp-2);
  color: var(--c-primary-800);
}

.service__text {
  margin-top: var(--sp-2);
  font-size: 0.95rem;
  color: var(--c-ink-soft);
}

.compare {
  display: grid;
  gap: var(--sp-5);
}

.compare__col {
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
}

.compare__col--good {
  border-color: var(--c-primary-300);
  box-shadow: var(--shadow);
}

.compare__title {
  color: var(--c-primary-800);
  margin-bottom: var(--sp-4);
}

.compare__list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-3);
}

.compare__list li {
  display: flex;
  gap: var(--sp-3);
  font-size: 0.95rem;
  color: var(--c-ink-soft);
}

.compare__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  font-size: 0.75rem;
}

.compare__icon--good {
  background: var(--c-success-bg);
  color: var(--c-success);
}

.compare__icon--bad {
  background: var(--c-error-bg);
  color: var(--c-error);
}

@media (min-width: 640px) {
  .services {
    grid-template-columns: repeat(2, 1fr);
  }

  .compare {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 960px) {
  .rep {
    grid-template-columns: 1fr 1.6fr;
    gap: var(--sp-7);
  }

  .partnership {
    grid-template-columns: 1.5fr 1fr;
    gap: var(--sp-7);
  }

  .services {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
