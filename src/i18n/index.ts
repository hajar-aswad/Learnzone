import { createI18n } from 'vue-i18n'
import en from '../i18n/locales/en'
import ar from '../i18n/locales/ar'

const messages = {
  en,
  ar
}

export const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackLocale: 'en',
  messages,
  globalInjection: true,
  silentTranslationWarn: true,
  missingWarn: false,
  silentFallbackWarn: true
})

export default i18n