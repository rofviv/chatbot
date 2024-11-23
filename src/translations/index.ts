import es from './es'
import en from './en'

export type Language = 'es' | 'en'

class TranslationManager {
  private static instance: TranslationManager
  private currentLanguage: Language = 'es'
  private translations = {
    es,
    en
  }

  static getInstance(): TranslationManager {
    if (!TranslationManager.instance) {
      TranslationManager.instance = new TranslationManager()
    }
    return TranslationManager.instance
  }

  setLanguage(lang: Language) {
    this.currentLanguage = lang
  }

  t(key: string): string {
    const keys = key.split('.')
    let translation: any = this.translations[this.currentLanguage]
    
    for (const k of keys) {
      translation = translation[k]
      if (!translation) return key
    }
    
    return translation
  }
}

export const i18n = TranslationManager.getInstance()