import { common, contactDetails, footer, nav } from './common.js'
import { home } from './home.js'
import { products } from './products.js'
import { why } from './why.js'
import { about } from './about.js'
import { references } from './references.js'
import { partner } from './partner.js'
import { contact } from './contact.js'

export default {
  common,
  nav,
  footer,
  contactDetails,
  home,
  products,
  why,
  about,
  references,
  partner,
  contact,

  notFound: {
    meta: { title: 'Страницата не е намерена | OCHSNER България' },
    title: 'Страницата не е намерена',
    text: 'Възможно е адресът да е сгрешен или страницата да е преместена.',
    cta: 'Към началната страница'
  }
}
