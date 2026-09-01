<script setup>
import BrandMark from './BrandMark.vue'
import { useI18n } from '@/i18n'

const { common, nav, footer, contactDetails } = useI18n()

const links = [
  { name: 'products', label: nav.products },
  { name: 'about', label: nav.about },
  { name: 'references', label: nav.references },
  { name: 'partner', label: nav.partner },
  { name: 'contact', label: nav.contact }
]

const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container footer__grid">
      <div class="footer__brand">
        <RouterLink :to="{ name: 'home' }" class="footer__logo">
          <BrandMark />
          <span>
            <strong>{{ common.brand }}</strong>
            <span class="footer__logo-sub">{{ common.brandSuffix }}</span>
          </span>
        </RouterLink>
        <p class="footer__about">{{ footer.about }}</p>
      </div>

      <nav class="footer__col" :aria-label="nav.footerLabel">
        <h2 class="footer__heading">{{ footer.navHeading }}</h2>
        <ul class="footer__list">
          <li v-for="link in links" :key="link.name">
            <RouterLink :to="{ name: link.name }">{{ link.label }}</RouterLink>
          </li>
        </ul>
      </nav>

      <div class="footer__col">
        <h2 class="footer__heading">{{ footer.contactHeading }}</h2>
        <ul class="footer__list">
          <li><a :href="contactDetails.phoneHref">{{ contactDetails.phone }}</a></li>
          <li><a :href="contactDetails.emailHref">{{ contactDetails.email }}</a></li>
          <li>{{ contactDetails.address }}</li>
          <li>{{ contactDetails.hours }}</li>
        </ul>
      </div>

      <div class="footer__col">
        <h2 class="footer__heading">{{ footer.legalHeading }}</h2>
        <ul class="footer__list">
          <!-- Legal pages are not built yet; the client will supply the texts. -->
          <li><a href="#">{{ footer.privacy }}</a></li>
          <li><a href="#">{{ footer.terms }}</a></li>
          <li><a href="#">{{ footer.cookies }}</a></li>
        </ul>
      </div>
    </div>

    <div class="container footer__bottom">
      <p class="footer__legal">{{ footer.legalNote }}</p>
      <p class="footer__copy">© {{ year }} {{ contactDetails.companyName }}. {{ footer.copyright }}</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--c-primary-900);
  color: rgba(255, 255, 255, 0.78);
  padding-block: var(--sp-8) var(--sp-6);
  font-size: var(--fs-small);
}

.footer__grid {
  display: grid;
  gap: var(--sp-6);
}

.footer__logo {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-3);
  color: #fff;
  text-decoration: none;
  font-family: var(--font-heading);
}

.footer__logo strong {
  display: block;
  font-size: 1.1rem;
  letter-spacing: 0.06em;
}

.footer__logo-sub {
  display: block;
  font-size: 0.7rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--c-primary-300);
}

.footer__about {
  margin-top: var(--sp-4);
  max-width: 42ch;
  line-height: var(--lh-body);
}

.footer__heading {
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  color: #fff;
  margin-bottom: var(--sp-3);
}

.footer__list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--sp-2);
}

.footer__list a {
  color: rgba(255, 255, 255, 0.78);
  text-decoration: none;
}

.footer__list a:hover {
  color: #fff;
  text-decoration: underline;
}

.footer__bottom {
  margin-top: var(--sp-7);
  padding-top: var(--sp-5);
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  display: grid;
  gap: var(--sp-3);
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.8rem;
}

.footer__legal {
  max-width: 80ch;
}

@media (min-width: 700px) {
  .footer__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .footer__grid {
    grid-template-columns: 2fr 1fr 1.2fr 1fr;
    gap: var(--sp-7);
  }

  .footer__bottom {
    grid-template-columns: 1fr auto;
    align-items: center;
  }
}
</style>
