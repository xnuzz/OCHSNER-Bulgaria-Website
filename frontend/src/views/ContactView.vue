<script setup>
import { nextTick, reactive, ref } from 'vue'
import PageHero from '@/components/ui/PageHero.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/form/FormField.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { submitContact } from '@/api/catalog.js'
import { toFormError } from '@/api/client.js'
import { useReveal } from '@/composables/useReveal.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'

const { common, contact: copy, contactDetails } = useI18n()
const page = ref(null)
const statusRef = ref(null)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  requestType: '',
  city: '',
  message: '',
  gdprConsent: false
})

const fieldErrors = ref({})
const submitting = ref(false)
const success = ref('')
const generalError = ref('')

function reset() {
  Object.assign(form, {
    name: '',
    phone: '',
    email: '',
    requestType: '',
    city: '',
    message: '',
    gdprConsent: false
  })
}

async function onSubmit() {
  submitting.value = true
  fieldErrors.value = {}
  generalError.value = ''
  success.value = ''

  try {
    const result = await submitContact({
      ...form,
      // See PartnerView: an empty select must be null, not "".
      requestType: form.requestType || null
    })
    success.value = result.message
    reset()
  } catch (error) {
    const normalised = toFormError(error, copy.form.genericError, copy.form.networkError)
    fieldErrors.value = normalised.fieldErrors
    generalError.value = normalised.message
  } finally {
    submitting.value = false
    await nextTick()
    statusRef.value?.$el?.focus?.()
  }
}

useSeo({ title: copy.meta.title, description: copy.meta.description, path: '/kontakti' })
useReveal(page)
</script>

<template>
  <div ref="page">
    <PageHero :eyebrow="copy.hero.eyebrow" :title="copy.hero.title" :subtitle="copy.hero.subtitle" />

    <section class="section">
      <div class="container contact">
        <!-- Form column -->
        <div class="contact__form-col">
          <h2 class="contact__title">{{ copy.form.title }}</h2>
          <p class="contact__intro muted small">{{ copy.form.intro }}</p>

          <FormStatus
            v-if="success"
            ref="statusRef"
            variant="success"
            :title="copy.form.successTitle"
            :message="success"
          />
          <FormStatus
            v-else-if="generalError"
            ref="statusRef"
            variant="error"
            :message="generalError"
          />

          <form class="form" novalidate @submit.prevent="onSubmit">
            <FormField
              :label="copy.form.fields.name"
              :error="fieldErrors.name"
              required
              v-slot="{ id, describedBy, invalid }"
            >
              <input
                :id="id"
                v-model="form.name"
                type="text"
                autocomplete="name"
                :aria-describedby="describedBy"
                :aria-invalid="invalid"
              />
            </FormField>

            <div class="form__row">
              <FormField
                :label="copy.form.fields.phone"
                :error="fieldErrors.phone"
                required
                v-slot="{ id, describedBy, invalid }"
              >
                <input
                  :id="id"
                  v-model="form.phone"
                  type="tel"
                  autocomplete="tel"
                  inputmode="tel"
                  :aria-describedby="describedBy"
                  :aria-invalid="invalid"
                />
              </FormField>

              <FormField
                :label="copy.form.fields.email"
                :error="fieldErrors.email"
                required
                v-slot="{ id, describedBy, invalid }"
              >
                <input
                  :id="id"
                  v-model="form.email"
                  type="email"
                  autocomplete="email"
                  inputmode="email"
                  :aria-describedby="describedBy"
                  :aria-invalid="invalid"
                />
              </FormField>
            </div>

            <div class="form__row">
              <FormField
                :label="copy.form.fields.requestType"
                :error="fieldErrors.requestType"
                required
                v-slot="{ id, describedBy, invalid }"
              >
                <select
                  :id="id"
                  v-model="form.requestType"
                  :aria-describedby="describedBy"
                  :aria-invalid="invalid"
                >
                  <option value="" disabled>{{ copy.form.fields.requestTypePlaceholder }}</option>
                  <option
                    v-for="(label, value) in copy.form.requestTypeOptions"
                    :key="value"
                    :value="value"
                  >
                    {{ label }}
                  </option>
                </select>
              </FormField>

              <FormField
                :label="copy.form.fields.city"
                :error="fieldErrors.city"
                v-slot="{ id, describedBy, invalid }"
              >
                <input
                  :id="id"
                  v-model="form.city"
                  type="text"
                  autocomplete="address-level2"
                  :aria-describedby="describedBy"
                  :aria-invalid="invalid"
                />
              </FormField>
            </div>

            <FormField
              :label="copy.form.fields.message"
              :error="fieldErrors.message"
              required
              v-slot="{ id, describedBy, invalid }"
            >
              <textarea
                :id="id"
                v-model="form.message"
                :placeholder="copy.form.fields.messagePlaceholder"
                :aria-describedby="describedBy"
                :aria-invalid="invalid"
              ></textarea>
            </FormField>

            <div class="consent" :class="{ 'consent--error': fieldErrors.gdprConsent }">
              <input id="contact-gdpr" v-model="form.gdprConsent" type="checkbox" />
              <label for="contact-gdpr">
                {{ copy.form.gdpr }}
                <!-- Privacy policy page is not built yet. -->
                <a href="#">{{ copy.form.gdprLink }}</a>
              </label>
            </div>
            <p v-if="fieldErrors.gdprConsent" class="consent__error" role="alert">
              {{ fieldErrors.gdprConsent }}
            </p>

            <BaseButton type="submit" size="lg" :disabled="submitting">
              {{ submitting ? copy.form.submitting : copy.form.submit }}
            </BaseButton>
            <p class="form__note">{{ common.required }}: *</p>
          </form>
        </div>

        <!-- Details column -->
        <aside class="contact__details" data-reveal>
          <h2 class="contact__title">{{ copy.details.title }}</h2>
          <dl class="details">
            <div class="details__row">
              <dt>{{ common.phoneLabel }}</dt>
              <dd><a :href="contactDetails.phoneHref">{{ contactDetails.phone }}</a></dd>
            </div>
            <div class="details__row">
              <dt>{{ common.emailLabel }}</dt>
              <dd><a :href="contactDetails.emailHref">{{ contactDetails.email }}</a></dd>
            </div>
            <div class="details__row">
              <dt>{{ common.addressLabel }}</dt>
              <dd>
                {{ contactDetails.address }}
                <span class="details__note">{{ contactDetails.addressNote }}</span>
              </dd>
            </div>
            <div class="details__row">
              <dt>{{ common.hoursLabel }}</dt>
              <dd>{{ contactDetails.hours }}</dd>
            </div>
          </dl>

          <p class="details__response">{{ copy.details.responseNote }}</p>

          <h3 class="map__title">{{ copy.details.mapTitle }}</h3>
          <!--
            Placeholder for the embedded map. Swap for an <iframe> (or a
            privacy-friendlier static map) once the client confirms the address —
            an iframe is deliberately not loaded now to avoid third-party cookies.
          -->
          <div class="map" role="img" :aria-label="copy.details.mapTitle">
            <span class="map__pin" aria-hidden="true">◎</span>
            <span class="map__label">{{ copy.details.mapPlaceholder }}</span>
          </div>
          <p class="details__note">{{ copy.details.mapNote }}</p>
        </aside>
      </div>
    </section>
  </div>
</template>

<style scoped>
.contact {
  display: grid;
  gap: var(--sp-7);
}

.contact__title {
  font-size: var(--fs-h2);
  color: var(--c-primary-800);
}

.contact__intro {
  margin-top: var(--sp-2);
  margin-bottom: var(--sp-5);
}

.form {
  display: grid;
  gap: var(--sp-5);
}

.form__row {
  display: grid;
  gap: var(--sp-5);
}

.consent {
  display: flex;
  align-items: flex-start;
  gap: var(--sp-3);
  padding: var(--sp-4);
  border: 1px solid var(--c-line);
  border-radius: var(--radius);
  background: var(--c-surface-alt);
}

.consent--error {
  border-color: var(--c-error);
}

.consent input {
  width: 20px;
  height: 20px;
  margin-top: 2px;
  flex-shrink: 0;
  accent-color: var(--c-primary-600);
}

.consent label {
  font-size: 0.9rem;
  color: var(--c-ink-soft);
}

.consent__error {
  margin-top: calc(var(--sp-5) * -1 + var(--sp-2));
  font-size: 0.82rem;
  color: var(--c-error);
}

.form__note {
  font-size: 0.8rem;
  color: var(--c-ink-muted);
}

.contact__details {
  align-self: start;
  padding: var(--sp-5);
  background: var(--c-surface-alt);
  border-radius: var(--radius-lg);
}

.details {
  margin: var(--sp-5) 0 0;
  display: grid;
  gap: var(--sp-4);
}

.details__row dt {
  font-family: var(--font-heading);
  font-size: var(--fs-eyebrow);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--c-primary-600);
}

.details__row dd {
  margin: var(--sp-1) 0 0;
  color: var(--c-ink);
}

.details__note {
  display: block;
  margin-top: var(--sp-1);
  font-size: 0.78rem;
  color: var(--c-ink-muted);
}

.details__response {
  margin-top: var(--sp-5);
  padding-top: var(--sp-4);
  border-top: 1px solid var(--c-line);
  font-size: var(--fs-small);
  color: var(--c-ink-soft);
}

.map__title {
  margin-top: var(--sp-5);
  color: var(--c-primary-800);
}

.map {
  margin-top: var(--sp-3);
  display: grid;
  place-items: center;
  gap: var(--sp-2);
  aspect-ratio: 4 / 3;
  border: 1px dashed var(--c-primary-300);
  border-radius: var(--radius);
  background:
    repeating-linear-gradient(0deg, transparent 0 26px, rgba(13, 90, 114, 0.06) 26px 27px),
    repeating-linear-gradient(90deg, transparent 0 26px, rgba(13, 90, 114, 0.06) 26px 27px),
    var(--c-primary-50);
  color: var(--c-primary-700);
}

.map__pin {
  font-size: 1.8rem;
}

.map__label {
  font-family: var(--font-heading);
  font-size: var(--fs-small);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media (min-width: 640px) {
  .form__row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 980px) {
  .contact {
    grid-template-columns: 1.5fr 1fr;
  }
}
</style>
