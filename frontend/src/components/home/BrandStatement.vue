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

/* Capped at the h2 size (34px). Nothing below h1 on the corporate site is set
   larger than that; this was running to 44px. */
.statement__title {
  font-size: var(--fs-h2);
  line-height: var(--lh-snug);
  color: var(--c-primary-900);
  margin-inline: auto;
  max-width: 20ch;
}

.statement__text {
  margin-top: var(--sp-5);
  font-size: var(--fs-body);
  color: var(--c-ink);
  margin-inline: auto;
  max-width: 68ch;
}
</style>
