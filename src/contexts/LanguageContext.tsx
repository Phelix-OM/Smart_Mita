"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import * as Localization from "expo-localization"
import { I18n } from "i18n-js"
import en from "../localization/en"
import sw from "../localization/sw"

type LanguageContextType = {
  locale: string
  setLocale: (locale: string) => void
  hasSelectedLanguage: boolean
  i18n: I18n
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState("en")
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false)

  const i18n = new I18n({
    en,
    sw,
  })

  i18n.locale = locale
  i18n.enableFallback = true

  useEffect(() => {
    // Load saved language preference
    const loadLanguage = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem("userLanguage")
        if (savedLocale) {
          setLocale(savedLocale)
          setHasSelectedLanguage(true)
          console.log("Loaded saved locale:", savedLocale)
        } else {
          // Use device locale as default, but only if it's one of our supported languages
          const deviceLocale = Localization.locale.split("-")[0]
          if (deviceLocale === "sw") {
            setLocale("sw")
          } else {
            setLocale("en") // Default to English
          }
          setHasSelectedLanguage(false)
          console.log("Using device locale:", deviceLocale)
        }
      } catch (error) {
        console.error("Failed to load language preference:", error)
      }
    }

    loadLanguage()
  }, [])

  const changeLocale = async (newLocale: string) => {
    try {
      await AsyncStorage.setItem("userLanguage", newLocale)
      setLocale(newLocale)
      setHasSelectedLanguage(true)
      console.log("Changed locale to:", newLocale)
    } catch (error) {
      console.error("Failed to save language preference:", error)
    }
  }

  return (
    <LanguageContext.Provider
      value={{
        locale,
        setLocale: changeLocale,
        hasSelectedLanguage,
        i18n,
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

