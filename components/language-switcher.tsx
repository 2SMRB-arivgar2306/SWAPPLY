"use client"

import type React from "react"
import { useLocale } from "@/lib/locale-context"
import { LOCALES, type Locale } from "@/lib/i18n"

export function LanguageSwitcher() {
  const { locale, setLocale, dict } = useLocale()

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const next = event.target.value as Locale
    if (next === "es" || next === "en" || next === "fr") {
      setLocale(next)
    }
  }

  return (
    <label className="flex flex-col gap-2 text-sm text-foreground">
      <span className="font-medium text-muted-foreground">{dict.profile.language}</span>
      <select
        value={locale}
        onChange={handleChange}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-accent"
      >
        {LOCALES.map((item) => (
          <option key={item.id} value={item.id}>
            {item.label}
          </option>
        ))}
      </select>
    </label>
  )
}
