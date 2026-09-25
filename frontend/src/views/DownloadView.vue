<script setup>
/*
 * „Център за изтегляне“ — our own download hub. Redirects to OCHSNER Austria for
 * the full technical archive, and offers the files we host ourselves (catalogue,
 * price list) once the client supplies them.
 */
import { ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import RedirectNotice from '@/components/ui/RedirectNotice.vue'
import { useExternalLink } from '@/composables/useExternalLink.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'
import { downloadCenterUrl } from '@/i18n/bg/common.js'
import PageHero from '@/components/ui/PageHero.vue'

const { download: copy } = useI18n()
const page = ref(null)

/* Detailed docs live on OCHSNER Austria's site — reached via the redirect notice. */
const { leavingFor, confirmLeave, cancelLeave } = useExternalLink()

useSeo({ title: copy.meta.title, description: copy.meta.description, path: '/tsentar-za-izteglyane' })
</script>

<template>
  <div ref="page">
    <PageHero :title="copy.title" :subtitle="copy.intro" />

    <!-- Redirect to the manufacturer's full technical archive -->
    <section class="section">
      <div class="container">
        <div class="external">
          <div class="external__body">
            <h2 class="external__title">
              <strong>{{ copy.external.strong }}</strong> {{ copy.external.title }}
            </h2>
            <p class="external__text">{{ copy.external.text }}</p>
            <BaseButton
              :href="downloadCenterUrl"
              size="lg"
              @click="confirmLeave($event, downloadCenterUrl)"
            >
              {{ copy.external.cta }}
              <AppIcon name="arrowRight" :size="16" />
            </BaseButton>
          </div>
        </div>
      </div>
    </section>

    <!-- Files hosted on our own site -->
    <section class="section section--alt">
      <div class="container">
        <h2 class="files__title">{{ copy.filesTitle }}</h2>
        <ul class="files">
          <li v-for="item in copy.files" :key="item.title" class="file">
            <span class="file__icon"><AppIcon name="display" :size="26" /></span>
            <div class="file__body">
              <h3 class="file__name">{{ item.title }}</h3>
              <p class="file__text">{{ item.text }}</p>
            </div>
            <a v-if="item.file" class="file__cta" :href="item.file" download>
              {{ copy.download }}
              <AppIcon name="arrowRight" :size="16" />
            </a>
            <span v-else class="file__soon">{{ copy.soon }}</span>
          </li>
        </ul>
      </div>
    </section>

    <RedirectNotice :url="leavingFor" @close="cancelLeave" />
  </div>
</template>

<style scoped>
.external {
  max-width: 820px;
  margin-inline: auto;
  padding: clamp(var(--sp-6), 3vw, 50px);
  background: var(--c-surface-alt);
  border-radius: 20px;
}

.external__title {
  font-size: var(--fs-h3);
  font-weight: 300;
  line-height: 1.25;
  color: var(--c-primary-900);
}

.external__title strong {
  font-weight: var(--fw-bold);
}

.external__text {
  margin-top: var(--sp-4);
  line-height: var(--lh-body);
  color: var(--c-ink-soft);
}

.external :deep(.btn) {
  margin-top: var(--sp-5);
  gap: var(--sp-2);
}

.files__title {
  font-size: var(--fs-h3);
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
  text-align: center;
  margin-bottom: var(--sp-6);
}

.files {
  list-style: none;
  padding: 0;
  max-width: 820px;
  margin-inline: auto;
  display: grid;
  gap: var(--sp-4);
}

.file {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  padding: var(--sp-5);
  background: var(--c-surface);
  border-radius: 14px;
  box-shadow: 0 1px 2px rgb(0 0 0 / 0.06);
}

.file__icon {
  flex: 0 0 auto;
  display: grid;
  place-items: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--c-surface-alt);
  color: var(--c-accent-500);
}

.file__body {
  flex: 1 1 auto;
  min-width: 0;
}

.file__name {
  font-size: 1.125rem;
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
}

.file__text {
  margin-top: var(--sp-1);
  font-size: var(--fs-small);
  color: var(--c-ink-soft);
}

.file__cta {
  flex: 0 0 auto;
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-accent-500);
  text-decoration: none;
}

.file__cta:hover {
  text-decoration: underline;
}

.file__soon {
  flex: 0 0 auto;
  padding: 6px 14px;
  border-radius: 999px;
  background: var(--c-surface-alt);
  color: var(--c-ink-soft);
  font-size: var(--fs-small);
  font-weight: var(--fw-medium);
}

@media (max-width: 560px) {
  .file {
    flex-wrap: wrap;
  }
}
</style>
