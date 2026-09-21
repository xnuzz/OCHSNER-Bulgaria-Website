<script setup>
import { onMounted } from 'vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { fetchSocialPosts, useAsyncData } from '@/api/catalog.js'
import { useI18n } from '@/i18n'

/*
 * Latest Facebook + Instagram posts, from GET /api/v1/social.
 *
 * The endpoint always answers 200 — a network outage or a missing token yields
 * an empty list rather than an error — so this component only has to handle
 * "loading", "has posts" and "nothing to show". It never renders a failure at
 * a visitor.
 */
const { home } = useI18n()
const { data, loading, load } = useAsyncData(() => fetchSocialPosts(6))

const dateFmt = new Intl.DateTimeFormat('bg-BG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})

const formatDate = (iso) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : dateFmt.format(d)
}

onMounted(load)
</script>

<template>
  <section class="section section--alt social">
    <div class="container">
      <header class="social__head">
        <div>
          <h2 class="social__title">{{ home.social.title }}</h2>
          <p class="social__subtitle">{{ home.social.subtitle }}</p>
        </div>

        <div class="social__follow">
          <a
            v-if="home.social.facebookUrl"
            class="social__follow-link"
            :href="home.social.facebookUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppIcon name="facebook" :size="18" />
            <span>{{ home.social.facebook }}</span>
          </a>
          <a
            v-if="home.social.instagramUrl"
            class="social__follow-link"
            :href="home.social.instagramUrl"
            target="_blank"
            rel="noopener noreferrer"
          >
            <AppIcon name="instagram" :size="18" />
            <span>{{ home.social.instagram }}</span>
          </a>
        </div>
      </header>

      <!-- Sample content is labelled outright, so it can never read as real
           activity from the client's accounts. -->
      <p v-if="data && data.demo" class="social__demo">
        {{ home.social.demoNotice }}
      </p>

      <p v-if="loading" class="social__state">{{ home.social.loading }}</p>

      <p v-else-if="!data || !data.posts.length" class="social__state">
        {{ home.social.empty }}
      </p>

      <ul v-else class="social__grid">
        <li v-for="post in data.posts" :key="post.id" class="post">
          <component
            :is="post.permalink ? 'a' : 'div'"
            class="post__inner"
            v-bind="
              post.permalink
                ? { href: post.permalink, target: '_blank', rel: 'noopener noreferrer' }
                : {}
            "
          >
            <div class="post__media">
              <PlaceholderImage
                :src="post.image"
                :label="home.social[post.network]"
                fit="cover"
                inset="0%"
                surface="alt"
                ratio="4 / 3"
              />
              <span
                class="post__badge"
                :class="`post__badge--${post.network}`"
                role="img"
                :aria-label="home.social[post.network]"
              >
                <AppIcon :name="post.network" :size="16" />
              </span>
            </div>

            <div class="post__body">
              <time class="post__date" :datetime="post.postedAt">
                {{ formatDate(post.postedAt) }}
              </time>
              <p class="post__text">{{ post.text }}</p>
              <span v-if="post.permalink" class="post__cta">
                {{ home.social.viewPost }}
                <AppIcon name="arrowRight" :size="15" />
              </span>
            </div>
          </component>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.social__head {
  display: flex;
  flex-direction: column;
  gap: var(--sp-4);
  margin-bottom: var(--sp-6);
}

.social__title {
  font-size: var(--fs-h2);
  line-height: var(--lh-snug);
  color: var(--c-primary-900);
}

.social__subtitle {
  margin-top: var(--sp-3);
  color: var(--c-ink);
  max-width: 64ch;
}

.social__follow {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sp-3);
}

.social__follow-link {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  min-height: 44px;
  padding: 10px 18px;
  border: 1px solid var(--c-line);
  background: var(--c-surface);
  border-radius: var(--radius-pill);
  font-size: 0.875rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  color: var(--c-primary-900);
  text-decoration: none;
  transition: background-color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}

.social__follow-link:hover {
  background: var(--c-accent-600);
  border-color: var(--c-accent-600);
  color: #fff;
}

.social__demo {
  margin-bottom: var(--sp-5);
  padding: var(--sp-3) var(--sp-4);
  border-left: 3px solid var(--c-accent-600);
  background: var(--c-surface);
  font-size: var(--fs-small);
  color: var(--c-ink-muted);
}

.social__state {
  padding: var(--sp-5) 0;
  color: var(--c-ink-muted);
}

.social__grid {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  gap: var(--sp-4);
}

.post {
  display: flex;
}

.post__inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: var(--c-surface);
  color: inherit;
  text-decoration: none;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease);
}

a.post__inner:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow);
}

.post__media {
  position: relative;
  overflow: hidden;
}

.post__badge {
  position: absolute;
  top: var(--sp-3);
  left: var(--sp-3);
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  color: #fff;
  /* Both brand colours are dark enough for white glyphs at this size. */
  background: var(--c-primary-900);
}

.post__badge--facebook {
  background: #1877f2;
}

.post__badge--instagram {
  background: linear-gradient(45deg, #f09433, #dc2743 50%, #bc1888);
}

.post__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  gap: var(--sp-2);
  padding: var(--sp-5);
}

.post__date {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--c-ink-muted);
}

.post__text {
  flex: 1;
  font-size: 0.9375rem;
  color: var(--c-ink);
}

.post__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  margin-top: var(--sp-2);
  font-size: 0.8125rem;
  font-weight: var(--fw-bold);
  text-transform: uppercase;
  color: var(--c-accent-600);
}

@media (min-width: 640px) {
  .social__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .social__head {
    flex-direction: row;
    align-items: flex-end;
    justify-content: space-between;
  }

  .social__grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
