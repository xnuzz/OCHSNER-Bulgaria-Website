<script setup>
/** „Сайт от BitPilot“ credit — the mark takes off on hover. */
import { useI18n } from '@/i18n'

const { footer } = useI18n()
const t = footer.credit
</script>

<template>
  <a class="credit" :href="t.href" target="_blank" rel="noopener">
    {{ t.by }}
    <span class="credit__mark" aria-hidden="true">
      <img src="/images/bitpilot.png" alt="" width="18" height="18" />
    </span>
    <strong>BitPilot</strong>
  </a>
</template>

<style scoped>
.credit {
  justify-self: start;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 0;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
}

.credit strong {
  font-weight: var(--fw-bold);
  color: #fff;
  background: linear-gradient(currentColor, currentColor) 0 100% / 0 1px no-repeat;
  transition: background-size 0.3s var(--ease);
}

.credit:hover strong {
  background-size: 100% 1px;
}

.credit:focus-visible {
  outline: 2px solid #fff;
  outline-offset: 4px;
  border-radius: 4px;
}

/* the mark takes off up-right and lands again from below-left */
.credit__mark {
  display: inline-grid;
  width: 18px;
  height: 18px;
  overflow: hidden;
}

.credit__mark img {
  display: block;
}

.credit:hover .credit__mark img {
  animation: takeoff 0.7s cubic-bezier(0.5, 0, 0.3, 1);
}

@keyframes takeoff {
  45% {
    transform: translate(18px, -18px);
  }
  46% {
    transform: translate(-18px, 18px);
  }
  100% {
    transform: none;
  }
}

@media (min-width: 1000px) {
  .credit {
    justify-self: end;
  }
}

@media (prefers-reduced-motion: reduce) {
  .credit:hover .credit__mark img {
    animation: none;
  }
}
</style>
