<script setup>
/*
 * Renders any of the long-form legal documents (privacy, terms, cookies) from
 * the shared `legal` bundle. The route decides which one via the `doc` prop.
 */
import { computed, ref, watch } from 'vue'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'
import PageHero from '@/components/ui/PageHero.vue'

const props = defineProps({
  /* Key into the legal bundle: 'privacy' | 'terms' | 'cookies'. */
  doc: { type: String, required: true },
  /* The document's own path, for canonical SEO. */
  path: { type: String, required: true }
})

const { legal } = useI18n()
const content = computed(() => legal[props.doc])
const page = ref(null)

function applySeo() {
  useSeo({
    title: content.value.meta.title,
    description: content.value.meta.description,
    path: props.path
  })
}
applySeo()
watch(() => props.doc, applySeo)
</script>

<template>
  <div ref="page">
    <PageHero :title="content.title" />

    <section class="section">
      <div class="container container--narrow legal">
        <p class="legal__updated">{{ content.updated }}</p>

        <p v-for="paragraph in content.intro" :key="paragraph" class="legal__lead">
          {{ paragraph }}
        </p>

        <section v-for="block in content.sections" :key="block.heading" class="legal__block">
          <h2 class="legal__heading">{{ block.heading }}</h2>
          <p v-for="paragraph in block.body" :key="paragraph" class="legal__text">
            {{ paragraph }}
          </p>
          <ul v-if="block.list" class="legal__list">
            <li v-for="item in block.list" :key="item">{{ item }}</li>
          </ul>
        </section>
      </div>
    </section>
  </div>
</template>

<style scoped>
.legal {
  max-width: 820px;
}

.legal__updated {
  font-size: var(--fs-small);
  color: var(--c-ink-soft);
}

.legal__lead {
  margin-top: var(--sp-4);
  font-size: 1.125rem;
  line-height: var(--lh-body);
  color: var(--c-ink);
}

.legal__block {
  margin-top: var(--sp-7);
}

.legal__heading {
  font-size: var(--fs-h3);
  font-weight: var(--fw-bold);
  line-height: 1.3;
  color: var(--c-primary-900);
}

.legal__text {
  margin-top: var(--sp-4);
  line-height: var(--lh-body);
  color: var(--c-ink-soft);
}

.legal__list {
  margin-top: var(--sp-4);
  padding-left: 1.25rem;
  display: grid;
  gap: var(--sp-3);
  line-height: var(--lh-body);
  color: var(--c-ink-soft);
}

.legal__list li {
  padding-left: var(--sp-2);
}
</style>
