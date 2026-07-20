<script setup>
import { useI18n } from '@/i18n'

const { why } = useI18n()
const cycle = why.cycle
</script>

<template>
  <figure class="diagram">
    <!--
      Hand-built SVG rather than an exported image: it scales without artefacts,
      inherits the design tokens, weighs ~2 KB and stays readable to screen readers
      through the caption and the step list beneath it.
    -->
    <svg
      class="diagram__svg"
      viewBox="0 0 720 360"
      role="img"
      :aria-label="cycle.diagramTitle"
      preserveAspectRatio="xMidYMid meet"
    >
      <title>{{ cycle.diagramTitle }}</title>

      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="var(--c-primary-500)" />
        </marker>
      </defs>

      <!-- Source side -->
      <rect x="4" y="120" width="136" height="120" rx="10" fill="var(--c-primary-50)" stroke="var(--c-primary-300)" />
      <text x="72" y="168" class="d-label" text-anchor="middle">{{ cycle.sourceLabel }}</text>
      <text x="72" y="192" class="d-hint" text-anchor="middle">{{ cycle.sourceHint }}</text>

      <!-- Building side -->
      <rect x="580" y="120" width="136" height="120" rx="10" fill="var(--c-accent-100)" stroke="var(--c-accent-500)" />
      <text x="648" y="168" class="d-label" text-anchor="middle">{{ cycle.buildingLabel }}</text>
      <text x="648" y="192" class="d-hint" text-anchor="middle">{{ cycle.buildingHint }}</text>

      <!-- Refrigerant loop -->
      <rect
        x="180"
        y="70"
        width="360"
        height="220"
        rx="18"
        fill="none"
        stroke="var(--c-primary-300)"
        stroke-width="2"
        stroke-dasharray="6 6"
      />

      <!-- 1. Evaporator (left of loop) -->
      <g>
        <rect x="150" y="150" width="60" height="60" rx="8" fill="var(--c-primary-700)" />
        <text x="180" y="186" class="d-num" text-anchor="middle">1</text>
        <text x="180" y="232" class="d-step" text-anchor="middle">{{ cycle.steps[0].title }}</text>
      </g>

      <!-- 2. Compressor (top) -->
      <g>
        <rect x="330" y="40" width="60" height="60" rx="8" fill="var(--c-primary-700)" />
        <text x="360" y="76" class="d-num" text-anchor="middle">2</text>
        <text x="360" y="24" class="d-step" text-anchor="middle">{{ cycle.steps[1].title }}</text>
      </g>

      <!-- 3. Condenser (right of loop) -->
      <g>
        <rect x="510" y="150" width="60" height="60" rx="8" fill="var(--c-accent-600)" />
        <text x="540" y="186" class="d-num" text-anchor="middle">3</text>
        <text x="540" y="232" class="d-step" text-anchor="middle">{{ cycle.steps[2].title }}</text>
      </g>

      <!-- 4. Expansion valve (bottom) -->
      <g>
        <rect x="330" y="260" width="60" height="60" rx="8" fill="var(--c-primary-700)" />
        <text x="360" y="296" class="d-num" text-anchor="middle">4</text>
        <text x="360" y="342" class="d-step" text-anchor="middle">{{ cycle.steps[3].title }}</text>
      </g>

      <!-- Heat in / heat out -->
      <line x1="142" y1="180" x2="148" y2="180" stroke="var(--c-primary-500)" stroke-width="3" marker-end="url(#arrow)" />
      <line x1="572" y1="180" x2="578" y2="180" stroke="var(--c-accent-600)" stroke-width="3" marker-end="url(#arrow)" />

      <!-- Electricity into the compressor -->
      <line x1="360" y1="8" x2="360" y2="36" stroke="var(--c-accent-600)" stroke-width="3" marker-end="url(#arrow)" />
      <text x="374" y="16" class="d-hint" text-anchor="start">{{ cycle.powerLabel }}</text>
    </svg>

    <figcaption class="diagram__caption">{{ cycle.diagramCaption }}</figcaption>
  </figure>
</template>

<style scoped>
.diagram {
  margin: 0;
  padding: var(--sp-5);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-lg);
  overflow-x: auto;
}

.diagram__svg {
  width: 100%;
  min-width: 560px;
  height: auto;
}

.diagram__caption {
  margin-top: var(--sp-4);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
  max-width: 70ch;
}

/* SVG text styling lives here so it follows the design tokens. */
:deep(.d-label) {
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 600;
  fill: var(--c-primary-800);
}

:deep(.d-hint) {
  font-family: var(--font-body);
  font-size: 11px;
  fill: var(--c-ink-muted);
}

:deep(.d-step) {
  font-family: var(--font-heading);
  font-size: 13px;
  font-weight: 600;
  fill: var(--c-ink);
}

:deep(.d-num) {
  font-family: var(--font-heading);
  font-size: 20px;
  font-weight: 700;
  fill: #fff;
}
</style>
