<script setup>
import BaseButton from '@/components/ui/BaseButton.vue'
import { useI18n } from '@/i18n'

const { common, home } = useI18n()
</script>

<template>
  <section class="hero">
    <div class="hero__bg" aria-hidden="true"></div>
    <div class="container hero__inner">
      <p class="hero__eyebrow">{{ home.hero.eyebrow }}</p>
      <h1 class="hero__title">{{ home.hero.title }}</h1>
      <p class="hero__subtitle">{{ home.hero.subtitle }}</p>
      <div class="hero__actions">
        <BaseButton :to="{ name: 'contact' }" size="lg">{{ common.ctaPrimary }}</BaseButton>
        <BaseButton :to="{ name: 'products' }" variant="light" size="lg">
          {{ common.ctaSecondary }}
        </BaseButton>
      </div>
      <p class="hero__note">{{ home.hero.ctaNote }}</p>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  isolation: isolate;
  display: flex;
  align-items: center;
  min-height: min(78vh, 640px);
  padding-block: var(--sp-8);
  color: #fff;
  overflow: hidden;
}

/*
 * A CSS-only hero: gradient + soft radial highlights stand in for the final
 * photography. Because it is not an image, it costs nothing on LCP.
 */
.hero__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    radial-gradient(60% 80% at 82% 18%, rgba(240, 140, 26, 0.28), transparent 62%),
    radial-gradient(70% 90% at 12% 88%, rgba(26, 141, 174, 0.45), transparent 60%),
    linear-gradient(150deg, var(--c-primary-800) 0%, var(--c-primary-900) 62%);
}

.hero__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
  background-size: 44px 44px;
  mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.55), transparent 70%);
}

.hero__eyebrow {
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-primary-300);
  margin-bottom: var(--sp-4);
}

.hero__title {
  font-size: var(--fs-hero);
  max-width: 17ch;
  color: #fff;
}

.hero__subtitle {
  margin-top: var(--sp-5);
  font-size: var(--fs-lead);
  line-height: var(--lh-body);
  color: rgba(255, 255, 255, 0.85);
  max-width: 56ch;
}

.hero__actions {
  margin-top: var(--sp-6);
  display: flex;
  flex-direction: column;
  gap: var(--sp-3);
}

.hero__note {
  margin-top: var(--sp-4);
  font-size: var(--fs-small);
  color: rgba(255, 255, 255, 0.62);
}

@media (min-width: 560px) {
  .hero__actions {
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
