# OCHSNER България — website

Marketing and lead-generation site for the Bulgarian representative of OCHSNER
(Austrian heat pump manufacturer). Monorepo: a Spring Boot REST API and a Vue 3 SPA.

All public-facing content is in Bulgarian. Code, comments and commits are in English.

```
/backend    Spring Boot 3.3 · Java 21 · Maven · JPA · H2 (dev) / PostgreSQL (prod)
/frontend   Vue 3 (Composition API) · Vite · Vue Router · Axios · plain CSS tokens
```

## Prerequisites

| Tool | Version |
| --- | --- |
| JDK | 21 |
| Maven | 3.9+ |
| Node.js | 20+ |

## Running locally

Two terminals. The backend must be up for products, references and both forms to work.

### Backend — http://localhost:8080

```bash
cd backend
mvn spring-boot:run
```

- Seeds the four product categories and six placeholder references into H2 on first run.
- H2 data file: `backend/data/ochsner-bg.mv.db` (gitignored). Delete it to re-seed.
- H2 console: http://localhost:8080/h2-console (JDBC URL `jdbc:h2:file:./data/ochsner-bg`, user `sa`, empty password).
- Health check: http://localhost:8080/actuator/health
- **Mail:** with no SMTP host configured, notifications are written to the application
  log instead of being sent. Look for the `[MAIL — not sent, no SMTP host configured]`
  block after submitting a form.

### Frontend — http://localhost:5173

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api` to `http://localhost:8080`, so the SPA runs same-origin in dev.
The backend also sets CORS headers for `localhost:5173` for the case where the two
are served from different hosts.

Production build: `npm run build` → `frontend/dist` (static files, serve from any host).

## API

Base path `/api/v1`. JSON in, JSON out.

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/products` | The four heat pump categories (copy lives in the DB, not the frontend) |
| `GET` | `/products/{slug}` | A single category |
| `GET` | `/references` | Completed installations for the Референции page |
| `POST` | `/contact` | Contact form → stored + e-mail notification |
| `POST` | `/partner-applications` | Partner form → stored + e-mail notification |

Validation failures return `400` with per-field Bulgarian messages:

```json
{
  "status": 400,
  "message": "Моля, проверете попълнените данни.",
  "fieldErrors": { "email": "Моля, въведете валиден имейл адрес." },
  "timestamp": "2026-07-20T09:00:00Z"
}
```

The frontend renders `fieldErrors` inline next to the matching input; unexpected
errors return a generic message and never leak a stack trace.

## Production configuration

Run with `--spring.profiles.active=prod` and supply:

| Variable | Purpose |
| --- | --- |
| `DB_URL`, `DB_USERNAME`, `DB_PASSWORD` | PostgreSQL connection |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USERNAME`, `SMTP_PASSWORD` | Outbound mail |
| `NOTIFY_EMAIL` | Address that receives form submissions |
| `MAIL_FROM` | Envelope sender |
| `SITE_ORIGIN` | Allowed CORS origin for the deployed SPA |

Setting `SMTP_HOST` switches the app from the logging mailer to real SMTP
automatically (see `config/MailConfig.java`).

`spring.jpa.hibernate.ddl-auto` is `update` in both profiles. Before the first real
deployment, introduce Flyway or Liquibase and switch it to `validate`.

## Project layout

```
backend/src/main/java/bg/ochsner/site/
  config/      CORS, mail wiring, catalog seed data (all Bulgarian product copy)
  domain/      JPA entities and enums
  repository/  Spring Data interfaces
  service/     Business logic; service/mail holds the mailer abstraction
  web/         Controllers, DTOs with Bean Validation, global exception handler

frontend/src/
  api/         Axios client, catalog calls, small async-data helper
  assets/      tokens.css (design tokens) + base.css (reset, utilities)
  components/  form/ layout/ home/ products/ ui/ why/
  composables/ useSeo (per-route meta), useReveal (scroll animation)
  i18n/        bg/ locale bundle — every user-facing string
  router/      Routes with Bulgarian URL slugs; only Home is eagerly bundled
  views/       One per route
```

## Content still to be supplied by the client

Searchable by the marker `ЗА ПОПЪЛВАНЕ` in `frontend/src/i18n/bg/`:

- **За нас** — representative bio, photo, real certifications and years of experience.
- **Защо термопомпа** — current Bulgarian subsidy programmes (deliberately left without
  invented figures).
- **Референции** — real projects and photography; replace the seeded rows in
  `CatalogSeeder.java` or add them through a future admin UI.
- **Начало** — the three testimonials are fictional placeholders, marked as such in
  `i18n/bg/home.js`.
- **Контакти** — real address, phone, e-mail and working hours (`i18n/bg/common.js`),
  plus the embedded map, which is currently a styled placeholder so that no
  third-party cookies load.
- **Legal** — privacy policy, terms and cookie pages are linked but not written.
- **Assets** — product and reference photography (currently CSS gradient placeholders,
  see `components/ui/PlaceholderImage.vue`), `og-image.jpg`, and the PDF datasheets in
  `frontend/public/downloads/`.
- **Branding** — `BrandMark.vue` and `favicon.svg` are original placeholder marks, not
  the OCHSNER logo. Swap in the licensed brand asset.

## Design notes

- Mobile-first: every layout starts single-column and adds breakpoints upward.
- No component library. Colours, type, spacing and motion are CSS variables in
  `tokens.css`; components never hardcode values.
- The hero and all imagery are CSS gradients rather than bitmaps, which keeps LCP
  low until real photography arrives.
- Only the home route is in the main bundle; the rest are lazy-loaded.
- Motion is limited to fades and small translations, and is disabled entirely under
  `prefers-reduced-motion`.
