<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { notFound } = useI18n()

useSeo({ title: notFound.meta.title, description: notFound.text })
</script>

<template>
  <section class="section">
    <div class="container container--narrow notfound">
      <p class="notfound__code" aria-hidden="true">404</p>
      <h1>{{ notFound.title }}</h1>
      <p class="lead">{{ notFound.text }}</p>
      <BaseButton :to="{ name: 'home' }" size="lg">{{ notFound.cta }}</BaseButton>
    </div>
  </section>
</template>

<style scoped>
.notfound {
  display: grid;
  gap: var(--sp-4);
  justify-items: start;
  padding-block: var(--sp-8);
}

.notfound__code {
  font-family: var(--font-heading);
  font-size: clamp(3rem, 2rem + 6vw, 6rem);
  font-weight: 700;
  line-height: 1;
  color: var(--c-primary-100);
}
</style>
