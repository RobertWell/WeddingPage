<template>
  <section
    id="hero"
    class="relative min-h-screen flex items-center justify-center text-white"
    :style="heroStyle"
  >
    <!-- Overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50"></div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-4 py-20 text-center">
      <!-- Tagline -->
      <p class="text-sm md:text-base tracking-widest mb-4 animate-fade-in">
        {{ t('hero.tagline') }}
      </p>

      <!-- Names -->
      <h1 class="text-5xl md:text-7xl font-serif font-bold mb-6 animate-float">
        {{ t('hero.names') }}
      </h1>

      <!-- Description -->
      <p class="max-w-2xl mx-auto text-base md:text-lg leading-relaxed mb-8 opacity-90">
        {{ t('hero.description') }}
      </p>

      <!-- Date/Time -->
      <p class="text-sm md:text-base mb-8 opacity-80">
        {{ t('hero.datetime') }}
      </p>

      <!-- Badges -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <span
          v-for="(badge, index) in badges"
          :key="index"
          class="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm border border-white/30"
        >
          {{ badge }}
        </span>
      </div>

      <!-- CTA Buttons -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href="#invitation"
          class="px-8 py-3 bg-white text-primary font-medium rounded-full hover:bg-white/90 transition-all transform hover:scale-105"
        >
          {{ t('hero.ctaPrimary') }}
        </a>
        <a
          href="#survey"
          class="px-8 py-3 bg-primary/20 backdrop-blur-sm text-white font-medium rounded-full border-2 border-white/50 hover:bg-primary/30 transition-all"
        >
          {{ t('hero.ctaSecondary') }}
        </a>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
      <svg
        class="w-6 h-6 text-white"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const heroStyle = computed(() => ({
  backgroundImage: `url('/src/assets/images/forest-hero.jpg')`,
  backgroundSize: 'cover',
  backgroundPosition: '50% 50%',
}))

const badges = computed(() => [
  t('hero.badge1'),
  t('hero.badge2'),
  t('hero.badge3'),
])
</script>
