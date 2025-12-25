<template>
  <section id="invitation" class="py-20 bg-gradient-to-b from-white to-accent/5">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12 reveal">
        <p class="text-sm text-accent font-medium mb-2">
          {{ t('invitation.section.title') }}
        </p>
        <h2 class="text-3xl md:text-4xl font-serif font-bold text-ink mb-4">
          {{ t('invitation.section.heading') }}
        </h2>
        <p class="max-w-2xl mx-auto text-ink/70">
          {{ t('invitation.section.description') }}
        </p>
      </div>

      <!-- Invitation Card -->
      <div class="max-w-3xl mx-auto reveal">
        <div class="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <!-- Card Header -->
          <div class="bg-gradient-to-r from-primary to-accent p-8 text-white text-center">
            <svg class="w-16 h-16 mx-auto mb-4 opacity-90" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
            <p class="text-xl font-serif">{{ t('invitation.card.message') }}</p>
          </div>

          <!-- Card Body -->
          <div class="p-8 md:p-12">
            <!-- Letter -->
            <div class="mb-8">
              <p class="text-2xl font-serif text-ink mb-4">
                {{ t('invitation.letter.salutation') }}
              </p>
              <p class="text-ink/80 leading-relaxed">
                {{ t('invitation.letter.body') }}
              </p>
            </div>

            <!-- Event Details -->
            <div class="space-y-4 mb-8 bg-primary/5 rounded-xl p-6">
              <div class="flex items-start">
                <div class="w-20 flex-shrink-0">
                  <span class="text-sm font-medium text-primary">
                    {{ t('invitation.date.label') }}
                  </span>
                </div>
                <span class="text-ink font-medium">
                  {{ t('invitation.date.value') }}
                </span>
              </div>

              <div class="flex items-start">
                <div class="w-20 flex-shrink-0">
                  <span class="text-sm font-medium text-primary">
                    {{ t('invitation.time.label') }}
                  </span>
                </div>
                <span class="text-ink font-medium">
                  {{ t('invitation.time.value') }}
                </span>
              </div>

              <div class="flex items-start">
                <div class="w-20 flex-shrink-0">
                  <span class="text-sm font-medium text-primary">
                    {{ t('invitation.location.label') }}
                  </span>
                </div>
                <span class="text-ink font-medium">
                  {{ t('invitation.location.value') }}
                </span>
              </div>
            </div>

            <!-- Note -->
            <div class="bg-accent/10 rounded-xl p-6 mb-6">
              <p class="text-ink/70 leading-relaxed text-sm">
                {{ t('invitation.card.note') }}
              </p>
            </div>

            <!-- Back to Top Button -->
            <div class="text-center">
              <a
                href="#hero"
                class="inline-block px-8 py-3 bg-gradient-to-r from-primary to-accent text-white font-medium rounded-full hover:shadow-lg transition-all transform hover:scale-105"
              >
                {{ t('invitation.button') }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
