<script setup>
/*
 * Interstitial shown before leaving for a site OCHSNER Austria runs — the
 * download centre, for one. It names the destination, counts down, and lets
 * the visitor go at once or stay. Nothing happens without the dialog: the
 * caller opens it and this component performs the navigation.
 */
import { computed, onBeforeUnmount, ref, watch } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import { redirectNotice } from '@/i18n/bg/common.js'

const props = defineProps({
  /* Absolute URL to leave for. Empty while the dialog is closed. */
  url: { type: String, default: '' },
  seconds: { type: Number, default: 3 }
})
const emit = defineEmits(['close'])

const left = ref(props.seconds)
let timer = null

const host = computed(() => {
  try {
    return new URL(props.url).hostname.replace(/^www\./, '')
  } catch {
    return props.url
  }
})

function stop() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

/* Leave for the destination. Assignment is the reliable route; the fallbacks
   cover browsers that refuse it from a timer rather than a click. */
function go() {
  stop()
  const url = props.url
  if (!url) return
  try {
    window.location.assign(url)
  } catch {
    window.open(url, '_self')
  }
}

function cancel() {
  stop()
  emit('close')
}

function onKey(event) {
  if (event.key === 'Escape') cancel()
}

watch(
  () => props.url,
  (url, previous) => {
    stop()
    if (!url) {
      // Nothing to undo on the first, closed run — which is also the prerender, with no window.
      if (previous) window.removeEventListener('keydown', onKey)
      return
    }
    left.value = props.seconds
    window.addEventListener('keydown', onKey)
    timer = setInterval(() => {
      left.value -= 1
      if (left.value <= 0) go()
    }, 1000)
  },
  { immediate: true }
)

onBeforeUnmount(() => {
  stop()
  window.removeEventListener('keydown', onKey)
})
</script>

<template>
  <Teleport to="body">
    <div v-if="url" class="scrim" @click.self="cancel">
      <div
        class="notice"
        data-redirect-notice
        role="dialog"
        aria-modal="true"
        aria-labelledby="redirect-title"
        aria-describedby="redirect-body"
      >
        <h2 id="redirect-title" class="notice__title">
          <strong>{{ redirectNotice.strong }}</strong> {{ redirectNotice.title }}
        </h2>

        <p id="redirect-body" class="notice__text">
          {{ redirectNotice.text }}
        </p>

        <p class="notice__url">{{ host }}</p>

        <p class="notice__count" aria-live="polite">
          {{ redirectNotice.counting.replace('{n}', Math.max(left, 0)) }}
        </p>

        <div class="notice__actions">
          <BaseButton size="lg" @click="go">{{ redirectNotice.go }}</BaseButton>
          <BaseButton variant="secondary" size="lg" @click="cancel">
            {{ redirectNotice.stay }}
          </BaseButton>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.scrim {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: var(--sp-5);
  background: rgb(0 0 0 / 0.55);
}

.notice {
  width: 100%;
  max-width: 526px;
  padding: clamp(var(--sp-5), 3vw, 50px);
  background: var(--c-surface);
  border-radius: 20px;
  text-align: center;
}

.notice__title {
  margin: 0;
  font-size: var(--fs-h2);
}

.notice__text {
  margin-top: var(--sp-4);
  color: var(--c-ink-soft);
}

.notice__url {
  margin-top: var(--sp-3);
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  color: var(--c-accent-500);
  overflow-wrap: anywhere;
}

.notice__count {
  margin-top: var(--sp-4);
  font-size: var(--fs-small);
  color: var(--c-ink-soft);
}

.notice__actions {
  margin-top: var(--sp-5);
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-4);
  justify-content: center;
}
</style>
