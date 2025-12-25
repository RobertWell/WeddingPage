import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import './style.css'
import zh from './locales/zh.json'
import en from './locales/en.json'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('wedding-locale') || 'zh',
  fallbackLocale: 'zh',
  messages: {
    zh,
    en,
  },
})

const app = createApp(App)
app.use(i18n)
app.mount('#app')
