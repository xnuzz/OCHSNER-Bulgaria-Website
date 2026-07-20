<script setup>
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import { useI18n } from '@/i18n'

const { common } = useI18n()
</script>

<template>
  <a class="skip-link" href="#main">{{ common.skipToContent }}</a>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <RouterView v-slot="{ Component }">
      <Transition name="route-fade" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </main>
  <SiteFooter />
</template>

<style scoped>
main {
  /* The header is fixed, so the page content starts below it. */
  padding-top: var(--header-h);
  outline: none;
}
</style>
