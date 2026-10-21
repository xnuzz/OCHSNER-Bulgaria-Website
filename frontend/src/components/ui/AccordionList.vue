<script setup>
import { ref } from 'vue'
import AppIcon from './AppIcon.vue'

/**
 * Accessible disclosure list — the corporate site presents "Why OCHSNER" as a
 * collapsed FAQ rather than a tile grid.
 *
 * Panels are rendered in the DOM at all times and hidden with [hidden] so the
 * copy stays available to search engines and to find-in-page.
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
    <div v-for="(item, index) in items" :key="item.title" class="accordion__item">
      <h3 class="accordion__heading">
        <button
          type="button"
          class="accordion__button"
          :aria-expanded="isOpen(index)"
          :aria-controls="`panel-${index}`"
          :id="`accordion-button-${index}`"
          @click="toggle(index)"
        >
          <span class="accordion__icon" :class="{ 'accordion__icon--open': isOpen(index) }">
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
        :hidden="!isOpen(index)"
      >
        <p>{{ item.text }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/*
 * The reference's FAQ: each question a white card (12px radius, soft shadow)
 * with a circled plus on the left that turns into a cross when open.
 */
.accordion__item {
  margin-bottom: 16px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
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
  transition: transform var(--dur) var(--ease);
}

.accordion__icon--open {
  transform: translateY(-50%) rotate(45deg);
}

.accordion__panel {
  padding: 0 24px 20px;
  font-size: 0.9rem;
  color: var(--c-primary-700);
}

.accordion__panel[hidden] {
  display: none;
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
}
</style>
