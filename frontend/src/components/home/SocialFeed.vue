<script setup>
import { onMounted } from 'vue'
import PlaceholderImage from '@/components/ui/PlaceholderImage.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { fetchSocialPosts, useAsyncData } from '@/api/catalog.js'
import { useI18n } from '@/i18n'

/*
 * Latest Facebook + Instagram posts, from GET /api/v1/social.
 *
 * Each card is styled as the network's own post chrome — Instagram's square
 * image with the action row beneath, Facebook's text-above-image with the
 * reaction bar — so the section reads as a genuine embed rather than a generic
 * card grid.
 *
 * The engagement glyphs are DECORATIVE (aria-hidden): you cannot like or
 * comment from here. The whole card is a single link to the real post, which is
 * where those actions actually live.
 *
 * The endpoint always answers 200, so this only handles "loading", "has posts"
 * and "nothing to show" — never an error state at a visitor.
 */
const { home } = useI18n()
const { data, loading, load } = useAsyncData(() => fetchSocialPosts(6))

const dateFmt = new Intl.DateTimeFormat('bg-BG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
})
const numFmt = new Intl.NumberFormat('bg-BG')

const formatDate = (iso) => {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? '' : dateFmt.format(d)
}

const profileUrl = (network) =>
  network === 'instagram' ? home.social.instagramUrl : home.social.facebookUrl

/* A sample post has no permalink of its own, so it falls back to the profile —
   the card still opens the real account on the real network. */
const postUrl = (post) => post.permalink || profileUrl(post.network)

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
          <a
            class="card"
            :class="`card--${post.network}`"
            :href="postUrl(post)"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="`${home.social.openOn} ${home.social[post.network]}`"
          >
            <!-- Account row -->
            <div class="card__head">
              <span class="card__avatar" aria-hidden="true">O</span>
              <span class="card__who">
                <span class="card__name">
                  {{ post.author || home.social.handle }}
                </span>
                <span v-if="post.network === 'facebook'" class="card__meta">
                  {{ formatDate(post.postedAt) }}
                  <AppIcon name="globe" :size="11" />
                </span>
              </span>
            </div>

            <!-- Facebook puts the copy above the image; Instagram below it. -->
            <p v-if="post.network === 'facebook'" class="card__fbtext">{{ post.text }}</p>

            <div class="card__media">
              <PlaceholderImage
                :src="post.image"
                :label="home.social[post.network]"
                fit="cover"
                inset="0%"
                surface="alt"
                :ratio="post.network === 'instagram' ? '4 / 5' : '1.91 / 1'"
              />
            </div>

            <!-- Instagram: action row, like count, caption -->
            <template v-if="post.network === 'instagram'">
              <div class="ig__actions" aria-hidden="true">
                <AppIcon name="heart" :size="19" />
                <AppIcon name="comment" :size="19" />
                <AppIcon name="share" :size="19" />
                <AppIcon class="ig__save" name="bookmark" :size="19" />
              </div>
              <div class="card__body">
                <p v-if="post.likes != null" class="ig__likes">
                  {{ numFmt.format(post.likes) }} {{ home.social.likes }}
                </p>
                <p class="ig__caption">
                  <span class="card__name">{{ post.author || home.social.handle }}</span>
                  {{ post.text }}
                </p>
                <time class="card__date" :datetime="post.postedAt">
                  {{ formatDate(post.postedAt) }}
                </time>
              </div>
            </template>

            <!-- Facebook: reaction summary, then the action bar -->
            <template v-else>
              <div class="card__body fb__body">
                <div v-if="post.likes != null" class="fb__summary">
                  <span class="fb__thumb" aria-hidden="true">
                    <AppIcon name="thumbsUp" :size="11" />
                  </span>
                  <span>{{ numFmt.format(post.likes) }}</span>
                  <span v-if="post.comments != null" class="fb__comments">
                    {{ numFmt.format(post.comments) }} {{ home.social.comments }}
                  </span>
                </div>
              </div>
            </template>
          </a>
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

/* --- The post card ----------------------------------------------------- */
.card {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: #fff;
  color: var(--c-ink);
  text-decoration: none;
  /* Native post cards are hairline-bordered and gently rounded — the one place
     on this site that departs from the square corporate tile. */
  border: 1px solid #ebebeb;
  border-radius: 10px;
  overflow: hidden;
  transition: box-shadow var(--dur) var(--ease), transform var(--dur) var(--ease);
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.card__head {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
}

.card__avatar {
  display: grid;
  place-items: center;
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--c-accent-600);
  color: #fff;
  font-family: var(--font-heading);
  font-weight: var(--fw-bold);
  font-size: 0.875rem;
  line-height: 1;
}

/* Instagram rings the avatar in its signature gradient. */
.card--instagram .card__avatar {
  box-shadow: 0 0 0 2px #fff, 0 0 0 3px #dc2743;
  margin: 2px;
}

.card__who {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.card__name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card__meta {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #65676b;
}


.card__media {
  background: #fafafa;
}

.card__body {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 0 12px 12px;
}

.card__date {
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: #8e8e8e;
}

/* --- Instagram chrome --------------------------------------------------- */
.ig__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px 5px;
  color: #3a3a3a;
}

.ig__save {
  margin-left: auto;
}

.ig__likes {
  font-size: 0.875rem;
  font-weight: 600;
  color: #262626;
}

.ig__caption {
  font-size: 0.875rem;
  line-height: 1.45;
  color: #262626;
  /*
   * Clamp to exactly three lines. -webkit-line-clamp is not used: the build
   * normalises `display: -webkit-box` to `flow-root`, which silently disables
   * it and leaves a half-line sliver showing. An exact line multiple cuts
   * cleanly whatever the build does to the display value.
   */
  max-height: 4.35em; /* 3 x 1.45 */
  overflow: hidden;
}

.ig__caption .card__name {
  margin-right: 5px;
}

/* --- Facebook chrome ---------------------------------------------------- */
.card__fbtext {
  /* See .ig__caption — exact line multiple rather than -webkit-line-clamp. */
  margin: 0 12px 10px;
  font-size: 0.9375rem;
  line-height: 1.4;
  color: #050505;
  max-height: 4.2em; /* 3 x 1.4 */
  overflow: hidden;
}

.fb__body {
  gap: 0;
  padding: 0 12px 10px;
  /* Cards in a row stretch to equal height; keep the reaction bar at the
     bottom edge instead of leaving it floating mid-card. */
  margin-top: auto;
}

.fb__summary {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 9px 0 0;
  border-top: 1px solid #f0f0f0;
  font-size: 0.78rem;
  color: #8a8d91;
}

.fb__thumb {
  display: grid;
  place-items: center;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #1877f2;
  color: #fff;
}

.fb__comments {
  margin-left: auto;
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
