<script setup>
import { nextTick, reactive, ref } from 'vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/form/FormField.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import AppIcon from '@/components/ui/AppIcon.vue'
import { submitContact } from '@/api/catalog.js'
import { toFormError } from '@/api/client.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'
import PageHero from '@/components/ui/PageHero.vue'

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
                <RouterLink :to="{ name: 'legal-privacy' }" target="_blank">
                  {{ copy.form.gdprLink }}
                </RouterLink>
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
        <aside class="contact__details">
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
              <dt>{{ copy.details.serviceLabel }}</dt>
              <dd>
                <a :href="contactDetails.serviceEmailHref">{{ contactDetails.serviceEmail }}</a>
                <span class="details__note">{{ copy.details.serviceNote }}</span>
              </dd>
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
          <!-- Keyless Google Maps embed for the office address. -->
          <iframe
            class="map"
            :src="contactDetails.mapEmbed"
            :title="copy.details.mapTitle"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            allowfullscreen
          ></iframe>
          <a
            class="map__link"
            :href="contactDetails.mapLink"
            target="_blank"
            rel="noopener"
          >
            {{ copy.details.mapLinkLabel }}
            <AppIcon name="arrowRight" :size="16" />
          </a>
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
  font-size: var(--fs-small);
  font-weight: var(--fw-semibold);
  color: var(--c-ink-muted);
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
  display: block;
  width: 100%;
  max-width: 100%;
  aspect-ratio: 4 / 3;
  border: 0;
  border-radius: var(--radius);
  background: var(--c-primary-50);
}

.map__link {
  margin-top: var(--sp-3);
  display: inline-flex;
  align-items: center;
  gap: var(--sp-2);
  font-family: var(--font-heading);
  font-size: var(--fs-small);
  font-weight: var(--fw-semibold);
  color: var(--c-accent-500);
  text-decoration: none;
}

.map__link:hover {
  text-decoration: underline;
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
