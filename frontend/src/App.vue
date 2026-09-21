<script setup>
import SiteHeader from '@/components/layout/SiteHeader.vue'
import SiteFooter from '@/components/layout/SiteFooter.vue'
import NewsletterPopup from '@/components/ui/NewsletterPopup.vue'
import { useI18n } from '@/i18n'

const { common } = useI18n()
</script>

<template>
  <a class="skip-link" href="#main">{{ common.skipToContent }}</a>
  <SiteHeader />
  <main id="main" tabindex="-1">
    <!--
      Deliberately no route transition. An entrance fade here was leaving page
      content stuck at partial opacity, which on a lead-generation site means
      unreadable copy. Not worth the risk for the visual gain.
    -->
    <RouterView />
  </main>
  <SiteFooter />
  <NewsletterPopup />
</template>

<style scoped>
main {
  /* The header is fixed; on desktop it also carries the utility bar. */
  padding-top: calc(var(--header-h) + var(--utility-h));
  outline: none;
}
</style>
