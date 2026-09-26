/*
 * „Център за изтегляне“ page.
 *
 * Two parts:
 *   1. The Bulgarian brochures, hosted on our own site and readable in the
 *      book viewer (data in home.js → brochures, shared with the home page).
 *   2. Technical documentation — data sheets, manuals, certificates — lives in
 *      OCHSNER Austria's download centre; every link there goes through the
 *      redirect notice.
 */
export const download = {
  meta: {
    title: 'Център за изтегляне | OCHSNER България',
    description:
      'Брошури на OCHSNER на български за разглеждане и изтегляне, и връзка към техническите документи в центъра за изтегляне на OCHSNER Австрия.'
  },
  hero: {
    eyebrow: 'Документи',
    title: 'Център за изтегляне',
    subtitle:
      'Брошурите на OCHSNER на български — за разглеждане онлайн или изтегляне. Техническите документи се поддържат от производителя в Австрия.'
  },

  brochures: {
    strong: 'Брошури',
    light: 'на български',
    intro: 'Отворете брошурата като книга или я изтеглете като PDF.'
  },

  /* Redirect to OCHSNER Austria for the full technical archive. */
  technical: {
    eyebrow: 'OCHSNER Австрия',
    strong: 'Технически',
    light: 'документи',
    text: 'Технически листове, схеми и инструкции за всички модели се поддържат актуални директно от производителя. Ще ви пренасочим към центъра за изтегляне на OCHSNER.',
    cta: 'Към центъра за изтегляне',
    note: 'Отваря се ochsner.com',
    types: [
      { icon: 'file', title: 'Технически листове', text: 'Данни и размери по модел' },
      { icon: 'file', title: 'Инструкции за монтаж', text: 'За инсталатори и проектанти' },
      { icon: 'file', title: 'Инструкции за експлоатация', text: 'За ежедневна употреба' },
      { icon: 'quality', title: 'Сертификати', text: 'Енергийни етикети и декларации' }
    ]
  }
}
