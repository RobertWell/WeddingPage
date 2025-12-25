<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-sm">
    <nav class="container mx-auto px-4 py-3 flex items-center justify-between">
      <!-- Brand -->
      <a href="#hero" class="text-xl font-serif font-semibold text-ink">
        {{ t('nav.brand') }}
      </a>

      <!-- Navigation Links -->
      <div class="hidden md:flex items-center gap-6">
        <a
          v-for="link in navLinks"
          :key="link.key"
          :href="link.href"
          class="text-sm text-ink/70 hover:text-primary transition-colors"
        >
          {{ t(link.key) }}
        </a>
      </div>

      <!-- Controls -->
      <div class="flex items-center gap-3">
        <!-- Language Switcher -->
        <div class="flex gap-1 bg-primary/10 rounded-full p-1">
          <button
            v-for="lang in languages"
            :key="lang.code"
            @click="switchLanguage(lang.code)"
            :class="[
              'px-3 py-1 rounded-full text-xs font-medium transition-all',
              locale === lang.code
                ? 'bg-primary text-white'
                : 'text-ink/60 hover:text-ink'
            ]"
          >
            {{ lang.label }}
          </button>
        </div>

        <!-- Theme Switcher -->
        <div class="flex gap-1 bg-accent/10 rounded-full p-1">
          <button
            v-for="theme in themes"
            :key="theme"
            @click="setTheme(theme)"
            :class="[
              'w-8 h-8 rounded-full transition-all border-2',
              currentTheme === theme
                ? 'border-ink scale-110'
                : 'border-transparent opacity-70 hover:opacity-100'
            ]"
            :style="{ backgroundColor: getThemeColor(theme) }"
            :title="theme"
          />
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
import type { Theme, Locale } from '@/types'

const { t, locale } = useI18n()
const { currentTheme, setTheme, themeConfigs } = useTheme()

const navLinks = [
  { key: 'nav.link.couple', href: '#couple' },
  { key: 'nav.link.location', href: '#location' },
  { key: 'nav.link.survey', href: '#survey' },
  { key: 'nav.link.invitation', href: '#invitation' },
]

const languages = computed(() => [
  { code: 'zh' as Locale, label: t('lang.zhLabel') },
  { code: 'en' as Locale, label: t('lang.enLabel') },
])

const themes: Theme[] = ['spring', 'khaki', 'breeze']

const switchLanguage = (lang: Locale): void => {
  locale.value = lang
  localStorage.setItem('wedding-locale', lang)
}

const getThemeColor = (theme: Theme): string => {
  const config = themeConfigs[theme]
  return `rgb(${config.colors.primary})`
}
</script>
