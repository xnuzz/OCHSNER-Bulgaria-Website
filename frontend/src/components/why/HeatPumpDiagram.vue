<script setup>
/**
 * The manufacturer's refrigerant-cycle animation, localised.
 *
 * The GIF ships with its captions burned into the artwork in German
 * (WÄRMEQUELLE / VERDICHTEN / VERDAMPFEN / VERFLÜSSIGEN / ENTSPANNEN /
 * WÄRMEVERTEILUNG). Only the fluid in the coils animates — every caption is
 * static across all 40 frames — so each one is covered by an absolutely
 * positioned Bulgarian label instead.
 *
 * The regions behind the captions are flat: pure white in the middle of the
 * frame and #cc3300 inside the two boxes, both sampled from the artwork, so the
 * patches are invisible.
 *
 * Coordinates are percentages of the source frame (1100 × 366) and the type is
 * sized in cqw, so the whole overlay scales with the image. Re-encoding the GIF
 * was avoided deliberately: .NET's encoder drops per-frame timing, which would
 * change the playback speed.
 */
import { useI18n } from '@/i18n'

const { why } = useI18n()
const cycle = why.cycle
const a = cycle.animation
</script>

<template>
  <figure class="diagram">
    <div class="diagram__stage">
      <img
        class="diagram__gif"
        src="/images/why/cycle.gif"
        :alt="cycle.diagramTitle"
        width="1100"
        height="366"
        loading="lazy"
        decoding="async"
      />

      <!-- Localised captions, each covering the German beneath it. -->
      <span class="lbl lbl--box lbl--source">{{ a.source }}</span>
      <span class="lbl lbl--box lbl--distribution">{{ a.distribution }}</span>

      <span class="lbl lbl--hint lbl--source-hint">
        <span v-for="line in a.sourceHint" :key="line">{{ line }}</span>
      </span>
      <span class="lbl lbl--hint lbl--distribution-hint">
        <span v-for="line in a.distributionHint" :key="line">{{ line }}</span>
      </span>

      <span class="lbl lbl--step lbl--evaporate">{{ a.evaporate }}</span>
      <span class="lbl lbl--step lbl--compress">{{ a.compress }}</span>
      <span class="lbl lbl--step lbl--condense">{{ a.condense }}</span>
      <span class="lbl lbl--step lbl--expand">{{ a.expand }}</span>
    </div>

    <figcaption class="diagram__caption">{{ cycle.diagramCaption }}</figcaption>
  </figure>
</template>

<style scoped>
.diagram {
  margin: var(--sp-6) 0 0;
}

.diagram__stage {
  position: relative;
  container-type: inline-size;
  max-width: 1100px;
  margin-inline: auto;
}

.diagram__gif {
  display: block;
  width: 100%;
  height: auto;
}

.lbl {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  line-height: 1.1;
  text-align: center;
  white-space: nowrap;
  pointer-events: none;
}

/* --- the two solid boxes ------------------------------------------------ */
.lbl--box {
  background: #cc3300;
  color: #fff;
  font-weight: var(--fw-bold);
  font-size: 1.02cqw;
  letter-spacing: 0.01em;
  top: 38.5%;
  height: 7.6%;
}

.lbl--source {
  left: 3.6%;
  width: 14.2%;
}

.lbl--distribution {
  left: 82.2%;
  width: 13.9%;
}

/* --- grey supporting lines --------------------------------------------- */
.lbl--hint {
  flex-direction: column;
  justify-content: space-evenly;
  background: #fff;
  color: #5a5a5a;
  font-weight: var(--fw-regular);
  font-size: 1.16cqw;
  top: 38.2%;
  height: 23.5%;
}

.lbl--source-hint {
  left: 18.5%;
  width: 7.2%;
}

.lbl--distribution-hint {
  left: 69.9%;
  width: 12.3%;
}

/* --- the four cycle steps ---------------------------------------------- */
.lbl--step {
  background: #fff;
  color: #cc3300;
  font-weight: var(--fw-bold);
  font-size: 1.3cqw;
  height: 6.6%;
}

.lbl--evaporate {
  left: 37.2%;
  width: 9.9%;
  top: 42.6%;
}

.lbl--condense {
  left: 52.9%;
  width: 9.9%;
  top: 42.6%;
}

.lbl--compress {
  left: 45.4%;
  width: 9.2%;
  top: 16.4%;
}

.lbl--expand {
  left: 45.2%;
  width: 9.5%;
  top: 73.7%;
}

.diagram__caption {
  margin-top: var(--sp-4);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
  text-align: center;
}

/*
 * Below ~560px the overlay type would fall under about 7px. The animation is
 * 3:1, so it is already unreadable at that size — the numbered step list under
 * the diagram carries the same explanation, so the graphic is dropped instead
 * of being shown illegibly.
 */
@media (max-width: 560px) {
  .diagram {
    display: none;
  }
}
</style>
