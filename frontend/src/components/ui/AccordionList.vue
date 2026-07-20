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
          <span>{{ item.title }}</span>
          <span class="accordion__icon" :class="{ 'accordion__icon--open': isOpen(index) }">
            <AppIcon name="chevron" :size="18" />
          </span>
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
.accordion__item {
  border-bottom: 1px solid var(--c-line);
}

.accordion__item:first-child {
  border-top: 1px solid var(--c-line);
}

.accordion__heading {
  margin: 0;
  font-size: inherit;
}

.accordion__button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sp-4);
  width: 100%;
  padding: var(--sp-5) 0;
  background: transparent;
  border: 0;
  text-align: left;
  cursor: pointer;
  font-family: var(--font-heading);
  font-size: 1.0625rem;
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
  transition: color var(--dur-fast) var(--ease);
}

.accordion__button:hover {
  color: var(--c-accent-600);
}

.accordion__icon {
  flex-shrink: 0;
  display: grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--c-accent-600);
  color: #fff;
  transition: transform var(--dur) var(--ease);
}

.accordion__icon--open {
  transform: rotate(180deg);
}

.accordion__panel {
  padding-bottom: var(--sp-5);
  color: var(--c-ink-soft);
  max-width: 76ch;
}

.accordion__panel[hidden] {
  display: none;
}
</style>
