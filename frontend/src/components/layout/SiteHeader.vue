<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import BaseButton from '@/components/ui/BaseButton.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import BrandMark from './BrandMark.vue'
import { fetchProducts, useAsyncData } from '@/api/catalog.js'
import { useI18n } from '@/i18n'
import RedirectNotice from '@/components/ui/RedirectNotice.vue'
import { useExternalLink } from '@/composables/useExternalLink.js'
import { downloadCenterUrl } from '@/i18n/bg/common.js'

const { common, nav, contactDetails } = useI18n()
const route = useRoute()

const menuOpen = ref(false)
const scrolled = ref(false)

/** Slug of the nav item whose mega panel is open, or null. */
const openPanel = ref(null)
let closeTimer = null

const links = [
  { name: 'products', label: nav.products, panel: 'products' },
  { name: 'about', label: nav.about },
  { name: 'references', label: nav.references },
  { name: 'partner', label: nav.partner },
  { name: 'contact', label: nav.contact }
]

// Product categories come from the API so the menu never drifts from the catalog.
const { data: products, load } = useAsyncData(fetchProducts)

// Anchors into the "Защо термопомпа" page.

function onScroll() {
  scrolled.value = window.scrollY > 8
}

function closeMenu() {
  menuOpen.value = false
  openPanel.value = null
}

/** Small delay on close so moving the pointer into the panel doesn't dismiss it. */
function openMega(panel) {
  clearTimeout(closeTimer)
  openPanel.value = panel
}

function scheduleCloseMega() {
  clearTimeout(closeTimer)
  closeTimer = setTimeout(() => {
    openPanel.value = null
  }, 140)
}

function toggleMega(panel) {
  clearTimeout(closeTimer)
  openPanel.value = openPanel.value === panel ? null : panel
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
  // Cached in api/catalog.js, so this costs nothing on later pages.
  load()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})

/* External destinations open behind the redirect notice. */
const { leavingFor, confirmLeave, cancelLeave } = useExternalLink()
</script>

<template>
  <header class="header" :class="{ 'header--scrolled': scrolled }">
    <!-- Thin utility bar above the main nav, as on the corporate site. -->
    <div class="utility">
      <div class="container utility__inner">
        <p class="utility__role">{{ common.brandTagline }}</p>
        <nav class="utility__nav" :aria-label="nav.utilityLabel">
          <!-- Service and the partner portal are still to be confirmed with
               OCHSNER Austria; the download centre is theirs and goes through
               the redirect notice. -->
          <a href="#">{{ nav.utility.service }}</a>
          <a :href="downloadCenterUrl" @click="confirmLeave($event, downloadCenterUrl)">
            {{ nav.utility.downloads }}
          </a>
          <a href="#">{{ nav.utility.partnerPortal }}</a>
          <a class="utility__phone" :href="contactDetails.phoneHref">
            <AppIcon name="phone" :size="15" />
            <span>{{ contactDetails.phone }}</span>
          </a>
        </nav>
      </div>
    </div>

    <div class="container header__inner">
      <RouterLink :to="{ name: 'home' }" class="header__brand" @click="closeMenu">
        <BrandMark />
      </RouterLink>

      <nav class="header__nav" :aria-label="nav.mainLabel" @mouseleave="scheduleCloseMega">
        <template v-for="link in links" :key="link.name">
          <!-- Items with a mega panel: the label is still a link, with a
               separate disclosure button so keyboard users can open the panel
               without being forced to navigate. -->
          <span v-if="link.panel" class="header__item" @mouseenter="openMega(link.panel)">
            <RouterLink :to="{ name: link.name }" class="header__link">{{ link.label }}</RouterLink>
            <button
              type="button"
              class="header__disclosure"
              :aria-expanded="openPanel === link.panel"
              :aria-label="`${link.label} — ${nav.megaToggle}`"
              @click="toggleMega(link.panel)"
            >
              <AppIcon name="chevron" :size="14" />
            </button>
          </span>

          <RouterLink v-else :to="{ name: link.name }" class="header__link">
            {{ link.label }}
          </RouterLink>
        </template>
      </nav>

      <div class="header__actions">
        <BaseButton :to="{ name: 'contact' }" size="sm" class="header__cta">
          {{ common.ctaHeader }}
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

    <!-- Mega panels: full-width, flush under the header bar. -->
    <div
      v-if="openPanel"
      class="mega"
      @mouseenter="openMega(openPanel)"
      @mouseleave="scheduleCloseMega"
    >
      <div class="container mega__inner">
        <template v-if="openPanel === 'products'">
          <p class="mega__label">{{ nav.products }}</p>
          <ul class="mega__grid">
            <li v-for="item in products" :key="item.slug">
              <RouterLink
                class="mega__card"
                :to="{ name: 'product-category', params: { slug: item.slug } }"
                @click="closeMenu"
              >
                <PlaceholderImage
                  class="mega__card-media"
                  :src="item.imageUrl"
                  :label="item.title"
                  surface="alt"
                  inset="8%"
                  ratio="4 / 3"
                />
                <span class="mega__card-title">{{ item.title }}</span>
                <span class="mega__card-text">{{ item.shortDescription }}</span>
              </RouterLink>
            </li>
          </ul>
          <RouterLink class="mega__all" :to="{ name: 'products' }" @click="closeMenu">
            {{ nav.megaAllProducts }}
            <AppIcon name="arrowRight" :size="16" />
          </RouterLink>
        </template>

      </div>
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

    <RedirectNotice :url="leavingFor" @close="cancelLeave" />
  </header>
</template>

<style scoped>
/* A hairline rather than a drop shadow while at the top of the page — the
   corporate header separates from the content with a light rule, and only
   gains a shadow once it lifts off the page on scroll. */
.header {
  position: fixed;
  inset-inline: 0;
  top: 0;
  z-index: 100;
  background: #fff;
  border-bottom: 1px solid var(--c-line);
  transition: box-shadow var(--dur) var(--ease);
}

.header--scrolled {
  box-shadow: var(--shadow-sm);
}

/* Utility bar: desktop only — on phones these links live in the drawer.
   Near-black strip with small uppercase white links, matching the corporate
   treatment (12px / weight 300 / uppercase on #262523). */
.utility {
  display: none;
  background: var(--c-surface-deep);
  height: var(--utility-h);
}

.utility__inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--sp-5);
  height: 100%;
}

.utility__role {
  font-size: 0.75rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.55);
}

.utility__nav {
  display: flex;
  align-items: center;
  gap: var(--sp-5);
}

.utility__phone {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-weight: var(--fw-semibold);
  color: #fff;
}

.utility__nav a {
  font-size: 0.75rem;
  font-weight: var(--fw-light);
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.86);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease);
}

.utility__nav a:hover {
  color: #fff;
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
  text-decoration: none;
  color: var(--c-ink);
  /* The lockup is an SVG with no intrinsic width, so as a flex item it would
     otherwise be shrunk to zero by the nav beside it. */
  flex: 0 0 auto;
  /* Below the desktop breakpoint there is no centred nav to balance against,
     so the wordmark still pushes the toggle to the far edge. */
  margin-right: auto;
}

@media (min-width: 1440px) {
  .header__brand {
    margin-right: 0;
  }
}

/* Desktop nav and inline actions are hidden below 1080px. */
.header__nav,
.header__actions {
  display: none;
}

/* Uppercase, bold main nav at the reference's 18px. This only fits now that the
   content column is 1710px wide rather than 1320px. */
.header__link {
  position: relative;
  padding-block: var(--sp-2);
  font-size: 1.125rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  color: var(--c-primary-900);
  text-decoration: none;
  white-space: nowrap;
}

.header__link::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 2px;
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


/* ---------- Mega panel -------------------------------------------------- */

.header__item {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-1);
}

.header__disclosure {
  display: grid;
  place-items: center;
  padding: 2px;
  background: transparent;
  border: 0;
  color: var(--c-ink-muted);
  cursor: pointer;
}

.header__disclosure[aria-expanded='true'] {
  color: var(--c-accent-600);
  transform: rotate(180deg);
}

/* The mega panel belongs to the desktop nav, which is hidden below 1080px. */
.mega {
  display: none;
  position: absolute;
  inset-inline: 0;
  top: 100%;
  background: #fff;
  border-top: 1px solid var(--c-line);
  box-shadow: var(--shadow);
  padding-block: var(--sp-6);
}

.mega__label {
  font-size: var(--fs-eyebrow);
  font-weight: var(--fw-bold);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--c-ink-muted);
  margin-bottom: var(--sp-4);
}

.mega__grid {
  list-style: none;
  padding: 0;
  display: grid;
  /* Six categories now, so let the row reflow rather than pinning four. */
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--sp-4);
}

/* Product thumbnail above the label — the corporate menu is text-only, but the
   manufacturer's cut-outs make the category obvious at a glance. */
.mega__card-media {
  margin-bottom: var(--sp-3);
  transition: transform var(--dur-slow) var(--ease);
}

.mega__card:hover .mega__card-media {
  transform: scale(1.03);
}

.mega__card {
  display: flex;
  flex-direction: column;
  gap: var(--sp-2);
  height: 100%;
  padding: var(--sp-4);
  background: var(--c-surface-alt);
  text-decoration: none;
  color: var(--c-ink);
  border-bottom: 3px solid transparent;
  transition: border-color var(--dur-fast) var(--ease),
    background-color var(--dur-fast) var(--ease);
}

.mega__card:hover {
  background: var(--c-primary-100);
  border-bottom-color: var(--c-accent-600);
  color: var(--c-ink);
}

.mega__card-title {
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 0.9375rem;
  color: var(--c-primary-900);
}

.mega__card-text {
  font-size: 0.8125rem;
  color: var(--c-ink-muted);
  line-height: 1.45;
}

.mega__all {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-5);
  font-weight: var(--fw-bold);
  font-size: 0.875rem;
  text-transform: uppercase;
  text-decoration: none;
}

.mega__links {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--sp-3) var(--sp-5);
}

.mega__links a {
  display: block;
  padding: var(--sp-2) 0;
  color: var(--c-ink);
  text-decoration: none;
  border-bottom: 1px solid var(--c-line-soft);
}

.mega__links a:hover {
  color: var(--c-accent-600);
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

@media (min-width: 1440px) {
  .mega {
    display: block;
  }

  /* On the corporate header the nav sits left of centre — set in after the
     wordmark, with the CTA pushed hard to the right edge — rather than being
     centred in the bar. */
  .header__nav {
    display: flex;
    align-items: center;
    gap: var(--sp-6);
    /* Generous set-in from the wordmark, as on the corporate header, where the
       nav starts roughly 200px clear of the logo lockup. */
    margin-left: var(--sp-7);
  }

  .header__actions {
    display: flex;
    align-items: center;
    gap: var(--sp-4);
    margin-left: auto;
  }

  /* The corporate CONTACT pill measures 18px/700, padding 13px 30px, 44px tall.
     That height only works with a 1.0 line box — the default leading pushes it
     to 57px. */
  .header__cta {
    min-height: 44px;
    padding: 13px 30px;
    font-size: 1.125rem;
    line-height: 1;
  }

  .header__toggle {
    display: none;
  }
}
</style>
