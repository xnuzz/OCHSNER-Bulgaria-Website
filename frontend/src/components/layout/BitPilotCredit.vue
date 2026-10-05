<script setup>
/**
 * Developer credit for BitPilot — "Navigate the Digital Frontier".
 *
 * Built around the navigation idea rather than a generic "made by" line:
 *   - the logo sits in a radar ring that pings,
 *   - the border is a radar beam that sweeps round the card,
 *   - a flight route plots itself from the name to the call to action.
 *
 * At rest it is quiet on purpose: this is the client's site and the credit
 * must never compete with the OCHSNER brand. The motion only plays on
 * hover/focus, and not at all under prefers-reduced-motion.
 *
 * BitPilot's cyan is scoped to this component — it is their brand, not part
 * of the OCHSNER palette.
 */
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  label: { type: String, required: true },
  tagline: { type: String, required: true },
  cta: { type: String, required: true },
  url: { type: String, required: true }
})

/* One path drives both the faint planned route and the bright trail drawn
   over it. pathLength normalises the dash maths to 0-100. */
const route = 'M4 26 C 34 26, 40 8, 66 12 S 108 30, 136 10'
</script>

<template>
  <a class="bp" :href="url" target="_blank" rel="noopener" :aria-label="`${label} BitPilot — ${cta}`">
    <span class="bp__radar" aria-hidden="true">
      <img
        class="bp__logo"
        src="/images/partners/bitpilot.png"
        alt=""
        width="30"
        height="30"
        loading="lazy"
        decoding="async"
      />
    </span>

    <span class="bp__copy">
      <span class="bp__eyebrow">// {{ label }}</span>
      <span class="bp__name">BitPilot</span>
      <span class="bp__tagline">{{ tagline }}</span>
    </span>

    <svg class="bp__route" viewBox="0 0 140 36" fill="none" aria-hidden="true" focusable="false">
      <path class="bp__route-plan" :d="route" pathLength="100" />
      <path class="bp__route-trail" :d="route" pathLength="100" />
      <circle class="bp__route-origin" cx="4" cy="26" r="2.5" />
      <circle class="bp__route-dest" cx="136" cy="10" r="3" />
    </svg>

    <span class="bp__cta">
      {{ cta }}
      <AppIcon name="arrowRight" :size="14" />
    </span>
  </a>
</template>

<style scoped>
/* Lets the border angle be animated — browsers without @property simply show
   the beam at rest, which still looks deliberate. */
@property --bp-angle {
  syntax: '<angle>';
  inherits: false;
  initial-value: 200deg;
}

.bp {
  --bp-accent: oklch(0.78 0.16 195);
  --bp-accent-soft: oklch(0.78 0.16 195 / 0.16);
  --bp-surface: #1d1c1a;

  position: relative;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: var(--sp-4);
  margin-top: var(--sp-5);
  padding: 14px 16px;
  border: 1px solid transparent;
  border-radius: 16px;
  /* Two layers: the card fill clipped to the padding box, and a conic "radar
     beam" clipped to the border box, so only the 1px edge shows the sweep. */
  background:
    linear-gradient(var(--bp-surface), var(--bp-surface)) padding-box,
    conic-gradient(
        from var(--bp-angle),
        rgba(255, 255, 255, 0.07) 0deg,
        rgba(255, 255, 255, 0.07) 250deg,
        var(--bp-accent) 300deg,
        rgba(255, 255, 255, 0.07) 340deg
      )
      border-box;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  overflow: hidden;
  isolation: isolate;
  transition: transform var(--dur) var(--ease);
}

/* Faint grid, like a navigation chart, fading in from the right. */
.bp::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.035) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.035) 1px, transparent 1px);
  background-size: 14px 14px;
  mask-image: linear-gradient(90deg, transparent 20%, #000 85%);
  opacity: 0.6;
  transition: opacity var(--dur-slow) var(--ease);
}

.bp:hover,
.bp:focus-visible {
  animation: bp-sweep 2.4s linear infinite;
}

.bp:hover::before,
.bp:focus-visible::before {
  opacity: 1;
}

.bp:focus-visible {
  outline: 2px solid var(--bp-accent);
  outline-offset: 3px;
}

@keyframes bp-sweep {
  to {
    --bp-angle: 560deg;
  }
}

/* --- Radar + logo ----------------------------------------------------- */
.bp__radar {
  position: relative;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--bp-accent-soft) 0%, transparent 70%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
}

/* The ping: an expanding ring that fades out. */
.bp__radar::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid var(--bp-accent);
  opacity: 0;
}

.bp:hover .bp__radar::after,
.bp:focus-visible .bp__radar::after {
  animation: bp-ping 1.6s var(--ease) infinite;
}

@keyframes bp-ping {
  0% {
    transform: scale(0.8);
    opacity: 0.7;
  }
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}

.bp__logo {
  width: 30px;
  height: 30px;
  border-radius: 8px;
}

/* --- Copy -------------------------------------------------------------- */
.bp__copy {
  display: flex;
  flex-direction: column;
  min-width: 0;
  line-height: 1.25;
}

.bp__eyebrow {
  font-family: 'JetBrains Mono', ui-monospace, 'SFMono-Regular', Consolas, monospace;
  font-size: 0.68rem;
  letter-spacing: 0.04em;
  color: var(--bp-accent);
  opacity: 0.85;
}

.bp__name {
  font-family: var(--font-heading);
  font-size: 1.05rem;
  font-weight: var(--fw-bold);
  letter-spacing: 0.01em;
  /* White into BitPilot cyan. */
  background: linear-gradient(90deg, #fff 40%, var(--bp-accent));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.bp__tagline {
  margin-top: 1px;
  font-size: 0.74rem;
  color: rgba(255, 255, 255, 0.5);
}

/* --- Flight route ------------------------------------------------------ */
.bp__route {
  display: none; /* phones: the card stacks, the route has no room */
  width: 140px;
  height: 36px;
}

.bp__route-plan {
  stroke: rgba(255, 255, 255, 0.18);
  stroke-width: 1.2;
  stroke-dasharray: 2 3;
}

.bp__route-trail {
  stroke: var(--bp-accent);
  stroke-width: 1.6;
  stroke-linecap: round;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  transition: stroke-dashoffset 0.9s var(--ease);
  filter: drop-shadow(0 0 3px var(--bp-accent));
}

.bp__route-origin {
  fill: rgba(255, 255, 255, 0.4);
}

.bp__route-dest {
  fill: var(--bp-surface);
  stroke: rgba(255, 255, 255, 0.35);
  stroke-width: 1.2;
  transition: fill var(--dur) var(--ease) 0.6s, stroke var(--dur) var(--ease) 0.6s;
}

.bp:hover .bp__route-trail,
.bp:focus-visible .bp__route-trail {
  stroke-dashoffset: 0;
}

.bp:hover .bp__route-dest,
.bp:focus-visible .bp__route-dest {
  fill: var(--bp-accent);
  stroke: var(--bp-accent);
}

/* --- CTA --------------------------------------------------------------- */
.bp__cta {
  grid-column: 1 / -1;
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  /* 44px thumb target on phones; trimmed once the card is a single row. */
  min-height: 44px;
  padding: 9px 18px;
  border-radius: 999px;
  border: 1px solid color-mix(in oklch, var(--bp-accent) 45%, transparent);
  color: var(--bp-accent);
  font-size: 0.8rem;
  font-weight: var(--fw-semibold);
  white-space: nowrap;
  transition:
    background-color var(--dur) var(--ease) 0.5s,
    color var(--dur) var(--ease) 0.5s,
    box-shadow var(--dur) var(--ease) 0.5s;
}

/* The CTA lights up as the route reaches it. */
.bp:hover .bp__cta,
.bp:focus-visible .bp__cta {
  background: var(--bp-accent);
  color: #03161a;
  box-shadow: 0 0 18px -4px var(--bp-accent);
}

.bp__cta :deep(.icon) {
  transition: transform var(--dur) var(--ease) 0.5s;
}

.bp:hover .bp__cta :deep(.icon) {
  transform: translateX(3px);
}

/* --- Wider screens: one row, route between name and CTA ----------------- */
@media (min-width: 720px) {
  .bp {
    grid-template-columns: auto auto 1fr auto;
    gap: var(--sp-5);
    padding: 14px 18px;
  }

  .bp__route {
    display: block;
    justify-self: center;
    width: 100%;
    max-width: 220px;
  }

  .bp__cta {
    grid-column: auto;
    justify-self: end;
    min-height: 38px;
    padding: 7px 16px;
  }
}

/* --- Reduced motion: keep the colour change, drop every movement -------- */
@media (prefers-reduced-motion: reduce) {
  .bp:hover,
  .bp:focus-visible {
    animation: none;
  }

  .bp:hover .bp__radar::after,
  .bp:focus-visible .bp__radar::after {
    animation: none;
  }

  .bp__route-trail {
    transition: none;
  }

  .bp:hover .bp__cta :deep(.icon) {
    transform: none;
  }
}
</style>
