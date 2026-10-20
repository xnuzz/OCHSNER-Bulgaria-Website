export const common = {
  brand: 'OCHSNER',
  brandSuffix: 'България',
  brandTagline: 'Официален представител',

  ctaPrimary: 'Заяви безплатна консултация',
  /* Shorter label for the header, where the full CTA wraps to two lines. */
  ctaHeader: 'Консултация',
  ctaSecondary: 'Разгледай продуктите',
  ctaPrice: 'Питай за цена',
  ctaMore: 'Научи повече',
  ctaContact: 'Свържи се с нас',
  ctaPartner: 'Стани партньор',

  phoneLabel: 'Телефон',
  emailLabel: 'Имейл',
  addressLabel: 'Адрес',
  hoursLabel: 'Работно време',

  loading: 'Зареждане…',
  loadError: 'Съдържанието не може да бъде заредено в момента. Моля, опитайте отново.',
  retry: 'Опитай отново',

  skipToContent: 'Към основното съдържание',
  openMenu: 'Отвори менюто',
  closeMenu: 'Затвори менюто',
  required: 'задължително поле',
  downloadSpec: 'Технически документи',
  imagePlaceholder: 'Тук ще бъде добавена реална продуктова снимка.'
}

/* Newsletter subscribe pop-up. Design-only for now — the email is validated and
   a thank-you shown, but not yet posted to a mailing-list service. */
export const newsletter = {
  eyebrow: 'Бюлетин',
  title: 'Останете в течение',
  text: 'Получавайте новини за термопомпите OCHSNER, съвети за отопление и програми за финансиране. Без спам — може да се отпишете по всяко време.',
  placeholder: 'Вашият имейл адрес',
  submit: 'Абонирай се',
  dismiss: 'Не сега',
  close: 'Затвори',
  success: 'Благодарим! Записахме имейла ви.',
  invalid: 'Моля, въведете валиден имейл адрес.'
}

export const nav = {
  mainLabel: 'Основна навигация',
  mobileLabel: 'Мобилно меню',
  footerLabel: 'Навигация в долния колонтитул',
  utilityLabel: 'Допълнителни връзки',
  home: 'Начало',
  products: 'Продукти',
  why: 'Защо термопомпа?',
  about: 'За нас',
  references: 'Референции',
  partner: 'Стани партньор',
  contact: 'Контакти',
  downloadCenter: 'Център за изтегляне',

  megaToggle: 'отвори подменюто',
  megaAllProducts: 'Всички продукти',
  megaWhy: {
    overview: 'Обща информация',
    how: 'Как работи термопомпата',
    threeInOne: 'Отопление, топла вода и охлаждане',
    pv: 'Комбинация с фотоволтаици',
    when: 'Ново строителство или реновация',
    subsidies: 'Програми за финансиране'
  },

  /* Secondary links in the thin bar above the main nav. The external portals are
     run by OCHSNER Austria; the client must confirm which apply to Bulgaria. */
  utility: {
    service: 'Сервиз',
    downloads: 'Документи за изтегляне',
    partnerPortal: 'Партньорски портал',
    becomePartner: 'Стани партньор'
  }
}

/** Phone and email are still to be confirmed by the client before launch. */
export const contactDetails = {
  companyName: 'ОКСНЕР България',
  phone: '+359 877 236 499',
  phoneHref: 'tel:+359877236499',
  email: 'info@ochsner.bg',
  emailHref: 'mailto:info@ochsner.bg',
  /* Separate inbox for service/after-sales enquiries. */
  serviceEmail: 'service@ochsner.bg',
  serviceEmailHref: 'mailto:service@ochsner.bg',
  address: 'ул. „Панорама София“ 5, XS Tower, София 1766',
  addressNote: '',
  /* Keyless Google Maps embed. The pin is Omnia Contractors' listing — same
     building (XS Tower), so it lands on the office rather than the street. */
  mapQuery: 'Omnia Contractors, 5 Panorama Sofia str., Sofia 1766, Bulgaria',
  mapEmbed:
    'https://www.google.com/maps?q=Omnia%20Contractors%2C%205%20Panorama%20Sofia%20str.%2C%20Sofia%201766%2C%20Bulgaria&output=embed',
  mapLink:
    'https://www.google.com/maps/search/?api=1&query=Omnia%20Contractors%2C%205%20Panorama%20Sofia%20str.%2C%20Sofia%201766%2C%20Bulgaria',
  hours: 'Понеделник – петък, 09:00 – 17:00'
}

export const footer = {
  about:
    'Официален представител на OCHSNER за България. Консултация, доставка и сервиз на термопомпени системи.',
  navHeading: 'Навигация',
  contactHeading: 'Контакти',
  legalHeading: 'Правна информация',
  socialHeading: 'Последвайте OCHSNER',
  /* Official OCHSNER Wärmepumpen profiles. Swap for the Bulgarian
     representative's own pages once they exist. */
  social: [
    {
      name: 'facebook',
      label: 'Facebook',
      href: 'https://www.facebook.com/ochsnerwaermepumpen/'
    },
    {
      name: 'instagram',
      label: 'Instagram',
      href: 'https://www.instagram.com/ochsnerwaermepumpen/'
    }
  ],
  privacy: 'Политика за поверителност',
  terms: 'Общи условия',
  cookies: 'Бисквитки',
  legalNote:
    'OCHSNER® е регистрирана марка на OCHSNER Wärmepumpen GmbH, Австрия. Този сайт се поддържа от местния представител за България.',
  copyright: 'Всички права запазени.',

  /* Developer credit in the footer's bottom bar. UTM tags so BitPilot can see
     enquiries that came from this site. */
  credit: {
    by: 'Сайт от',
    href: 'https://bitpilot.dev/?utm_source=ochsner.bg&utm_medium=referral&utm_campaign=footer-credit'
  }
}

/* The download centre is run by OCHSNER Austria; every link to it goes through
   the redirect notice. Defined once so there is a single address to change. */
export const downloadCenterUrl = 'https://www.ochsner.com/en/service/download/'

/* Interstitial shown before leaving for a site run by OCHSNER Austria. */
export const redirectNotice = {
  strong: 'Пренасочваме ви',
  title: 'към сайта на OCHSNER Австрия',
  text: 'Центърът за изтегляне се поддържа от OCHSNER Австрия. Ще ви прехвърлим към него, за да свалите техническите документи.',
  counting: 'Прехвърляне след {n} сек.',
  go: 'Продължи сега',
  stay: 'Остани тук'
}
