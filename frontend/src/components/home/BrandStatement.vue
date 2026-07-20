<script setup>
/**
 * Full-width brand statement band: one large centred headline followed by a
 * short editorial paragraph pair. Matches the corporate mission block.
 */
defineProps({
  title: { type: String, required: true },
  body: { type: Array, required: true }
})
</script>

<template>
  <section class="statement">
    <div class="container container--narrow statement__inner">
      <h2 class="statement__title">{{ title }}</h2>
      <p v-for="paragraph in body" :key="paragraph" class="statement__text">
        {{ paragraph }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.statement {
  padding-block: var(--section-y);
}

.statement__inner {
  text-align: center;
}

.statement__title {
  font-size: clamp(1.6rem, 1.2rem + 2.2vw, 2.75rem);
  color: var(--c-primary-900);
  margin-inline: auto;
  max-width: 20ch;
}

.statement__text {
  margin-top: var(--sp-5);
  font-size: var(--fs-lead);
  color: var(--c-ink-soft);
  margin-inline: auto;
  max-width: 68ch;
}
</style>
