<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import BrandMark from './BrandMark.vue'
import { useI18n } from '@/i18n'

const { common, nav, contactDetails } = useI18n()
const route = useRoute()

const menuOpen = ref(false)
const scrolled = ref(false)

const links = [
  { name: 'products', label: nav.products },
  { name: 'why', label: nav.why },
  { name: 'about', label: nav.about },
  { name: 'references', label: nav.references },
  { name: 'partner', label: nav.partner },
  { name: 'contact', label: nav.contact }
]

function onScroll() {
  scrolled.value = window.scrollY > 8
}

function closeMenu() {
  menuOpen.value = false
}

function onKeydown(event) {
  if (event.key === 'Escape') closeMenu()
}

// Close the drawer on navigation so a tap on a link never leaves it open.
watch(() => route.fullPath, closeMenu)

// Lock the page behind the open drawer.
watch(menuOpen, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
})

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <!-- Thin utility bar above the main nav, as on the corporate site. -->
    <div class="utility">
      <div class="container utility__inner">
        <nav class="utility__nav" :aria-label="nav.utilityLabel">
          <!-- Destinations to be confirmed with OCHSNER Austria. -->
          <a href="#">{{ nav.utility.service }}</a>
          <a href="#">{{ nav.utility.downloads }}</a>
          <a href="#">{{ nav.utility.partnerPortal }}</a>
          <RouterLink :to="{ name: 'partner' }">{{ nav.utility.becomePartner }}</RouterLink>
        </nav>
      </div>
    </div>

    <div class="container header__inner">
      <RouterLink :to="{ name: 'home' }" class="header__brand" @click="closeMenu">
        <BrandMark />
        <span class="header__brand-text">
          <span class="header__brand-name">{{ common.brand }}</span>
          <span class="header__brand-sub">{{ common.brandSuffix }}</span>
        </span>
      </RouterLink>

      <nav class="header__nav" :aria-label="nav.mainLabel">
        <RouterLink v-for="link in links" :key="link.name" :to="{ name: link.name }" class="header__link">
          {{ link.label }}
        </RouterLink>
      </nav>

      <div class="header__actions">
        <a class="header__phone" :href="contactDetails.phoneHref">
          <span aria-hidden="true">☎</span>
          <span>{{ contactDetails.phone }}</span>
        </a>
        <BaseButton :to="{ name: 'contact' }" size="sm" class="header__cta">
          {{ common.ctaPrimary }}
        </BaseButton>
      </div>

      <button
        class="header__toggle"
        type="button"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        :aria-label="menuOpen ? common.closeMenu : common.openMenu"
        @click="menuOpen = !menuOpen"
      >
        <span class="header__toggle-bar" :class="{ 'is-open': menuOpen }"></span>
      </button>
    </div>

    <Transition name="drawer">
      <div v-if="menuOpen" id="mobile-nav" class="drawer">
        <nav class="drawer__nav" :aria-label="nav.mobileLabel">
          <RouterLink
            v-for="link in links"
            :key="link.name"
            :to="{ name: link.name }"
            class="drawer__link"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <div class="drawer__footer">
          <BaseButton :to="{ name: 'contact' }" size="lg" block>
            {{ common.ctaPrimary }}
          </BaseButton>
          <a class="drawer__phone" :href="contactDetails.phoneHref">{{ contactDetails.phone }}</a>
        </div>
      </div>
    </Transition>
  </header>
</template>

<style scoped>
.header {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 100;
  background: #fff;
  box-shadow: var(--shadow-sm);
}

.header--scrolled {
  box-shadow: var(--shadow);
}

/* Utility bar: desktop only — on phones these links live in the drawer. */
.utility {
  display: none;
  background: var(--c-surface-alt);
  border-bottom: 1px solid var(--c-line);
  height: var(--utility-h);
}

.utility__inner {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
}

.utility__nav {
  display: flex;
  gap: var(--sp-5);
}

.utility__nav a {
  font-size: 0.8125rem;
  color: var(--c-ink-muted);
  text-decoration: none;
}

.utility__nav a:hover {
  color: var(--c-accent-600);
}

.header__inner {
  display: flex;
  align-items: center;
  gap: var(--sp-4);
  height: var(--header-h);
}

.header__brand {
  display: flex;
  align-items: center;
  gap: var(--sp-3);
  text-decoration: none;
  color: var(--c-ink);
  margin-right: auto;
}

.header__brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.header__brand-name {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 1.35rem;
  letter-spacing: 0.04em;
  color: var(--c-accent-600);
}

.header__brand-sub {
  font-size: 0.65rem;
  font-weight: var(--fw-regular);
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--c-ink-muted);
}

/* Desktop nav and inline actions are hidden below 1080px. */
.header__nav,
.header__actions {
  display: none;
}

/* Uppercase, bold main nav — the corporate treatment. */
.header__link {
  position: relative;
  padding-block: var(--sp-2);
  font-size: 0.875rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  color: var(--c-primary-800);
  text-decoration: none;
  white-space: nowrap;
}

.header__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 3px;
  background: var(--c-accent-600);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform var(--dur) var(--ease);
}

.header__link:hover,
.header__link.router-link-active {
  color: var(--c-accent-600);
}

.header__link:hover::after,
.header__link.router-link-active::after {
  transform: scaleX(1);
}

.header__phone {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--c-primary-800);
  text-decoration: none;
  white-space: nowrap;
}

/* ---------- Hamburger --------------------------------------------------- */

.header__toggle {
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  background: transparent;
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  cursor: pointer;
}

.header__toggle-bar,
.header__toggle-bar::before,
.header__toggle-bar::after {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--c-primary-800);
  transition: transform var(--dur) var(--ease), opacity var(--dur-fast) var(--ease);
}

.header__toggle-bar::before,
.header__toggle-bar::after {
  content: '';
  position: absolute;
}

.header__toggle-bar::before {
  transform: translateY(-6px);
}

.header__toggle-bar::after {
  transform: translateY(6px);
}

.header__toggle-bar.is-open {
  background: transparent;
}

.header__toggle-bar.is-open::before {
  transform: rotate(45deg);
}

.header__toggle-bar.is-open::after {
  transform: rotate(-45deg);
}

/* ---------- Mobile drawer ---------------------------------------------- */

.drawer {
  position: fixed;
  inset: var(--header-h) 0 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: var(--sp-6);
  padding: var(--sp-5) var(--gutter) var(--sp-8);
  background: var(--c-surface);
  overflow-y: auto;
}

.drawer__nav {
  display: flex;
  flex-direction: column;
}

.drawer__link {
  padding: var(--sp-4) 0;
  border-bottom: 1px solid var(--c-line-soft);
  font-family: var(--font-heading);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--c-ink);
  text-decoration: none;
}

.drawer__link.router-link-active {
  color: var(--c-primary-700);
}

.drawer__footer {
  display: grid;
  gap: var(--sp-4);
  justify-items: center;
}

.drawer__phone {
  font-weight: 600;
  color: var(--c-primary-800);
  text-decoration: none;
}

.drawer-enter-active,
.drawer-leave-active {
  transition: opacity var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

/* ---------- Desktop ----------------------------------------------------- */

@media (min-width: 1080px) {
  .utility {
    display: block;
  }

  .header__nav {
    display: flex;
    align-items: center;
    gap: var(--sp-5);
  }

  .header__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
  }

  .header__toggle {
    display: none;
  }
}
</style>
