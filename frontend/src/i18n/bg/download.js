/*
 * „Център за изтегляне“ page.
 *
 * Two parts, as the client described:
 *   1. Detailed technical documentation and manuals live in OCHSNER Austria's
 *      download centre — a button there sends the visitor on, via the redirect
 *      notice.
 *   2. Files hosted on our own site (catalogue, price list). The client will
 *      supply the actual PDFs; each entry shows a „предстои“ state until its
 *      `file` path is filled in and the PDF is dropped in /public/downloads/.
 */
export const download = {
  meta: {
    title: 'Център за изтегляне | OCHSNER България',
    description:
      'Технически документи, каталози и ценова листа за термопомпите OCHSNER, както и връзка към пълния център за изтегляне на OCHSNER Австрия.'
  },
  title: 'Център за изтегляне',
  intro:
    'Тук ще намерите каталозите и материалите на OCHSNER България, както и връзка към пълния архив с техническа документация на производителя.',

  /* Redirect to OCHSNER Austria for the full technical archive. */
  external: {
    strong: 'Подробна техническа',
    title: 'информация и инструкции',
    text: 'Пълните технически листове, схеми и инструкции за монтаж и експлоатация се поддържат от OCHSNER Австрия. Ще ви пренасочим към техния център за изтегляне.',
    cta: 'Към центъра на OCHSNER'
  },

  /* Files served from our own site. */
  filesTitle: 'Файлове за изтегляне',
  soon: 'Предстои',
  download: 'Изтегли',
  files: [
    {
      title: 'Продуктов каталог',
      text: 'Пълната гама термопомпи OCHSNER за България в един файл.',
      file: null
    },
    {
      title: 'Ценова листа',
      text: 'Актуални ориентировъчни цени по серии и модели.',
      file: null
    }
  ]
}
