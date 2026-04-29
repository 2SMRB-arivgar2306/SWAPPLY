"use client"

import { useEffect, useMemo, useState } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

export function ThemeToggle() {
  const { dict } = useLocale()
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = useMemo(() => resolvedTheme === "dark", [resolvedTheme])

  if (!mounted) {
    return null
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex items-center justify-between w-full rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground transition hover:bg-secondary/20"
    >
      <span>{isDark ? dict.profile.darkMode : dict.profile.lightMode}</span>
      {isDark ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  )
}
