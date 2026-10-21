# ochsner.com vs ochsner.bg — product data comparison (2026-10-22)

Source: every series page and all 35 unit pages under ochsner.com/en/heat-pumps/,
fetched 2026-10-22. Plain-text extracts are in `series/` and `units/` next to this
file; every figure below comes from them. TERRA FOX is withdrawn from the BG range
and is left out.

Files to change: `frontend/src/i18n/bg/variants.js` (unit pages),
`frontend/src/i18n/bg/models.js` (series pages), `frontend/src/views/ProductVariantView.vue`.

## What every ochsner.com unit page has

1. Kicker, name, range (+ version line like "(S1)", "(CM1)"), description
2. Award line under the description (AIR HAWK units only)
3. 3–4 spec tiles
4. "Suitable for" list
5. Technical data accordion: test point group (A7/W35, B0/W35, W10/W35 or
   "Appliance data" for hot water), energy efficiency, indoor unit, outdoor unit
   (air only), electrical data
6. **Properties** accordion: refrigerant · heating or heating/cooling · max flow
   (or DHW) temp · controller · SG Ready

Our Properties accordion is synthesised from the series card tags, so it does not
show refrigerant / max temperature / controller like theirs. Fix: a `props` array
per unit, rendered as-is. Award line: optional `note` field under the description.

## Unit gaps

| Series | ochsner.com units | ours | Gap |
| --- | --- | --- | --- |
| AIR HAWK | 208, 518, 726, 1850 | same 4 | 208 is complete. 518/726/1850 only have a 5-row summary: add full A7/W35, efficiency, indoor, outdoor, electrical tables; descriptions and "suitable for" differ (see below). 208 is missing the "single- or three-phase supply" row. |
| AIR EAGLE | 1830 CM, 1830 HM | one "1830" | Split into CM and HM. Ours has no measured data at all: 20 kW P rated, 209.4 % ETAs, SCOP 5.31, 37 dB(A), full tables. |
| AIR MILAN | 10 units | same 10 | Figures all match. Only the Properties accordion is missing. |
| GEO FOX | 207 S1 (2–7 kW), 312 S1 (3–12 kW) | "S200 (Tower)", "S1" | ochsner.com lists no S200 unit. Replace with 207 S1 and 312 S1, full B0/W35 tables. Our cards say **OTS** — it is **OTF**. |
| AQUA FOX | 208/312/416, each S200 and S1 (6 units) | "S200", "S1" | Add 6 units. Refrigerant **R452B** (ours never says). Unit SCOP 7.51–7.78 (W10/W35); series text keeps 5.6–5.8. S200 has an extra tile: DHW class A+ (208) / A (312, 416), load profile XL. |
| EUROPA N | 200 CA (267 l), 300 CA (415 l), 300 R CA (393 l) | 200 CA, "300 R CA" | **Our 300 R CA shows 415 l — that is the 300 CA.** 300 R CA is 393 l (294 l tank + coil). Add the missing unit, fix the volume, full appliance-data tables. |
| EUROPA MINI | IWPL (357 l), IWP (373 l) | one "EUROPA MINI" | Split into two. Refrigerant R134a. IWP: A+, 129 % ETAwh, Tiptronic Plus S, SG Ready. IWPL: A, 120 %, Tiptronic light, not SG Ready. |

### Unit figures to add (from `units/`)

AIR HAWK (A7/W35 output / input / COP · P rated · ETAs · SCOP · indoor HxWxD, kg · outdoor HxWxD, kg · Lp 3 m · Lw)
- 518: 4.82 kW / 1.00 kW / 4.82 · 12 kW · 198.7 % · 5.04 · 1287x600x680, 170 · 1261x1292x965, 112 · 35.5 · 53
- 726: 9.25 / 1.80 / 5.14 · 17 · 198.6 · 5.04 · 1287x600x680, 173 · 1262x2224x965, 140 · 31.6 · 49
- 1850: 20.69 / 3.94 / 5.24 · 40 · 186.3 · 4.74 · 1287x600x680, 206 · 1461x2268x1070, 300 · 39.7 · 57
- All: 3/~380-400/50, variable-speed compressor. 1850 cascade = up to 4 units / 160 kW (ours says "well over 200 kW" on the unit page; the 200 kW figure is the series-page claim).

AIR EAGLE 1830 (CM and HM identical except indoor unit)
- A7/W35 11.17 / 2.03 / 5.51 · 20 kW · 209.4 % · SCOP 5.31 · outdoor 1474x2300x1100, 415 kg · 37 / 54 dB(A)
- Indoor CM 358x482x130, 8 kg · HM 757x442x343, 33 kg
- Suitable for: detached/two-family, apartment & commercial, underfloor, radiators up to 65 °C

GEO FOX (B0/W35, indoor 1447x600x700, R290, 70 °C, OTF, heating only)
- 207 S1: 3.36 / 0.73 / 4.62 · 7 kW · 200.0 % · SCOP 5.21 · 115 kg
- 312 S1: 6.20 / 1.27 / 4.87 · 11 kW · 208.0 % · SCOP 5.4 · 132 kg

AQUA FOX (W10/W35 output, COP · P rated · ETAs · SCOP · weight S200 / S1; S200 1801x600x691, S1 1447x600x693; R452B, 65 °C, OTF)
- 208 (2–11 kW): 8.88 kW, 5.82 · 9 kW · 294.0 % · 7.56 · 150 / 115 kg · S200 DHW class A+
- 312 (3–14 kW): 12.24, 6.08 · 12 · 292.0 · 7.51 · 162 / 127 · S200 DHW class A
- 416 (4–18 kW): 12.68, 6.73 · 13 · 303.0 · 7.78 · 176 / 141 · S200 DHW class A
- S200 houses a 178 l stainless-steel DHW tank

EUROPA (air inlet · load profile · COP · heat-up · max usable water · ref. DHW temp · avg output · avg input · H x Ø · weight · class · ETAwh)
- N 200 CA: A20 · L · 4.27 · 5h24 · 267 l · 51.6 °C · 1.845 kW · 0.52 kW · 1474x650 · 95 kg · A+ · 175.7 % · up to 4 persons
- N 300 CA: A20 · XL · 4.21 · 8h22 · 415 l · 52.4 · 1.729 · 0.52 · 1902x650 · 110 · A+ · 171.8 % · up to 5 persons
- N 300 R CA: A20 · XL · 4.34 · 7h54 · 393 l · 51.98 · 1.732 · 0.52 · 1902x650 · 123 · A+ · 177.3 % · up to 5 persons
- MINI IWP: A15 · XL · 3.16 · 8h18 · 373 l · 54.4 · 1.90 · 0.51 · SCOPw 4.34 · 432x657 · 45 · A+ · 129.0 %
- MINI IWPL: A15 · XL · 2.71 · 9h00 · 357 l · 52.5 · 1.68 · 0.48 · SCOPw 3.38 · 432x657 · 45 · A · 120.0 %
- All 1/~220-240/50. EUROPA N: R290, 65 °C, rotary knob or app, SG Ready. MINI: R134a, 60 °C.

## Series-page gaps (models.js)

- **AIR HAWK**: complete. FAQ "why quiet" is missing "AIR HAWK 208 holds the OCHSNER sound record in the Swiss heat pump test centre, 28 dB(A) at 3 m"; FAQ "how controlled" is missing the SG-Ready / PV-surplus sentence.
- **AIR EAGLE**: model cards → two (CM, HM) with A+++ / 20 kW / 209.4 % / 37 dB(A). FAQ: theirs has 5 (construction, brine intermediate circuit, why R290, flow temps, control); ours has 4 different ones.
- **AIR MILAN**: FAQ — theirs has 8 (monoblock?, Safety Box, why R290, flow temps, efficiency SCOP 4.9 / SEER 4.8, cooling, indoor units, control); ours has 3.
- **GEO FOX**: model cards → 207 S1, 312 S1. Missing section "Model variety in geothermal energy" (three sizes, 2–16 kW, R290). FAQ: theirs has 5 (heat sources/permits, buffer, cooling, R290, S200 vs S1); ours has 3.
- **AQUA FOX**: model cards → 6. Missing section "OCHSNER AQUA: highly efficient for high performance" (AQUA 36/54/97, 28–99 kW, SCOP 5.5–6.3). FAQ: theirs has 9; ours has 3.
- **EUROPA N**: model cards → 3. First highlight is cut short (missing "output larger than storage content", heating rod for guests). Missing highlight "Additional function: cooling and dehumidifying". FAQ: theirs has 7; ours has 3.
- **EUROPA MINI**: model cards → 2. Same first-highlight gap and missing cooling/dehumidifying highlight. Application features are missing their bullet lists (heating room install, hot water from room air, laundry drying). FAQ: theirs has 6; ours has 3.

Category pages (categories.js) product cards already match ochsner.com.

## URL changes

Replacing GEO FOX S200/S1 and AQUA FOX S200/S1 retires four indexed unit URLs.
The router currently sends an unknown unit to /produkti; sending it to its series
page instead (if the series exists) is a one-line change in `router/index.js`.
