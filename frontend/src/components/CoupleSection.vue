<template>
  <section id="couple" class="py-20 bg-gradient-to-b from-white to-primary/5">
    <div class="container mx-auto px-4">
      <!-- Section Header -->
      <div class="text-center mb-16 reveal">
        <p class="text-sm text-primary font-medium mb-2">
          {{ t('couple.section.label') }}
        </p>
        <h2 class="text-3xl md:text-4xl font-serif font-bold text-ink mb-4">
          {{ t('couple.section.heading') }}
        </h2>
        <p class="max-w-2xl mx-auto text-ink/70">
          {{ t('couple.section.description') }}
        </p>
      </div>

      <!-- Cards Grid -->
      <div class="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <!-- Groom Card -->
        <div class="reveal bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <h3 class="text-xl font-serif font-bold text-ink mb-3">
            {{ t('groom.title') }}
          </h3>
          <p class="text-ink/70 mb-4 leading-relaxed">
            {{ t('groom.description') }}
          </p>
          <ul class="space-y-2 text-sm text-ink/60">
            <li class="flex items-start">
              <span class="text-accent mr-2">•</span>
              <span>{{ t('groom.detail1') }}</span>
            </li>
            <li class="flex items-start">
              <span class="text-accent mr-2">•</span>
              <span>{{ t('groom.detail2') }}</span>
            </li>
          </ul>
        </div>

        <!-- Bride Card -->
        <div class="reveal bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
          <div class="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
          </div>
          <h3 class="text-xl font-serif font-bold text-ink mb-3">
            {{ t('bride.title') }}
          </h3>
          <p class="text-ink/70 mb-4 leading-relaxed">
            {{ t('bride.description') }}
          </p>
          <ul class="space-y-2 text-sm text-ink/60">
            <li class="flex items-start">
              <span class="text-accent mr-2">•</span>
              <span>{{ t('bride.detail1') }}</span>
            </li>
            <li class="flex items-start">
              <span class="text-accent mr-2">•</span>
              <span>{{ t('bride.detail2') }}</span>
            </li>
          </ul>
        </div>

        <!-- Story Card -->
        <div class="reveal bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 border border-primary/10">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm">
            <svg class="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" />
            </svg>
          </div>
          <h3 class="text-xl font-serif font-bold text-ink mb-3">
            {{ t('story.title') }}
          </h3>
          <p class="text-ink/70 leading-relaxed">
            {{ t('story.description') }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
