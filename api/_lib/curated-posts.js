/*
 * Hand-picked real posts.
 *
 * Paste the permalink of any public Instagram or Facebook post here and the
 * feed will render it for real: the server reads the post's Open Graph tags —
 * the same publicly-served metadata every link preview uses — to pull the
 * image, caption and account name. No access token, nothing scraped from a
 * feed, nothing that breaks Meta's terms.
 *
 * Format of each entry:
 *   url   required — the post permalink
 *   text  optional — overrides the caption pulled from og:description, which
 *                    Meta sometimes truncates or pads with follower counts
 *   image optional — overrides og:image. Worth setting for anything long-lived:
 *                    Meta's CDN URLs are signed and eventually expire, so a
 *                    local copy under /public/images/social/ is more durable
 *   date  optional — ISO date; ordering falls back to this list's order
 *
 * Instagram post URLs look like https://www.instagram.com/p/XXXXXXXXXXX/
 * Facebook post URLs look like  https://www.facebook.com/<page>/posts/XXXXXXXX
 *
 * Leave the array empty to fall back to the labelled sample posts.
 */
export const curatedPosts = [
  // { url: 'https://www.instagram.com/p/XXXXXXXXXXX/' },
  // { url: 'https://www.facebook.com/ochsnerwaermepumpen/posts/XXXXXXXXXX' },
]
