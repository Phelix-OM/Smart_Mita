"use client"

import { useLanguage } from "../contexts/LanguageContext"

export const useTranslation = () => {
  const { i18n } = useLanguage()

  return {
    t: (key: string, options?: object) => i18n.t(key, options),
  }
}

