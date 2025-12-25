<template>
  <section id="survey" class="py-20 bg-gradient-to-b from-primary/5 to-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12 reveal">
        <p class="text-sm text-primary font-medium mb-2">
          {{ t('survey.section.heading') }}
        </p>
        <h2 class="text-3xl md:text-4xl font-serif font-bold text-ink mb-4">
          {{ t('survey.section.subtitle') }}
        </h2>
        <p class="max-w-2xl mx-auto text-ink/70">
          {{ t('survey.section.description') }}
        </p>
      </div>

      <!-- Form -->
      <div class="max-w-2xl mx-auto reveal">
        <form
          @submit.prevent="handleSubmit"
          class="bg-white rounded-2xl shadow-xl p-8 md:p-12"
        >
          <!-- Name -->
          <div class="mb-6">
            <label class="block text-ink font-medium mb-2">
              {{ t('survey.label.name') }}
            </label>
            <input
              v-model="formData.name"
              type="text"
              required
              :placeholder="t('survey.placeholder.name')"
              class="w-full px-4 py-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>

          <!-- Number of Guests -->
          <div class="mb-6">
            <label class="block text-ink font-medium mb-2">
              {{ t('survey.label.guests') }}
            </label>
            <select
              v-model="formData.guests"
              required
              class="w-full px-4 py-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="" disabled>{{ t('survey.option.guests.placeholder') }}</option>
              <option value="1">{{ t('survey.option.guests.1') }}</option>
              <option value="2">{{ t('survey.option.guests.2') }}</option>
              <option value="3">{{ t('survey.option.guests.3') }}</option>
              <option value="4">{{ t('survey.option.guests.4plus') }}</option>
            </select>
          </div>

          <!-- Dietary Preference -->
          <div class="mb-6">
            <label class="block text-ink font-medium mb-2">
              {{ t('survey.label.diet') }}
            </label>
            <select
              v-model="formData.diet"
              required
              class="w-full px-4 py-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            >
              <option value="" disabled>{{ t('survey.option.diet.placeholder') }}</option>
              <option value="standard">{{ t('survey.option.diet.standard') }}</option>
              <option value="vegetarian">{{ t('survey.option.diet.vegetarian') }}</option>
              <option value="vegan">{{ t('survey.option.diet.vegan') }}</option>
              <option value="noSeafood">{{ t('survey.option.diet.noSeafood') }}</option>
            </select>
          </div>

          <!-- Message -->
          <div class="mb-6">
            <label class="block text-ink font-medium mb-2">
              {{ t('survey.label.message') }}
            </label>
            <textarea
              v-model="formData.message"
              rows="4"
              :placeholder="t('survey.placeholder.message')"
              class="w-full px-4 py-3 border border-ink/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            ></textarea>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            :disabled="isSubmitting"
            :class="[
              'w-full py-4 rounded-full font-medium text-white transition-all transform',
              isSubmitting
                ? 'bg-ink/40 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98]'
            ]"
          >
            {{ isSubmitting ? t('survey.message.sending') : t('survey.button') }}
          </button>

          <!-- Status Message -->
          <div
            v-if="statusMessage"
            :class="[
              'mt-6 p-4 rounded-lg text-center',
              statusType === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            ]"
          >
            {{ statusMessage }}
          </div>

          <!-- Note -->
          <p class="mt-6 text-sm text-ink/60 text-center">
            {{ t('survey.note') }}
          </p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { submitRSVP } from '@/services/api'
import type { RSVPFormData, Locale } from '@/types'

const { t, locale } = useI18n()

const formData = ref<Omit<RSVPFormData, 'locale' | 'source'>>({
  name: '',
  guests: 0,
  diet: '',
  message: '',
})

const isSubmitting = ref(false)
const statusMessage = ref('')
const statusType = ref<'success' | 'error'>('success')

const handleSubmit = async (): Promise<void> => {
  isSubmitting.value = true
  statusMessage.value = ''

  try {
    const data: RSVPFormData = {
      ...formData.value,
      locale: locale.value as Locale,
      source: 'wedding-page-vue',
    }

    const response = await submitRSVP(data)

    if (response.status === 'success') {
      statusType.value = 'success'
      statusMessage.value = t('survey.message.success')

      // Reset form
      formData.value = {
        name: '',
        guests: 0,
        diet: '',
        message: '',
      }
    } else {
      statusType.value = 'error'
      statusMessage.value = response.message || t('survey.message.error')
    }
  } catch (error) {
    statusType.value = 'error'
    statusMessage.value = t('survey.message.offline')
    console.error('RSVP submission error:', error)
  } finally {
    isSubmitting.value = false
  }
}
</script>
