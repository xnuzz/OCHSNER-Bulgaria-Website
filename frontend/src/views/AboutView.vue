<script setup>
import { ref } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import CtaBand from '@/components/ui/CtaBand.vue'
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

    <!-- The local representative: text beside the credentials card -->
    <section class="section">
      <div class="container rep">
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

          <p class="rep__firm">
            <span class="rep__firm-label">{{ about.representative.company.label }}</span>
            <a
              class="exclusive__name"
              :href="about.representative.company.href"
              target="_blank"
              rel="noopener"
            >
              {{ about.representative.company.name }}
              <AppIcon name="arrowRight" :size="16" />
            </a>
          </p>
        </div>

        <div class="creds">
          <h3 class="creds__title">{{ about.representative.credentials.title }}</h3>
          <ul class="creds__list">
            <li v-for="item in about.representative.credentials.items" :key="item">
              <AppIcon name="check" :size="16" class="creds__tick" />
              <span>{{ item }}</span>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- OCHSNER: tradition, production, range — and the Bulgarian representative -->
    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :strong="about.tradition.strong"
          :title="about.tradition.light"
          level="h2"
          align="center"
          rule
        />
        <div class="story">
          <p v-for="paragraph in about.tradition.body" :key="paragraph">{{ paragraph }}</p>
        </div>

        <div class="duo">
          <article v-for="(col, i) in about.tradition.columns" :key="col.title" class="duo__col">
            <h3 class="duo__title">{{ col.title }}</h3>
            <p class="duo__text">{{ col.text }}</p>
            <RouterLink v-if="col.cta && i === 0" class="duo__cta" :to="{ name: 'products' }">
              {{ col.cta }}
              <AppIcon name="arrowRight" :size="16" />
            </RouterLink>
          </article>
        </div>

        <p class="exclusive">
          <span>{{ about.tradition.exclusive.before }}</span>
          <a
            class="exclusive__name"
            :href="about.tradition.exclusive.href"
            target="_blank"
            rel="noopener"
          >
            {{ about.tradition.exclusive.name }}
            <AppIcon name="arrowRight" :size="16" />
          </a>
        </p>
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
.rep {
  max-width: 1082px;
  display: grid;
  gap: var(--sp-6);
}

.rep__paragraph + .rep__paragraph {
  margin-top: var(--sp-4);
}

.rep__firm {
  margin-top: var(--sp-6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-3) var(--sp-4);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
}

.rep__firm-label {
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.rep__paragraph {
  color: var(--c-ink-soft);
  line-height: var(--lh-body);
  max-width: 62ch;
}

/* Credentials in their own card rather than a bare bullet list. */
.creds {
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

/* --- tradition ------------------------------------------------------- */
.story {
  max-width: 820px;
  margin: 0 auto;
  text-align: center;
  color: var(--c-ink-soft);
  line-height: var(--lh-body);
}

.story p + p {
  margin-top: var(--sp-4);
}

/* Two columns in one card, split by the red rule from the client's layout. */
.duo {
  max-width: 1082px;
  margin: var(--sp-7) auto 0;
  display: grid;
  background: var(--c-surface);
  border-radius: 20px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
  overflow: hidden;
}

.duo__col {
  display: flex;
  flex-direction: column;
  padding: clamp(var(--sp-5), 3vw, 44px);
}

.duo__col + .duo__col {
  border-top: 2px solid var(--c-accent-600);
}

.duo__title {
  font-size: 1.25rem;
  font-weight: var(--fw-bold);
  line-height: 1.3;
  color: var(--c-primary-900);
  text-wrap: balance;
}

.duo__text {
  margin-top: var(--sp-4);
  color: var(--c-ink-soft);
  line-height: var(--lh-body);
}

.duo__cta {
  align-self: flex-start;
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  min-height: 46px;
  padding: 12px 24px;
  border-radius: 999px;
  background: var(--c-accent-600);
  font-family: var(--font-heading);
  font-size: 0.875rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  color: #fff;
  text-decoration: none;
  transition: background-color var(--dur-fast) var(--ease), gap var(--dur-fast) var(--ease);
}

.duo__text + .duo__cta {
  margin-top: var(--sp-6);
}

.duo__cta:hover {
  gap: var(--sp-3);
  background: var(--c-accent-700);
}

/* the representative: the company name is the link to its site */
.exclusive {
  margin-top: var(--sp-7);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: var(--sp-2) var(--sp-3);
  text-align: center;
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
}

.exclusive__name {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  padding: 8px 18px;
  border: 1px solid var(--c-accent-600);
  border-radius: 999px;
  color: var(--c-accent-600);
  text-decoration: none;
  transition: background-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}

.exclusive__name:hover {
  background: var(--c-accent-600);
  color: #fff;
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
    grid-template-columns: 1.5fr 1fr;
    gap: var(--sp-8);
    align-items: center;
  }

  .duo {
    grid-template-columns: 1fr 1fr;
  }

  .duo__col + .duo__col {
    border-top: 0;
    border-left: 2px solid var(--c-accent-600);
  }
}

@media (min-width: 1000px) {
  .services {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
