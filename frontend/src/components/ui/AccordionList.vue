<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

/**
 * Accessible disclosure list — the corporate site presents "Why OCHSNER" as a
 * collapsed FAQ rather than a tile grid.
 *
 * Panels are rendered in the DOM at all times so the copy stays available to
 * search engines; closed ones collapse to zero height and visibility: hidden,
 * which also keeps them out of the tab order and the accessibility tree.
 */
const props = defineProps({
  items: { type: Array, required: true },
  /** Index of the panel open on first render; -1 opens none. */
  defaultOpen: { type: Number, default: 0 }
})

// One panel open at a time; -1 means all closed.
const open = ref(props.defaultOpen)

const isOpen = (index) => open.value === index

function toggle(index) {
  open.value = isOpen(index) ? -1 : index
}
</script>

<template>
  <div class="accordion">
    <div
      v-for="(item, index) in items"
      :key="item.title"
      class="accordion__item"
      :class="{ 'accordion__item--open': isOpen(index) }"
    >
      <h3 class="accordion__heading">
        <button
          type="button"
          class="accordion__button"
          :aria-expanded="isOpen(index)"
          :aria-controls="`panel-${index}`"
          :id="`accordion-button-${index}`"
          @click="toggle(index)"
        >
          <span class="accordion__icon">
            <AppIcon name="plus" :size="20" />
          </span>
          <span>{{ item.title }}</span>
        </button>
      </h3>
      <div
        :id="`panel-${index}`"
        class="accordion__panel"
        role="region"
        :aria-labelledby="`accordion-button-${index}`"
      >
        <div class="accordion__body">
          <p>{{ item.text }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * The reference's FAQ: each question a white card (12px radius, soft shadow)
 * with a circled plus on the left that turns into a cross when open. The open
 * card is marked in OCHSNER red — a filled icon and an accent bar on its edge.
 */
.accordion__item {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
  transition: box-shadow var(--dur) var(--ease);
}

.accordion__item--open {
  box-shadow:
    inset 4px 0 0 var(--c-accent-600),
    0 6px 20px rgba(0, 0, 0, 0.1);
}

.accordion__item:last-child {
  margin-bottom: 0;
}

.accordion__heading {
  margin: 0;
  font-size: inherit;
}

.accordion__button {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  padding: 24px 16px 24px 64px;
  background: transparent;
  border: 0;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-heading);
  font-size: 1.0625rem;
  font-weight: var(--fw-medium);
  line-height: var(--lh-body);
  color: var(--c-ink);
  transition: color var(--dur-fast) var(--ease);
}

.accordion__button:hover,
.accordion__button[aria-expanded='true'] {
  color: var(--c-accent-700);
}

.accordion__icon {
  position: absolute;
  left: 16px;
  top: 50%;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  transform: translateY(-50%);
  transition:
    transform var(--dur-slow) var(--ease),
    background-color var(--dur) var(--ease),
    border-color var(--dur) var(--ease),
    color var(--dur) var(--ease);
}

.accordion__item--open .accordion__icon {
  background: var(--c-accent-600);
  border-color: var(--c-accent-600);
  color: var(--c-surface);
  transform: translateY(-50%) rotate(45deg);
}

/*
 * The answer sits in the question's text column (same left inset as the
 * button), pulled up into the button's bottom padding and opened by a hairline
 * that fades from the accent red into the neutral line.
 *
 * Height animates both ways by transitioning the grid row between 0fr and 1fr;
 * vertical padding therefore lives inside .accordion__body, never on the panel.
 * visibility flips at the end of the close so the text fades out first.
 */
.accordion__panel {
  display: grid;
  grid-template-rows: 0fr;
  padding: 0 16px 0 64px;
  visibility: hidden;
  transition:
    grid-template-rows var(--dur-slow) var(--ease),
    margin-top var(--dur-slow) var(--ease),
    visibility 0s linear var(--dur-slow);
}

.accordion__item--open .accordion__panel {
  grid-template-rows: 1fr;
  margin-top: -8px;
  visibility: visible;
  transition-delay: 0s;
}

.accordion__body {
  min-height: 0;
  overflow: hidden;
  opacity: 0;
  transform: translateY(-8px);
  transition:
    opacity var(--dur) var(--ease),
    transform var(--dur-slow) var(--ease);
}

.accordion__item--open .accordion__body {
  opacity: 1;
  transform: none;
  transition-delay: 80ms, 0s;
}

.accordion__body::before {
  content: '';
  display: block;
  height: 1px;
  margin-bottom: var(--sp-4);
  background: linear-gradient(90deg, var(--c-accent-300), var(--c-line) 45%);
}

.accordion__body p {
  max-width: 72ch;
  margin: 0;
  padding-bottom: 24px;
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  color: var(--c-primary-700);
}

@media (min-width: 720px) {
  .accordion__button {
    padding: 40px 24px 40px 80px;
    font-size: 1.25rem;
  }

  .accordion__icon {
    left: 20px;
    width: 40px;
    height: 40px;
  }

  .accordion__panel {
    padding: 0 24px 0 80px;
  }

  .accordion__item--open .accordion__panel {
    margin-top: -16px;
  }

  .accordion__body::before {
    margin-bottom: var(--sp-5);
  }

  .accordion__body p {
    padding-bottom: 32px;
  }
}
</style>
