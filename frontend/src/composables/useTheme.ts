import { ref, onMounted } from 'vue'
import type { Theme, ThemeConfig } from '@/types'

const THEME_STORAGE_KEY = 'wedding-theme'

const themeConfigs: Record<Theme, ThemeConfig> = {
  spring: {
    name: 'spring',
    colors: {
      primary: '34, 139, 92',
      accent: '214, 180, 138',
      ink: '68, 74, 60',
    },
    leafOpacity: 0.15,
  },
  khaki: {
    name: 'khaki',
    colors: {
      primary: '126, 88, 48',
      accent: '146, 186, 150',
      ink: '93, 66, 38',
    },
    leafOpacity: 0.12,
  },
  breeze: {
    name: 'breeze',
    colors: {
      primary: '56, 132, 255',
      accent: '236, 72, 153',
      ink: '71, 85, 105',
    },
    leafOpacity: 0.1,
  },
}

export const useTheme = () => {
  const currentTheme = ref<Theme>('spring')

  const getStoredTheme = (): Theme | null => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    return stored && (stored === 'spring' || stored === 'khaki' || stored === 'breeze')
      ? stored
      : null
  }

  const storeTheme = (theme: Theme): void => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
  }

  const applyTheme = (theme: Theme): void => {
    const config = themeConfigs[theme]
    const root = document.documentElement

    // Remove all theme classes
    root.classList.remove('theme-spring', 'theme-khaki', 'theme-breeze')

    // Add new theme class
    root.classList.add(`theme-${theme}`)

    // Update CSS variables
    root.style.setProperty('--color-primary', config.colors.primary)
    root.style.setProperty('--color-accent', config.colors.accent)
    root.style.setProperty('--color-ink', config.colors.ink)
    root.style.setProperty('--leaf-opacity', config.leafOpacity.toString())

    currentTheme.value = theme
    storeTheme(theme)
  }

  const initializeTheme = (): void => {
    const storedTheme = getStoredTheme()
    applyTheme(storedTheme || 'spring')
  }

  const setTheme = (theme: Theme): void => {
    applyTheme(theme)
  }

  onMounted(() => {
    initializeTheme()
  })

  return {
    currentTheme,
    setTheme,
    themeConfigs,
  }
}
