/*
 * Hero overlays for the model pages.
 *
 * The manufacturer's header images (public/images/models/hero/*.webp) already
 * carry the full composition — building, product renders, callout arrows, the
 * green "feature" pills and the coloured spec tiles. Everything except the
 * callout labels is baked-in English or German text, so each tile and pill is
 * covered by a Bulgarian one drawn in the same style at the same place.
 *
 * `box` is measured against the source image in its own pixels (all are 1710
 * wide) and converted to percentages by the component, so the overlay tracks
 * the photo at any width. Boxes are padded a little beyond the artwork so the
 * original never peeks out at the edges.
 *
 * The callout labels (AIR HAWK 726, TERRA FOX S1 …) are model names and need no
 * translation, so they are left alone.
 */
export const heroes = {
  'air-hawk': {
    src: '/images/models/hero/air-hawk.webp',
    w: 1710,
    h: 847,
    tiles: {
      box: { x: 1040, y: 664, w: 476, h: 118 },
      direction: 'row',
      items: [
        { big: '6–51', unit: 'kW', label: 'Отоплителна мощност' },
        { small: 'Температура на подаване до', big: '65°' },
        { text: 'Отопление\n+ охлаждане' }
      ]
    }
  },

  'air-eagle': {
    src: '/images/models/hero/air-eagle.webp',
    w: 1710,
    h: 813,
    tiles: {
      box: { x: 900, y: 616, w: 472, h: 114 },
      direction: 'row',
      items: [
        { small: 'до', big: '30', unit: 'kW', label: 'Отоплителен товар' },
        { small: 'Температура на подаване до', big: '70°' },
        { text: 'Отопление\n+ охлаждане' }
      ]
    },
    pills: {
      box: { x: 334, y: 582, w: 380, h: 94 },
      items: ['Напълно допустима за финансиране', 'Природен хладилен агент R290*']
    }
  },

  'air-milan': {
    src: '/images/models/hero/air-milan.webp',
    w: 1710,
    h: 786,
    tiles: {
      box: { x: 1144, y: 396, w: 168, h: 360 },
      direction: 'column',
      items: [
        { big: '3–20', unit: 'kW', label: 'Отоплителна мощност' },
        { small: 'Температура на подаване до', big: '70°' },
        { text: 'Отопление\n+ охлаждане' }
      ]
    },
    pills: {
      box: { x: 594, y: 642, w: 220, h: 46 },
      items: ['Природен хладилен агент R290']
    }
  },

  'geo-fox': {
    src: '/images/models/hero/geo-fox.webp',
    w: 1710,
    h: 771,
    tiles: {
      box: { x: 988, y: 618, w: 250, h: 122 },
      direction: 'row',
      items: [{ text: 'Отопление и\nпасивно охлаждане' }]
    }
  },

  'terra-fox': {
    src: '/images/models/hero/terra-fox.webp',
    w: 1710,
    h: 765,
    tiles: {
      box: { x: 942, y: 620, w: 258, h: 122 },
      direction: 'row',
      items: [{ text: 'Отопление и\nпасивно охлаждане' }]
    }
  },

  'aqua-fox': {
    src: '/images/models/hero/aqua-fox.webp',
    w: 1710,
    h: 765,
    tiles: {
      box: { x: 782, y: 630, w: 418, h: 112 },
      direction: 'row',
      items: [
        { big: '2–18', unit: 'kW', label: 'Отоплителна мощност' },
        { text: 'Отопление и\nпасивно охлаждане' }
      ]
    }
  },

  'europa-n': {
    src: '/images/models/hero/europa-n.webp',
    w: 1710,
    h: 816,
    tiles: {
      box: { x: 1080, y: 638, w: 172, h: 112 },
      direction: 'row',
      items: [{ small: 'Топла вода до', big: '65°' }]
    },
    pills: {
      box: { x: 546, y: 638, w: 224, h: 44 },
      items: ['Природен хладилен агент R290']
    }
  },

  'europa-mini': {
    src: '/images/models/hero/europa-mini.webp',
    w: 1710,
    h: 774,
    tiles: {
      box: { x: 946, y: 640, w: 174, h: 110 },
      direction: 'row',
      items: [{ small: 'Топла вода до', big: '60°' }]
    }
  }
}
