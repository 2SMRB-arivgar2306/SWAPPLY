"use client"

import React, { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { Locale } from "@/lib/i18n"
import { getDict } from "@/lib/i18n"

type LocaleContextType = {
  locale: Locale
  setLocale: (value: Locale) => void
  dict: ReturnType<typeof getDict>
}

const LOCALE_KEY = "swapply_locale"
const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

function isLocale(value: unknown): value is Locale {
  return value === "es" || value === "en" || value === "fr"
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LOCALE_KEY)
      if (isLocale(saved)) {
        setLocaleState(saved)
      }
    } catch {
      // ignore localStorage issues
    }
  }, [])

  const setLocale = (value: Locale) => {
    setLocaleState(value)
    try {
      localStorage.setItem(LOCALE_KEY, value)
    } catch {
      // ignore localStorage issues
    }
  }

  const dict = useMemo(() => getDict(locale), [locale])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  return <LocaleContext.Provider value={{ locale, setLocale, dict }}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider")
  return ctx
}
