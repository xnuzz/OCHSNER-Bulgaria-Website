<script setup>
/*
 * „Център за изтегляне“ — the Bulgarian brochures, read as a book or downloaded,
 * and the way on to OCHSNER Austria's archive for the technical documents.
 */
import PageHero from '@/components/ui/PageHero.vue'
import BrochureShelf from '@/components/home/BrochureShelf.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import RedirectNotice from '@/components/ui/RedirectNotice.vue'
import { useExternalLink } from '@/composables/useExternalLink.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'
import { downloadCenterUrl } from '@/i18n/bg/common.js'

const { download: copy } = useI18n()
const tech = copy.technical

/* Technical docs live on OCHSNER Austria's site — reached via the redirect notice. */
const { leavingFor, confirmLeave, cancelLeave } = useExternalLink()

useSeo({ title: copy.meta.title, description: copy.meta.description, path: '/tsentar-za-izteglyane' })
</script>

<template>
  <div>
    <PageHero
      :eyebrow="copy.hero.eyebrow"
      :title="copy.hero.title"
      :subtitle="copy.hero.subtitle"
      :bold-words="1"
    />

    <BrochureShelf
      :strong="copy.brochures.strong"
      :light="copy.brochures.light"
      :intro="copy.brochures.intro"
      :more-link="false"
    />

    <!-- Technical documents: OCHSNER Austria's download centre -->
    <section class="section section--alt">
      <div class="container">
        <div class="tech">
          <div class="tech__copy">
            <p class="tech__eyebrow">
              <AppIcon name="globe" :size="16" />
              {{ tech.eyebrow }}
            </p>
            <h2 class="tech__title">
              <strong>{{ tech.strong }}</strong> {{ tech.light }}
            </h2>
            <span class="tech__rule" aria-hidden="true"></span>
            <p class="tech__text">{{ tech.text }}</p>

            <div class="tech__actions">
              <a
                class="tech__cta"
                :href="downloadCenterUrl"
                @click="confirmLeave($event, downloadCenterUrl)"
              >
                {{ tech.cta }}
                <AppIcon name="arrowRight" :size="16" />
              </a>
              <span class="tech__note">{{ tech.note }}</span>
            </div>
          </div>

          <ul class="tech__types">
            <li v-for="t in tech.types" :key="t.title">
              <a
                class="type"
                :href="downloadCenterUrl"
                @click="confirmLeave($event, downloadCenterUrl)"
              >
                <span class="type__icon"><AppIcon :name="t.icon" :size="22" /></span>
                <span class="type__title">{{ t.title }}</span>
                <span class="type__text">{{ t.text }}</span>
                <span class="type__go" aria-hidden="true"><AppIcon name="arrowRight" :size="16" /></span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <RedirectNotice :url="leavingFor" @close="cancelLeave" />
  </div>
</template>

<style scoped>
.tech {
  max-width: 1180px;
  margin-inline: auto;
  display: grid;
  gap: clamp(var(--sp-6), 4vw, 60px);
  padding: clamp(var(--sp-5), 4vw, 56px);
  border-radius: 20px;
  background: var(--c-surface);
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.05);
}

.tech__eyebrow {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-ink-muted);
}

.tech__eyebrow :deep(.icon) {
  color: var(--c-accent-600);
}

.tech__title {
  margin-top: var(--sp-3);
  font-weight: 300;
  color: var(--c-primary-900);
}

.tech__title strong {
  font-weight: var(--fw-bold);
}

.tech__rule {
  display: block;
  width: 48px;
  height: 3px;
  margin-top: var(--sp-4);
  border-radius: 3px;
  background: var(--c-accent-600);
}

.tech__text {
  margin-top: var(--sp-5);
  max-width: 46ch;
  line-height: var(--lh-body);
  color: var(--c-ink-soft);
}

.tech__actions {
  margin-top: var(--sp-6);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: var(--sp-3) var(--sp-5);
}

.tech__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  min-height: 48px;
  padding: 12px 26px;
  border-radius: 999px;
  background: var(--c-accent-600);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  color: #fff;
  text-decoration: none;
  transition: background-color var(--dur-fast) var(--ease), gap var(--dur-fast) var(--ease);
}

.tech__cta:hover {
  gap: var(--sp-3);
  background: var(--c-accent-700);
}

.tech__note {
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

/* document types — every tile leads to the same archive */
.tech__types {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: var(--sp-3);
}

.type {
  position: relative;
  display: grid;
  grid-template-columns: auto 1fr;
  column-gap: var(--sp-4);
  align-items: center;
  height: 100%;
  padding: var(--sp-4) var(--sp-5);
  padding-right: 52px;
  border: 1px solid var(--c-line);
  border-radius: 16px;
  background: var(--c-surface);
  text-decoration: none;
  transition: border-color var(--dur) var(--ease), box-shadow var(--dur) var(--ease),
    transform var(--dur) var(--ease);
}

.type:hover {
  transform: translateY(-2px);
  border-color: transparent;
  box-shadow: var(--shadow-lg);
}

.type__icon {
  grid-row: span 2;
  display: grid;
  place-items: center;
  width: 46px;
  height: 46px;
  border-radius: 12px;
  background: var(--c-surface-alt);
  color: var(--c-accent-600);
  transition: background-color var(--dur) var(--ease), color var(--dur) var(--ease);
}

.type:hover .type__icon {
  background: var(--c-accent-600);
  color: #fff;
}

.type__title {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  line-height: 1.3;
  color: var(--c-primary-900);
}

.type__text {
  margin-top: 2px;
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.type__go {
  position: absolute;
  top: 50%;
  right: var(--sp-5);
  color: var(--c-ink-muted);
  transform: translateY(-50%);
  transition: color var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.type:hover .type__go {
  color: var(--c-accent-600);
  transform: translate(4px, -50%);
}

@media (min-width: 640px) {
  .tech__types {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .tech {
    grid-template-columns: 1fr 1fr;
    align-items: center;
  }

  /* one row per document type next to the copy */
  .tech__types {
    grid-template-columns: 1fr;
  }
}
</style>
