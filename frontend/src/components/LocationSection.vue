<template>
  <section id="location" class="py-20 bg-white">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-12 reveal">
        <p class="text-sm text-primary font-medium mb-2">
          {{ t('location.section.heading') }}
        </p>
        <h2 class="text-3xl md:text-4xl font-serif font-bold text-ink mb-4">
          {{ t('location.section.title') }}
        </h2>
        <p class="max-w-2xl mx-auto text-ink/70">
          {{ t('location.section.description') }}
        </p>
      </div>

      <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-12">
        <!-- Venue Info -->
        <div class="reveal">
          <div class="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 h-full">
            <!-- Venue Image -->
            <div class="mb-6 rounded-xl overflow-hidden">
              <img
                src="/src/assets/images/forest-path.jpg"
                alt="Venue"
                class="w-full h-48 object-cover"
              />
            </div>

            <!-- Venue Details -->
            <h3 class="text-2xl font-serif font-bold text-ink mb-2">
              {{ t('venue.name') }}
            </h3>
            <p class="text-ink/70 mb-6">{{ t('venue.address') }}</p>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <a
                :href="t('map.url')"
                target="_blank"
                rel="noopener noreferrer"
                class="flex-1 px-6 py-3 bg-primary text-white rounded-full text-center font-medium hover:bg-primary/90 transition-colors"
              >
                {{ t('location.button.map') }}
              </a>
              <a
                href="#survey"
                class="flex-1 px-6 py-3 bg-white border-2 border-primary text-primary rounded-full text-center font-medium hover:bg-primary/5 transition-colors"
              >
                {{ t('location.button.rsvp') }}
              </a>
            </div>
          </div>
        </div>

        <!-- Transportation -->
        <div class="reveal">
          <div class="bg-white border border-ink/10 rounded-2xl p-8 h-full">
            <h3 class="text-xl font-serif font-bold text-ink mb-6 flex items-center">
              <svg class="w-6 h-6 mr-2 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ t('transport.title') }}
            </h3>

            <ul class="space-y-4 mb-6">
              <li
                v-for="(item, index) in transportItems"
                :key="index"
                class="flex items-start"
              >
                <span class="inline-block w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span class="text-ink/80 leading-relaxed">{{ item }}</span>
              </li>
            </ul>

            <div class="bg-accent/10 rounded-xl p-4">
              <p class="text-sm text-ink/70 leading-relaxed">
                {{ t('transport.note') }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const transportItems = computed(() => [
  t('transport.item1'),
  t('transport.item2'),
  t('transport.item3'),
])
</script>
