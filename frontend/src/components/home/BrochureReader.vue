<script setup>
/**
 * Full-screen brochure reader. The catalogues are laid out as facing pages, so
 * on wide screens they are shown as an open book — cover alone on the right,
 * then 2–3, 4–5 … — with a page that physically turns over the spine.
 *
 * Phones held upright get the closed-book view instead: one page, bound on the
 * left, with the unread pages stacked along the right edge. The page is turned
 * by dragging it with a finger — it follows the finger over the spine and
 * either completes or falls back when let go. Turn the phone sideways and the
 * two-page spread returns.
 *
 * Pages are pre-rendered images (public/images/brochures/pages/<slug>/NN.webp),
 * so nothing heavier than an <img> is needed to read them.
 */
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AppIcon from '@/components/ui/AppIcon.vue'

const props = defineProps({
  item: { type: Object, default: null },
  labels: { type: Object, required: true }
})
const emit = defineEmits(['close'])

const FLIP_MS = 850
const SOLO_MS = 620

/* ---------- layout mode ---------- */
const wide = ref(true)
let mq = null
const syncMode = () => (wide.value = mq.matches)
onMounted(() => {
  mq = window.matchMedia('(min-width: 560px) and (min-aspect-ratio: 1/1)')
  syncMode()
  mq.addEventListener('change', syncMode)
})
onBeforeUnmount(() => mq?.removeEventListener('change', syncMode))

/* ---------- pages & spreads ---------- */
const src = (n) => (n ? `${props.item.pagesDir}${String(n).padStart(2, '0')}.webp` : null)

const spreads = computed(() => {
  const n = props.item?.pages || 0
  if (!wide.value) return Array.from({ length: n }, (_, i) => [i + 1])
  const out = [[null, 1]]
  for (let p = 2; p <= n; p += 2) out.push([p, p + 1 <= n ? p + 1 : null])
  return out
})

const index = ref(0)
const flip = ref(null) // { dir: 'next' | 'prev', from: [..], to: [..] }
const solo = ref(null) // single-page turn: { dir, target, from, to, p: 0..1, anim }
const bookEl = ref(null)
const zoom = ref(false)

const current = computed(() => spreads.value[index.value] || [])
const label = computed(() => current.value.filter(Boolean).join('–'))

/* What the two static halves show while a leaf is turning. */
const base = computed(() => {
  const f = flip.value
  if (!f) return current.value
  return f.dir === 'next' ? [f.from[0], f.to[1]] : [f.to[0], f.from[1]]
})

/* Keep the cover (or back page) centred instead of hanging off to one side. */
const shift = computed(() => {
  if (!wide.value) return 0
  const s = flip.value ? flip.value.to : current.value
  if (s[0] == null) return -25
  if (s[1] == null) return 25
  return 0
})

const reducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches

function go(delta) {
  const target = index.value + delta
  if (!delta || flip.value || solo.value || target < 0 || target >= spreads.value.length) return
  hint.value = false
  if (reducedMotion()) {
    index.value = target
    return
  }
  if (!wide.value) {
    startSolo(delta > 0 ? 'next' : 'prev', target)
    finishSolo(true)
    return
  }
  flip.value = { dir: delta > 0 ? 'next' : 'prev', from: current.value, to: spreads.value[target] }
  setTimeout(() => {
    index.value = target
    flip.value = null
  }, FLIP_MS)
}

/* ---------- single page: the turning page ---------- */
function startSolo(dir, target) {
  solo.value = { dir, target, from: current.value[0], to: spreads.value[target][0], p: 0, anim: false }
}

/* Let the page settle — over the spine (commit) or back where it was. */
function finishSolo(commit) {
  const s = solo.value
  if (!s) return
  s.anim = true
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      s.p = commit ? 1 : 0
      setTimeout(() => {
        if (commit) index.value = s.target
        solo.value = null
      }, SOLO_MS)
    })
  )
}

/* Page lying underneath, and the one being turned. */
const soloBase = computed(() => {
  const s = solo.value
  if (!s) return current.value[0]
  return s.dir === 'next' ? s.to : s.from
})
const soloLeaf = computed(() => {
  const s = solo.value
  return s && (s.dir === 'next' ? s.from : s.to)
})
const soloAngle = computed(() => {
  const s = solo.value
  if (!s) return 0
  return s.dir === 'next' ? -180 * s.p : -180 * (1 - s.p)
})
/* Shadow the turning page casts on the one below — strongest mid-turn. */
const soloShade = computed(() => (solo.value ? Math.sin(Math.min(1, solo.value.p) * Math.PI) * 0.45 : 0))
const remaining = computed(() => 1 - index.value / Math.max(1, spreads.value.length - 1))

/* Tap the right half to go on, the left half to go back. */
let justDragged = false
function tapTurn(e) {
  if (justDragged) return
  const r = e.currentTarget.getBoundingClientRect()
  go(e.clientX - r.left > r.width / 2 ? 1 : -1)
}

function jump(e) {
  if (flip.value || solo.value) return
  index.value = Number(e.target.value)
}

/* Keep the reading position when switching between book and single page. */
watch(wide, (isWide, was) => {
  if (isWide === was) return
  const i = index.value
  index.value = isWide ? Math.floor((i + 1) / 2) : Math.max(0, i * 2 - 1)
})

/* Warm the cache for the next and previous spreads. */
watch(
  [index, () => props.item],
  () => {
    if (!props.item) return
    for (const d of [1, 2, -1]) {
      for (const n of spreads.value[index.value + d] || []) if (n) new Image().src = src(n)
    }
  },
  { immediate: true }
)

/* ---------- „turn the phone“ hint ---------- */
const hint = ref(false)
let hintTimer = null
function showHint() {
  clearTimeout(hintTimer)
  hint.value = !wide.value && matchMedia('(pointer: coarse)').matches
  if (hint.value) hintTimer = setTimeout(() => (hint.value = false), 5000)
}
watch(wide, (w) => w && (hint.value = false))

/* ---------- open / close ---------- */
const closeBtn = ref(null)
let lastFocus = null

watch(
  () => props.item,
  (item) => {
    if (item) {
      index.value = 0
      zoom.value = false
      flip.value = null
      solo.value = null
      showHint()
      lastFocus = document.activeElement
      document.documentElement.style.overflow = 'hidden'
      window.addEventListener('keydown', onKey)
      nextTick(() => closeBtn.value?.focus())
    } else {
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', onKey)
      lastFocus?.focus?.()
    }
  }
)

onBeforeUnmount(() => {
  clearTimeout(hintTimer)
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
})

function onKey(e) {
  if (e.key === 'Escape') emit('close')
  else if (e.key === 'ArrowRight' || e.key === 'PageDown') go(1)
  else if (e.key === 'ArrowLeft' || e.key === 'PageUp') go(-1)
  else if (e.key === 'Home') go(-index.value)
  else if (e.key === 'End') go(spreads.value.length - 1 - index.value)
}

/* Touch: on the spread a swipe turns the page; on a single page the page
   itself follows the finger. */
let drag = null
function onPointerDown(e) {
  if (e.pointerType !== 'touch' || zoom.value) return
  justDragged = false
  drag = { x: e.clientX, y: e.clientY, t: performance.now(), w: bookEl.value?.offsetWidth || innerWidth, mode: null }
}
function onPointerMove(e) {
  if (!drag) return
  const dx = e.clientX - drag.x
  if (!drag.mode) {
    if (Math.abs(dx) < 10) return
    if (Math.abs(e.clientY - drag.y) > Math.abs(dx)) {
      drag = null
      return
    }
    justDragged = true
    hint.value = false
    const dir = dx < 0 ? 'next' : 'prev'
    const target = index.value + (dir === 'next' ? 1 : -1)
    const canTurn = !wide.value && !flip.value && !solo.value && !reducedMotion()
    if (canTurn && target >= 0 && target < spreads.value.length) {
      startSolo(dir, target)
      drag.mode = 'page'
      e.currentTarget.setPointerCapture?.(e.pointerId)
    } else {
      drag.mode = 'swipe'
    }
  }
  if (drag.mode === 'page' && solo.value && !solo.value.anim) {
    const s = solo.value
    s.p = Math.min(1, Math.max(0, (s.dir === 'next' ? -dx : dx) / drag.w))
  }
}
function onPointerUp(e) {
  if (!drag) return
  const d = drag
  drag = null
  const dx = e.clientX - d.x
  if (d.mode === 'page' && solo.value) {
    const speed = Math.abs(dx) / Math.max(1, performance.now() - d.t) // px per ms
    finishSolo(e.type !== 'pointercancel' && (solo.value.p > 0.33 || speed > 0.5))
  } else if (d.mode === 'swipe' && Math.abs(dx) > 50) {
    go(dx < 0 ? 1 : -1)
  }
  setTimeout(() => (justDragged = false), 50)
}
</script>

<template>
  <Teleport to="body">
    <Transition name="reader">
      <div
        v-if="item"
        class="reader"
        role="dialog"
        aria-modal="true"
        :aria-label="item.title"
      >
        <!-- toolbar -->
        <header class="bar">
          <div class="bar__title">
            <span class="bar__tag">{{ item.tag }}</span>
            <span class="bar__name">{{ item.title }}</span>
          </div>

          <div class="bar__nav">
            <button type="button" class="ic" :aria-label="labels.prev" :disabled="index === 0" @click="go(-1)">
              <AppIcon name="arrowLeft" :size="20" />
            </button>
            <span class="bar__count">
              <strong>{{ label }}</strong>
              <span>/ {{ item.pages }}</span>
            </span>
            <button
              type="button"
              class="ic"
              :aria-label="labels.next"
              :disabled="index === spreads.length - 1"
              @click="go(1)"
            >
              <AppIcon name="arrowRight" :size="20" />
            </button>
          </div>

          <div class="bar__tools">
            <button
              type="button"
              class="ic ic--hide-sm"
              :aria-label="zoom ? labels.zoomOut : labels.zoomIn"
              :aria-pressed="zoom"
              @click="zoom = !zoom"
            >
              <AppIcon :name="zoom ? 'zoomOut' : 'zoomIn'" :size="20" />
            </button>
            <a class="ic" :href="item.file" :download="item.fileName" :aria-label="labels.download">
              <AppIcon name="download" :size="20" />
            </a>
            <button ref="closeBtn" type="button" class="ic ic--close" :aria-label="labels.close" @click="emit('close')">
              <AppIcon name="close" :size="20" />
            </button>
          </div>
        </header>

        <!-- stage -->
        <div
          class="stage"
          :class="{ 'is-zoom': zoom }"
          @pointerdown="onPointerDown"
          @pointermove="onPointerMove"
          @pointerup="onPointerUp"
          @pointercancel="onPointerUp"
        >
          <div
            ref="bookEl"
            class="book"
            :class="[wide ? 'book--spread' : 'book--single', flip && `is-${flip.dir}`]"
            :style="{ '--shift': `${shift}%` }"
          >
            <template v-if="wide">
              <!-- left page -->
              <div class="page page--left" @click="go(-1)">
                <img v-if="base[0]" :src="src(base[0])" :alt="`${labels.page} ${base[0]}`" draggable="false" />
              </div>
              <!-- right page -->
              <div class="page page--right" @click="go(1)">
                <img v-if="base[1]" :src="src(base[1])" :alt="`${labels.page} ${base[1]}`" draggable="false" />
              </div>

              <!-- the turning leaf -->
              <div v-if="flip" class="leaf" :class="`leaf--${flip.dir}`" aria-hidden="true">
                <div class="leaf__face leaf__face--front">
                  <img
                    v-if="flip.dir === 'next' ? flip.from[1] : flip.from[0]"
                    :src="src(flip.dir === 'next' ? flip.from[1] : flip.from[0])"
                    alt=""
                  />
                </div>
                <div class="leaf__face leaf__face--back">
                  <img
                    v-if="flip.dir === 'next' ? flip.to[0] : flip.to[1]"
                    :src="src(flip.dir === 'next' ? flip.to[0] : flip.to[1])"
                    alt=""
                  />
                </div>
              </div>

              <span v-if="base[0] && base[1]" class="gutter" aria-hidden="true"></span>
            </template>

            <!-- single page, bound on the left like a closed book -->
            <template v-else>
              <span class="stack" :style="{ '--remain': remaining }" aria-hidden="true"></span>
              <div class="page page--solo" @click="tapTurn">
                <img :src="src(soloBase)" :alt="`${labels.page} ${soloBase}`" draggable="false" />
                <span
                  class="solo-shade"
                  :class="{ 'is-anim': solo?.anim }"
                  :style="{ opacity: soloShade }"
                  aria-hidden="true"
                ></span>
              </div>

              <div
                v-if="solo"
                class="leaf leaf--solo"
                :class="{ 'is-anim': solo.anim }"
                :style="{ transform: `rotateY(${soloAngle}deg)` }"
                aria-hidden="true"
              >
                <div class="leaf__face leaf__face--front">
                  <img :src="src(soloLeaf)" alt="" draggable="false" />
                  <span class="leaf__dim" :style="{ opacity: solo.p * 0.55 }"></span>
                </div>
                <div class="leaf__face leaf__face--back leaf__face--paper"></div>
              </div>
            </template>
          </div>

          <!-- large side arrows on desktop -->
          <button
            v-if="wide && index > 0"
            type="button"
            class="edge edge--prev"
            :aria-label="labels.prev"
            @click="go(-1)"
          >
            <AppIcon name="arrowLeft" :size="26" />
          </button>
          <button
            v-if="wide && index < spreads.length - 1"
            type="button"
            class="edge edge--next"
            :aria-label="labels.next"
            @click="go(1)"
          >
            <AppIcon name="arrowRight" :size="26" />
          </button>
        </div>

        <Transition name="hint">
          <p v-if="hint" class="hint" @click="hint = false">
            <AppIcon name="rotate" :size="20" />
            {{ labels.rotate }}
          </p>
        </Transition>

        <!-- scrubber -->
        <footer class="scrub">
          <input
            type="range"
            min="0"
            :max="spreads.length - 1"
            :value="index"
            :aria-label="labels.page"
            :style="{ '--p': `${(index / Math.max(1, spreads.length - 1)) * 100}%` }"
            @input="jump"
          />
        </footer>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.reader {
  --bar-h: 64px;
  --scrub-h: 44px;
  position: fixed;
  inset: 0;
  z-index: 130;
  display: flex;
  flex-direction: column;
  background: radial-gradient(ellipse at 50% 45%, #3a3936 0%, #262523 70%);
  color: #fff;
}

/* ---------- toolbar ---------- */
.bar {
  flex: 0 0 var(--bar-h);
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: var(--sp-4);
  padding: 0 clamp(var(--sp-3), 2vw, var(--sp-6));
  border-bottom: 1px solid rgb(255 255 255 / 0.08);
}

.bar__title {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;
}

.bar__tag {
  font-family: var(--font-heading);
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: #ff6a5c;
}

.bar__name {
  overflow: hidden;
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.bar__nav {
  display: flex;
  align-items: center;
  gap: var(--sp-2);
}

.bar__count {
  min-width: 92px;
  padding: 6px 14px;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.08);
  font-family: var(--font-heading);
  font-size: 0.9rem;
  text-align: center;
  font-variant-numeric: tabular-nums;
}

.bar__count span {
  margin-left: 4px;
  color: rgb(255 255 255 / 0.55);
}

.bar__tools {
  display: flex;
  justify-content: flex-end;
  gap: var(--sp-2);
}

.ic {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: #fff;
  cursor: pointer;
  transition: background-color var(--dur-fast) var(--ease), opacity var(--dur-fast) var(--ease);
}

.ic:hover {
  background: rgb(255 255 255 / 0.12);
}

.ic:disabled {
  opacity: 0.3;
  cursor: default;
  background: transparent;
}

.ic--close {
  background: rgb(255 255 255 / 0.1);
}

.ic--close:hover {
  background: var(--c-accent-600);
}

.ic:focus-visible,
.edge:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 2px;
}

/* ---------- stage ---------- */
.stage {
  position: relative;
  flex: 1 1 auto;
  display: flex;
  overflow: hidden;
  padding: 24px clamp(16px, 5vw, 90px);
  touch-action: pan-y;
  --ph: min(calc(100dvh - var(--bar-h) - var(--scrub-h) - 48px), calc((100vw - 2 * clamp(16px, 5vw, 90px)) / 1.4134));
}

.stage.is-zoom {
  overflow: auto;
  --ph: calc((100dvh - var(--bar-h) - var(--scrub-h) - 48px) * 1.9);
}

.book {
  position: relative;
  margin: auto; /* centres, but still scrolls correctly when zoomed */
  flex: 0 0 auto;
  height: var(--ph);
  perspective: 2600px;
}

.book--spread {
  width: calc(var(--ph) * 1.4134);
  display: grid;
  grid-template-columns: 1fr 1fr;
  transform: translateX(var(--shift));
  transition: transform 0.85s cubic-bezier(0.45, 0, 0.2, 1);
}

.book--single {
  --ph: min(calc(100dvh - var(--bar-h) - var(--scrub-h) - 32px), calc((100vw - 44px) / 0.7067));
  width: calc(var(--ph) * 0.7067);
  perspective: 1700px;
}

.page {
  position: relative;
  height: 100%;
  cursor: pointer;
}

.page img,
.leaf__face img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  user-select: none;
  background: #fff;
}

.page img {
  box-shadow: 0 30px 60px -20px rgb(0 0 0 / 0.6), 0 8px 20px rgb(0 0 0 / 0.25);
}

.page--left img {
  border-radius: 3px 0 0 3px;
}

.page--right img {
  border-radius: 0 3px 3px 0;
}

.page--solo img {
  border-radius: 2px 4px 4px 2px;
}

/* binding along the left edge */
.page--solo::after {
  content: '';
  position: absolute;
  inset: 0 auto 0 0;
  width: 7%;
  pointer-events: none;
  background: linear-gradient(to right, rgb(0 0 0 / 0.3), rgb(0 0 0 / 0.08) 40%, rgb(255 255 255 / 0.12) 60%, transparent);
}

/* unread pages stacked along the fore-edge — thins out as you read */
.stack {
  position: absolute;
  top: 1.2%;
  bottom: 1.2%;
  left: 100%;
  width: calc(2px + var(--remain) * 7px);
  border-radius: 0 3px 3px 0;
  background: repeating-linear-gradient(to right, #f3f1ee 0 1px, #cfcac3 1px 2px);
  box-shadow: 0 16px 30px -12px rgb(0 0 0 / 0.6);
  transition: width 0.4s ease;
}

.solo-shade {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(to right, rgb(0 0 0 / 0.55), rgb(0 0 0 / 0.1) 60%, transparent);
}

.solo-shade.is-anim {
  transition: opacity 0.62s cubic-bezier(0.3, 0.6, 0.2, 1);
}

/* shading where the paper curves into the binding */
.page--left::after,
.page--right::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 14%;
  pointer-events: none;
}

.page--left:has(img)::after {
  right: 0;
  background: linear-gradient(to left, rgb(0 0 0 / 0.22), rgb(0 0 0 / 0.06) 30%, transparent);
}

.page--right:has(img)::after {
  left: 0;
  background: linear-gradient(to right, rgb(0 0 0 / 0.26), rgb(0 0 0 / 0.07) 30%, transparent);
}

.gutter {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 50%;
  width: 1px;
  background: rgb(0 0 0 / 0.18);
  pointer-events: none;
}

/* ---------- the turning leaf ---------- */
.leaf {
  position: absolute;
  top: 0;
  width: 50%;
  height: 100%;
  transform-style: preserve-3d;
  pointer-events: none;
  z-index: 2;
}

.leaf--next {
  left: 50%;
  transform-origin: left center;
  animation: turn-next 0.85s cubic-bezier(0.45, 0, 0.2, 1) forwards;
}

.leaf--prev {
  left: 0;
  transform-origin: right center;
  animation: turn-prev 0.85s cubic-bezier(0.45, 0, 0.2, 1) forwards;
}

.leaf__face {
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  overflow: hidden;
}

.leaf__face--back {
  transform: rotateY(180deg);
}

/* single page: the whole page turns over the left-hand spine */
.leaf--solo {
  left: 0;
  width: 100%;
  transform-origin: left center;
  will-change: transform;
}

.leaf--solo.is-anim {
  transition: transform 0.62s cubic-bezier(0.3, 0.6, 0.2, 1);
}

.leaf--solo .leaf__face::after {
  display: none;
}

.leaf__dim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to left, rgb(0 0 0 / 0.5), rgb(0 0 0 / 0.1));
}

.leaf--solo.is-anim .leaf__dim {
  transition: opacity 0.62s cubic-bezier(0.3, 0.6, 0.2, 1);
}

/* back of the sheet: plain paper catching the light */
.leaf__face--paper {
  background: linear-gradient(to left, #d9d5cf, #f6f4f1 35%, #ebe8e3);
  border-radius: 4px 2px 2px 4px;
}

/* light falling across the paper as it lifts */
.leaf__face::after {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0;
  animation: leaf-shade 0.85s ease-in-out forwards;
}

.leaf--next .leaf__face--front::after,
.leaf--prev .leaf__face--back::after {
  background: linear-gradient(to right, rgb(0 0 0 / 0.25), rgb(255 255 255 / 0.18) 70%, rgb(0 0 0 / 0.1));
}

.leaf--next .leaf__face--back::after,
.leaf--prev .leaf__face--front::after {
  background: linear-gradient(to left, rgb(0 0 0 / 0.25), rgb(255 255 255 / 0.18) 70%, rgb(0 0 0 / 0.1));
}

@keyframes turn-next {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(-180deg);
  }
}

@keyframes turn-prev {
  from {
    transform: rotateY(0deg);
  }
  to {
    transform: rotateY(180deg);
  }
}

@keyframes leaf-shade {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

/* ---------- side arrows ---------- */
.edge {
  position: absolute;
  top: 50%;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  margin-top: -26px;
  border: 0;
  border-radius: 999px;
  background: rgb(255 255 255 / 0.1);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: background-color var(--dur-fast) var(--ease), transform var(--dur-fast) var(--ease);
}

.edge:hover {
  background: var(--c-accent-600);
  transform: scale(1.06);
}

.edge--prev {
  left: clamp(12px, 2vw, 28px);
}

.edge--next {
  right: clamp(12px, 2vw, 28px);
}

.is-zoom .edge {
  position: fixed;
}

/* ---------- scrubber ---------- */
.scrub {
  flex: 0 0 var(--scrub-h);
  display: flex;
  align-items: center;
  padding: 0 clamp(var(--sp-4), 10vw, 220px);
}

.scrub input {
  width: 100%;
  height: 4px;
  appearance: none;
  border-radius: 4px;
  background: linear-gradient(to right, var(--c-accent-600) var(--p), rgb(255 255 255 / 0.15) var(--p));
  cursor: pointer;
}

.scrub input::-webkit-slider-thumb {
  appearance: none;
  width: 16px;
  height: 16px;
  border: 3px solid var(--c-accent-600);
  border-radius: 50%;
  background: #fff;
}

.scrub input::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: 3px solid var(--c-accent-600);
  border-radius: 50%;
  background: #fff;
}

/* ---------- transitions ---------- */
.reader-enter-active,
.reader-leave-active {
  transition: opacity 0.3s ease;
}

.reader-enter-active .book {
  transition: transform 0.5s cubic-bezier(0.2, 0.7, 0.2, 1);
}

.reader-enter-from,
.reader-leave-to {
  opacity: 0;
}

.reader-enter-from .book {
  transform: translateX(var(--shift)) scale(0.94);
}

/* „turn the phone“ hint */
.hint {
  position: absolute;
  left: 50%;
  bottom: calc(var(--scrub-h) + 18px);
  z-index: 3;
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  width: max-content;
  max-width: calc(100vw - 32px);
  padding: 10px 16px;
  border-radius: 999px;
  background: rgb(20 20 19 / 0.85);
  backdrop-filter: blur(8px);
  font-size: 0.85rem;
  color: #fff;
  transform: translateX(-50%);
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.35);
}

.hint :deep(.icon) {
  color: #ff6a5c;
  animation: tilt 2.4s ease-in-out infinite;
}

@keyframes tilt {
  0%,
  30% {
    transform: rotate(0);
  }
  55%,
  85% {
    transform: rotate(-90deg);
  }
  100% {
    transform: rotate(0);
  }
}

.hint-enter-active,
.hint-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.hint-enter-from,
.hint-leave-to {
  opacity: 0;
  transform: translate(-50%, 10px);
}

@media (max-width: 640px) {
  .reader {
    --bar-h: 56px;
  }

  .bar {
    grid-template-columns: 1fr auto;
  }

  .bar__title {
    display: none;
  }

  .bar__nav {
    justify-self: start;
  }

  .ic--hide-sm {
    display: none;
  }

  .stage {
    padding: 16px;
  }
}

/* phone on its side: keep as much height as possible for the spread */
@media (max-height: 500px) {
  .reader {
    --bar-h: 48px;
    --scrub-h: 30px;
  }

  .bar__title {
    display: none;
  }

  .bar {
    grid-template-columns: 1fr auto 1fr;
  }

  .bar__nav {
    grid-column: 2;
  }

  .stage {
    padding: 10px 56px;
  }

  .edge {
    width: 40px;
    height: 40px;
    margin-top: -20px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .book--spread {
    transition: none;
  }
}
</style>
