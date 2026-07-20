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
  /* Stands in for the full-bleed hero photograph: near-black with a subtle
     red wash, matching the corporate hero treatment. */
  background:
    radial-gradient(65% 85% at 78% 22%, rgba(220, 38, 26, 0.22), transparent 60%),
    linear-gradient(155deg, #2f2d2b 0%, #171615 70%);
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
  font-weight: var(--fw-bold);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-accent-500);
  margin-bottom: var(--sp-4);
}

.hero__title {
  font-size: var(--fs-hero);
  font-weight: var(--fw-bold);
  line-height: var(--lh-tight);
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
