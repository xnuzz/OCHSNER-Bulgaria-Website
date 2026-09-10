<script setup>
/*
 * Newsletter subscribe pop-up. Appears once, a short while after the visitor
 * lands, and never again in the same browser once dismissed or submitted.
 *
 * Design-only for now (per client): the email is validated and a thank-you is
 * shown, but nothing is posted to a mailing-list service yet. When a list
 * provider is chosen, POST the address in `subscribe()` where marked.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { newsletter } from '@/i18n/bg/common.js'

/* Bumping the version re-shows the pop-up to everyone (e.g. after a redesign). */
const STORAGE_KEY = 'ochsner-newsletter-v1'
const DELAY_MS = 8000

const open = ref(false)
const email = ref('')
const done = ref(false)
const error = ref('')
let timer = null

function seen() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'done'
  } catch {
    return false
  }
}

function remember() {
  try {
    localStorage.setItem(STORAGE_KEY, 'done')
  } catch {
    /* private mode / storage disabled — the pop-up simply reappears next visit */
  }
}

function close() {
  open.value = false
  remember()
}

function subscribe() {
  const value = email.value.trim()
  // Same shape of check the contact form uses — good enough for a signup field.
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    error.value = newsletter.invalid
    return
  }
  error.value = ''
  // TODO: POST `value` to the chosen mailing-list service here.
  done.value = true
  remember()
}

function onKey(event) {
  if (event.key === 'Escape' && open.value) close()
}

onMounted(() => {
  if (seen()) return
  timer = setTimeout(() => {
    open.value = true
  }, DELAY_MS)
  window.addEventListener('keydown', onKey)
})

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="np">
      <div v-if="open" class="np" role="dialog" aria-modal="true" aria-labelledby="np-title">
        <div class="np__scrim" @click="close"></div>

        <div class="np__card">
          <button type="button" class="np__close" :aria-label="newsletter.close" @click="close">
            <AppIcon name="plus" :size="20" class="np__close-icon" />
          </button>

          <template v-if="!done">
            <p class="np__eyebrow">{{ newsletter.eyebrow }}</p>
            <h2 id="np-title" class="np__title">{{ newsletter.title }}</h2>
            <p class="np__text">{{ newsletter.text }}</p>

            <form class="np__form" novalidate @submit.prevent="subscribe">
              <input
                v-model="email"
                type="email"
                class="np__input"
                :class="{ 'np__input--error': error }"
                :placeholder="newsletter.placeholder"
                :aria-label="newsletter.placeholder"
                autocomplete="email"
              />
              <button type="submit" class="np__submit">{{ newsletter.submit }}</button>
            </form>

            <p v-if="error" class="np__error" role="alert">{{ error }}</p>
            <button type="button" class="np__dismiss" @click="close">{{ newsletter.dismiss }}</button>
          </template>

          <template v-else>
            <div class="np__check" aria-hidden="true">
              <AppIcon name="check" :size="30" />
            </div>
            <h2 class="np__title">{{ newsletter.success }}</h2>
            <button type="button" class="np__submit np__submit--wide" @click="close">
              {{ newsletter.close }}
            </button>
          </template>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.np {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: var(--sp-5);
}

.np__scrim {
  position: absolute;
  inset: 0;
  background: rgb(0 0 0 / 0.5);
}

.np__card {
  position: relative;
  width: 100%;
  max-width: 460px;
  padding: clamp(var(--sp-6), 4vw, 48px);
  background: var(--c-surface);
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 24px 60px rgb(0 0 0 / 0.25);
}

.np__close {
  position: absolute;
  top: var(--sp-3);
  right: var(--sp-3);
  display: grid;
  place-items: center;
  width: 36px;
  height: 36px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--c-ink-soft);
  cursor: pointer;
}

.np__close:hover {
  background: var(--c-surface-alt);
}

.np__close-icon {
  transform: rotate(45deg);
}

.np__eyebrow {
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--c-accent-500);
}

.np__title {
  margin-top: var(--sp-2);
  font-size: var(--fs-h3);
  font-weight: var(--fw-bold);
  line-height: 1.25;
  color: var(--c-primary-900);
}

.np__text {
  margin-top: var(--sp-3);
  line-height: var(--lh-body);
  color: var(--c-ink-soft);
}

.np__form {
  margin-top: var(--sp-5);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
}

.np__input {
  flex: 1 1 200px;
  min-width: 0;
  padding: 13px 16px;
  border: 1px solid var(--c-line);
  border-radius: 999px;
  font: inherit;
}

.np__input--error {
  border-color: var(--c-accent-500);
}

.np__submit {
  flex: 0 0 auto;
  padding: 13px 26px;
  border: 0;
  border-radius: 999px;
  background: var(--c-accent-500);
  color: #fff;
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  cursor: pointer;
}

.np__submit:hover {
  background: color-mix(in srgb, var(--c-accent-500) 88%, #000);
}

.np__submit--wide {
  margin-top: var(--sp-5);
  width: 100%;
}

.np__error {
  margin-top: var(--sp-3);
  font-size: var(--fs-small);
  color: var(--c-accent-500);
}

.np__dismiss {
  margin-top: var(--sp-4);
  border: 0;
  background: transparent;
  color: var(--c-ink-soft);
  font: inherit;
  text-decoration: underline;
  cursor: pointer;
}

.np__check {
  display: grid;
  place-items: center;
  width: 60px;
  height: 60px;
  margin: 0 auto var(--sp-3);
  border-radius: 999px;
  background: color-mix(in srgb, var(--c-accent-500) 12%, transparent);
  color: var(--c-accent-500);
}

.np-enter-active,
.np-leave-active {
  transition: opacity 0.25s ease;
}

.np-enter-from,
.np-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .np-enter-active,
  .np-leave-active {
    transition: none;
  }
}
</style>
