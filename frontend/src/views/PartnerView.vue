<script setup>
import { nextTick, reactive, ref } from 'vue'
import SectionHeading from '@/components/ui/SectionHeading.vue'
import BaseButton from '@/components/ui/BaseButton.vue'
import FormField from '@/components/form/FormField.vue'
import FormStatus from '@/components/form/FormStatus.vue'
import { submitPartnerApplication } from '@/api/catalog.js'
import { toFormError } from '@/api/client.js'
import { useSeo } from '@/composables/useSeo.js'
import { useI18n } from '@/i18n'
import PageHero from '@/components/ui/PageHero.vue'

const { common, partner, contact: contactCopy } = useI18n()
const page = ref(null)
const statusRef = ref(null)

const form = reactive({
  companyName: '',
  activity: '',
  contactPerson: '',
  phone: '',
  email: '',
  city: '',
  message: '',
  gdprConsent: false
})

const fieldErrors = ref({})
const submitting = ref(false)
const success = ref('')
const generalError = ref('')

async function onSubmit() {
  submitting.value = true
  fieldErrors.value = {}
  generalError.value = ''
  success.value = ''

  try {
    // An empty select must reach the API as null, otherwise Jackson rejects the
    // whole body before @NotNull can produce a per-field message.
    const result = await submitPartnerApplication({ ...form, activity: form.activity || null })
    success.value = result.message
    Object.assign(form, {
      companyName: '',
      activity: '',
      contactPerson: '',
      phone: '',
      email: '',
      city: '',
      message: '',
      gdprConsent: false
    })
  } catch (error) {
    const normalised = toFormError(
      error,
      contactCopy.form.genericError,
      contactCopy.form.networkError
    )
    fieldErrors.value = normalised.fieldErrors
    generalError.value = normalised.message
  } finally {
    submitting.value = false
    // Move focus to the banner so screen-reader users hear the outcome.
    await nextTick()
    statusRef.value?.$el?.focus?.()
  }
}

useSeo({ title: partner.meta.title, description: partner.meta.description, path: '/stani-partnyor' })
</script>

<template>
  <div ref="page">
    <PageHero
      :eyebrow="partner.hero.eyebrow"
      :title="partner.hero.title"
      :subtitle="partner.hero.subtitle"
    />

    <section class="section">
      <div class="container">
        <SectionHeading
          :strong="partner.looking.title.split(' ').slice(0, 2).join(' ')"
          :title="partner.looking.title.split(' ').slice(2).join(' ')"
          level="h2"
          align="center"
          rule
        />
        <ul class="who">
          <li v-for="item in partner.looking.items" :key="item.title" class="who__item">
            <h3 class="who__title">{{ item.title }}</h3>
            <p class="who__text">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="section section--alt">
      <div class="container">
        <SectionHeading
          :strong="partner.offer.title.split(' ').slice(0, 2).join(' ')"
          :title="partner.offer.title.split(' ').slice(2).join(' ')"
          level="h2"
          align="center"
          rule
        />
        <ul class="offer">
          <li v-for="item in partner.offer.items" :key="item.title" class="offer__item">
            <h3 class="offer__title">{{ item.title }}</h3>
            <p class="offer__text">{{ item.text }}</p>
          </li>
        </ul>
      </div>
    </section>

    <section class="section" id="zayavka">
      <div class="container container--narrow">
        <SectionHeading
          :eyebrow="partner.form.eyebrow"
          :title="partner.form.title"
          :subtitle="partner.form.intro"
        />

        <FormStatus
          v-if="success"
          ref="statusRef"
          variant="success"
          :title="contactCopy.form.successTitle"
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
            :label="partner.form.fields.companyName"
            :error="fieldErrors.companyName"
            required
            v-slot="{ id, describedBy, invalid }"
          >
            <input
              :id="id"
              v-model="form.companyName"
              type="text"
              name="organization"
              autocomplete="organization"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
            />
          </FormField>

          <FormField
            :label="partner.form.fields.activity"
            :error="fieldErrors.activity"
            required
            v-slot="{ id, describedBy, invalid }"
          >
            <select
              :id="id"
              v-model="form.activity"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
            >
              <option value="" disabled>{{ partner.form.fields.activityPlaceholder }}</option>
              <option
                v-for="(label, value) in partner.form.activityOptions"
                :key="value"
                :value="value"
              >
                {{ label }}
              </option>
            </select>
          </FormField>

          <FormField
            :label="partner.form.fields.contactPerson"
            :error="fieldErrors.contactPerson"
            required
            v-slot="{ id, describedBy, invalid }"
          >
            <input
              :id="id"
              v-model="form.contactPerson"
              type="text"
              autocomplete="name"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
            />
          </FormField>

          <div class="form__row">
            <FormField
              :label="partner.form.fields.phone"
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
              :label="partner.form.fields.email"
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

          <FormField
            :label="partner.form.fields.city"
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

          <FormField
            :label="partner.form.fields.message"
            :error="fieldErrors.message"
            v-slot="{ id, describedBy, invalid }"
          >
            <textarea
              :id="id"
              v-model="form.message"
              :placeholder="partner.form.fields.messagePlaceholder"
              :aria-describedby="describedBy"
              :aria-invalid="invalid"
            ></textarea>
          </FormField>

          <div class="consent" :class="{ 'consent--error': fieldErrors.gdprConsent }">
            <input id="partner-gdpr" v-model="form.gdprConsent" type="checkbox" />
            <label for="partner-gdpr">{{ contactCopy.form.gdpr }}</label>
          </div>
          <p v-if="fieldErrors.gdprConsent" class="consent__error" role="alert">
            {{ fieldErrors.gdprConsent }}
          </p>

          <BaseButton type="submit" size="lg" :disabled="submitting">
            {{ submitting ? partner.form.submitting : partner.form.submit }}
          </BaseButton>
          <p class="form__note">{{ common.required }}: *</p>
        </form>
      </div>
    </section>
  </div>
</template>

<style scoped>
.who,
.offer {
  list-style: none;
  padding: 0;
  margin: 0 auto;
  max-width: 1082px;
  display: grid;
  gap: 30px;
}

.who__item,
.offer__item {
  padding: clamp(var(--sp-5), 2.4vw, 40px);
  background: var(--c-surface);
  border: 1px solid var(--c-line);
  border-radius: 20px;
  transition: transform var(--dur) var(--ease), box-shadow var(--dur) var(--ease),
    border-color var(--dur) var(--ease);
}

.who__item:hover,
.offer__item:hover {
  transform: translateY(-4px);
  border-color: transparent;
  box-shadow: var(--shadow-lg);
}

.who__title,
.offer__title {
  font-size: 1.25rem;
  font-weight: var(--fw-bold);
  color: var(--c-primary-900);
}

.who__text,
.offer__text {
  margin-top: var(--sp-3);
  color: var(--c-ink-soft);
  line-height: var(--lh-body);
}

.form {
  margin-top: var(--sp-5);
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
  /* 20px keeps the checkbox comfortably tappable. */
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

@media (min-width: 640px) {
  .who {
    grid-template-columns: repeat(2, 1fr);
  }

  .offer {
    grid-template-columns: repeat(2, 1fr);
  }

  .form__row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1000px) {
  .who,
  .offer {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
