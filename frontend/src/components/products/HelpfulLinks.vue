<script setup>
/**
 * "Helpful links", mirroring the reference's hpo-hilfreiche-links block at the
 * foot of every product page: bold-lead heading over a hairline, then white
 * cards with a small photo beside a title and one line of text. The whole card
 * is the link.
 */
import { useI18n } from '@/i18n'

const { categoryCommon } = useI18n()
const [strong, ...rest] = categoryCommon.linksTitle.split(' ')
</script>

<template>
  <div>
    <h2 class="hl__title"><strong>{{ strong }}</strong> {{ rest.join(' ') }}</h2>
    <ul class="hl__cards">
      <li v-for="link in categoryCommon.links" :key="link.title" class="hl__card">
        <img class="hl__img" :src="link.image" alt="" width="80" height="56" loading="lazy" decoding="async" />
        <div class="hl__body">
          <h3 class="hl__name">
            <RouterLink :to="{ name: link.to }">{{ link.title }}</RouterLink>
          </h3>
          <p class="hl__text">{{ link.text }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
/* Values are the reference's own. */
.hl__title {
  font-size: var(--fs-h2);
  font-weight: var(--fw-light);
  line-height: var(--lh-snug);
  color: var(--c-primary-900);
  max-width: none;
  padding-bottom: 1rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #383838;
}

.hl__title strong {
  font-weight: var(--fw-bold);
}

.hl__cards {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: 1.875rem;
}

.hl__card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.25rem;
  background: #fff;
  border-radius: 1.25rem;
  transition: box-shadow 0.2s;
}

.hl__card:hover {
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.08);
}

.hl__img {
  flex: 0 0 auto;
  width: 5rem;
  height: 3.5rem;
  object-fit: cover;
  border-radius: 0.625rem;
}

.hl__body {
  flex: 1;
  min-width: 0;
}

.hl__name {
  margin: 0;
  font-size: var(--fs-h3);
  font-weight: var(--fw-bold);
  max-width: none;
}

.hl__name a {
  color: #383838;
  text-decoration: none;
  transition: color var(--dur) var(--ease);
}

.hl__name a::after {
  content: ' →';
}

/* Stretch the link over the whole card. */
.hl__name a::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 1;
  border-radius: inherit;
}

.hl__name a:hover {
  color: var(--c-accent-600);
}

.hl__text {
  margin: 0;
  font-size: 1rem;
  line-height: 1.625;
  color: #555;
}

@media (min-width: 1023px) {
  .hl__cards {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1240px) {
  .hl__cards {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
