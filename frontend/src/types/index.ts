export type Theme = 'spring' | 'khaki' | 'breeze'

export type Locale = 'zh' | 'en'

export interface ThemeConfig {
  name: Theme
  colors: {
    primary: string
    accent: string
    ink: string
  }
  leafOpacity: number
}

export interface RSVPFormData {
  name: string
  guests: number
  diet: string
  message: string
  locale: Locale
  source: string
}

export interface RSVPResponse {
  status: 'success' | 'error'
  message?: string
}

export interface ConfigData {
  [key: string]: {
    zh: string
    en: string
  }
}
