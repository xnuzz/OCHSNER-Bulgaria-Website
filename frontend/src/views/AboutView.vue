<script setup>
import { ref } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'
import PageHero from '@/components/ui/PageHero.vue'

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
        <div class="rep__body">
          <SectionHeading
            :strong="about.representative.title.split(' ').slice(0, 2).join(' ')"
            :title="about.representative.title.split(' ').slice(2).join(' ')"
            level="h2"
            rule
          />
          <p v-for="paragraph in about.representative.body" :key="paragraph" class="rep__paragraph">
            {{ paragraph }}
          </p>

          <div class="creds">
            <h3 class="creds__title">{{ about.representative.credentials.title }}</h3>
            <ul class="creds__list">
              <li v-for="item in about.representative.credentials.items" :key="item">
                <AppIcon name="check" :size="16" class="creds__tick" />
                <span>{{ item }}</span>
              </li>
            </ul>
            <p class="creds__note">{{ about.representative.credentials.note }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Official partnership -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :strong="about.partnership.title.split(' ').slice(0, 2).join(' ')"
          :title="about.partnership.title.split(' ').slice(2).join(' ')"
          level="h2"
          rule
        />
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
        <SectionHeading
          :strong="about.services.title.split(' — ')[0]"
          :title="about.services.title.split(' — ')[1] || ''"
          level="h2"
          align="center"
          rule
        />
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
          :strong="about.whyLocal.title.split(' ').slice(0, 2).join(' ')"
          :title="about.whyLocal.title.split(' ').slice(2).join(' ')"
          :subtitle="about.whyLocal.intro"
          level="h2"
          align="center"
          rule
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

.rep__media :deep(.ph) {
  border-radius: 20px;
  overflow: hidden;
}

.rep__paragraph + .rep__paragraph,
.partnership__paragraph + .partnership__paragraph {
  margin-top: var(--sp-4);
}

.rep__paragraph,
.partnership__paragraph {
  color: var(--c-ink-soft);
  line-height: var(--lh-body);
  max-width: 62ch;
}

/* Credentials in their own card rather than a bare bullet list. */
.creds {
  margin-top: var(--sp-6);
  padding: clamp(var(--sp-5), 2vw, var(--sp-6));
  background: var(--c-surface-alt);
  border-radius: 20px;
}

.creds__title {
  font-size: 1.125rem;
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
}

.creds__list {
  margin-top: var(--sp-4);
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-3);
}

.creds__list li {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  color: var(--c-ink-soft);
  line-height: 1.45;
}

.creds__tick {
  flex: 0 0 auto;
  margin-top: 3px;
  color: var(--c-accent-600);
}

.creds__note {
  margin-top: var(--sp-4);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.facts {
  margin: 0;
  display: grid;
  gap: var(--sp-4);
  align-self: start;
}

.fact {
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: 20px;
}

.fact__value {
  font-family: var(--font-heading);
  font-size: 2rem;
  font-weight: var(--fw-bold);
  line-height: 1.1;
  color: var(--c-primary-900);
}

.fact__label {
  margin: var(--sp-2) 0 0;
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.services {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 1082px;
  display: grid;
  gap: 30px;
}

.service {
  padding: clamp(var(--sp-5), 2.4vw, 40px);
  border: 1px solid var(--c-line);
  border-radius: 20px;
  background: var(--c-surface);
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}

.service:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: var(--shadow-lg);
}

.service__num {
  display: inline-grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 999px;
  border: 2px solid var(--c-accent-600);
  font-family: var(--font-heading);
  font-size: 0.95rem;
  font-weight: var(--fw-bold);
  color: var(--c-accent-600);
}

.service__title {
  margin-top: var(--sp-4);
  font-size: 1.25rem;
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
}

.service__text {
  margin-top: var(--sp-3);
  color: var(--c-ink-soft);
  line-height: var(--lh-body);
}

.compare {
  display: grid;
  gap: var(--sp-5);
  max-width: 1082px;
  margin-inline: auto;
}

.compare__col {
  padding: clamp(var(--sp-5), 2.4vw, 40px);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: 20px;
}

.compare__col--good {
  border-color: transparent;
  box-shadow: var(--shadow-lg);
}

.compare__title {
  font-size: 1.25rem;
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
  padding-bottom: var(--sp-4);
  margin-bottom: var(--sp-4);
  border-bottom: 1px solid var(--c-line);
}

.compare__col--good .compare__title {
  border-bottom-color: var(--c-accent-600);
}

.compare__list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-4);
}

.compare__list li {
  display: flex;
  gap: var(--sp-3);
  color: var(--c-ink-soft);
  line-height: 1.45;
}

.compare__icon {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: var(--fw-bold);
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
    align-items: start;
  }

  .partnership {
    grid-template-columns: 1.5fr 1fr;
    gap: var(--sp-7);
  }
}

@media (min-width: 1000px) {
  .services {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
