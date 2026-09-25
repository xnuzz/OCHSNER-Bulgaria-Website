/*
 * The six LATEST posts from the official OCHSNER Instagram
 * (@ochsnerwaermepumpen), used with the manufacturer's permission.
 *
 * Newest first, exactly the order they appear on the profile — nothing is
 * cherry-picked. Each `image` is the post's real photo at full size
 * (1080 x 1350, the 4:5 Instagram uses), saved locally. `url` opens the
 * original post.
 *
 * Captions are the manufacturer's own, translated from German for this
 * audience; the substance is unchanged and the card links back to the source.
 *
 * WHY THE CONTENT IS STORED RATHER THAN FETCHED
 * ---------------------------------------------
 * Instagram serves a login wall to unauthenticated servers, and reading another
 * company's account through the Graph API needs an Instagram Business account
 * of our own. So these were collected once, by hand. Refreshing = replacing
 * these entries with the newest posts.
 *
 * Images are local on purpose: Instagram CDN links are signed and expire within
 * days, so hotlinking would break the feed.
 *
 * TO REFRESH
 *   1. Save each new post's photo into frontend/public/images/social/
 *   2. Copy its caption and permalink
 *   3. Replace the entries below, newest first
 *
 * Fields: url (required), text, image, date, likes, comments, author.
 * Supplying both `text` and `image` skips the network lookup entirely.
 */
export const curatedPosts = [
  {
    url: 'https://www.instagram.com/ochsnerwaermepumpen/p/DdavsV9F6_J/',
    image: '/images/social/ig-1-pv-fronius.jpg',
    author: 'ochsnerwaermepumpen',
    date: '2026-09-17',
    likes: 33,
    comments: 0,
    text:
      'С фотоволтаична инсталация и термопомпа OCHSNER можете да покриете голяма част ' +
      'от нуждата си от отопление, охлаждане и топла вода със собствен слънчев ток ☀️. ' +
      'За да работи това особено ефективно, инверторът, енергийният мениджмънт и ' +
      'термопомпата трябва да общуват помежду си.'
  },
  {
    url: 'https://www.instagram.com/ochsnerwaermepumpen/p/DdYfr6YF9OW/',
    image: '/images/social/ig-2-krakow.jpg',
    author: 'ochsnerwaermepumpen',
    date: '2026-09-17',
    likes: 38,
    comments: 0,
    text:
      'Пълна зала в Краков 🇵🇱 В началото на септември нашите полски системни партньори ' +
      'се събраха и интересът беше огромен 😀. Във фокуса бяха новите ни продукти и ' +
      'услуги, както и актуалните технически разработки.'
  },
  {
    url: 'https://www.instagram.com/ochsnerwaermepumpen/p/DdUGdsHl9Lv/',
    image: '/images/social/ig-3-air-hawk-518.jpg',
    author: 'ochsnerwaermepumpen',
    date: '2026-09-15',
    likes: 39,
    comments: 0,
    text:
      'Два апартамента под един покрив: единият с подово отопление, другият с радиатори. ' +
      'И двата се отопляват от една OCHSNER AIR HAWK 518. Отоплението и топлата вода ' +
      'минават през UNIFRESH 800 — комбиниран съд за топла вода и буфер.'
  },
  {
    url: 'https://www.instagram.com/ochsnerwaermepumpen/p/Dc07znkFbGl/',
    image: '/images/social/ig-4-metabolon.jpg',
    author: 'ochsnerwaermepumpen',
    date: '2026-09-03',
    likes: 26,
    comments: 0,
    text:
      'В енергийния и ресурсен център :metabolon OCHSNER показва своите високотехнологични ' +
      'термопомпи в постоянната експозиция. От моноблок до сплит изпълнение — всички на ' +
      'живо на място, всеки ден.'
  },
  {
    url: 'https://www.instagram.com/ochsnerwaermepumpen/p/Dcx-uf3lfIz/',
    image: '/images/social/ig-5-neuhofer.jpg',
    author: 'ochsnerwaermepumpen',
    date: '2026-09-02',
    likes: 31,
    comments: 0,
    text:
      '30 години Installationstechnik Neuhofer. Честито! 🎂 През уикенда нашият системен ' +
      'партньор отпразнува двоен юбилей — 30 години история и откриването на новия си ' +
      'шоурум, където посетителите видяха част от продуктовата ни гама на живо.'
  },
  {
    url: 'https://www.instagram.com/ochsnerwaermepumpen/p/Dcp7mA5lah_/',
    image: '/images/social/ig-6-air-eagle-retrofit.jpg',
    author: 'ochsnerwaermepumpen',
    date: '2026-08-30',
    likes: 63,
    comments: 1,
    text:
      'Навън 40 kW газов котел, вътре AIR EAGLE 1830: многофамилна сграда с шест жилища ' +
      'вече се отоплява с термопомпа вместо с газ. Моноблок термопомпа с температури на ' +
      'подаване до 70 °C поема отоплението и топлата вода.'
  }
]
