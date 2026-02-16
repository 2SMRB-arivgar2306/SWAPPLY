"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect, useCallback } from "react"

interface Favorite {
  id: number | string
  title: string
  image: string
  condition: string
  category: string
  seeking: string
  user: string
  location: string
}

interface FavoritesContextType {
  favorites: Favorite[]
  addFavorite: (product: Favorite) => void
  removeFavorite: (id: number | string) => void
  isFavorite: (id: number | string) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([])
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const user = JSON.parse(stored)
        setUserId(user.id)
      } catch {
        console.log("[SWAPPLY] Error reading user from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchFavorites()
    }
  }, [userId])

  const fetchFavorites = async () => {
    if (!userId) return
    try {
      const res = await fetch(`/api/favorites?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setFavorites(data)
      }
    } catch (error) {
      console.error("[SWAPPLY] Error fetching favorites:", error)
    }
  }

  const addFavorite = useCallback(async (product: Favorite) => {
    if (!userId) return
    // Optimistic update
    setFavorites((prev) => {
      if (prev.some((fav) => String(fav.id) === String(product.id))) return prev
      return [...prev, product]
    })

    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          articleId: String(product.id),
          title: product.title,
          image: product.image,
          condition: product.condition,
          category: product.category,
          seeking: product.seeking,
          user: product.user,
          location: product.location,
        }),
      })
    } catch (error) {
      console.error("[SWAPPLY] Error adding favorite:", error)
      // Rollback on error
      setFavorites((prev) => prev.filter((fav) => String(fav.id) !== String(product.id)))
    }
  }, [userId])

  const removeFavorite = useCallback(async (id: number | string) => {
    if (!userId) return
    const prevFavorites = favorites

    // Optimistic update
    setFavorites((prev) => prev.filter((fav) => String(fav.id) !== String(id)))

    try {
      await fetch(`/api/favorites?userId=${userId}&articleId=${String(id)}`, {
        method: "DELETE",
      })
    } catch (error) {
      console.error("[SWAPPLY] Error removing favorite:", error)
      // Rollback on error
      setFavorites(prevFavorites)
    }
  }, [userId, favorites])

  const isFavorite = useCallback((id: number | string) => {
    return favorites.some((fav) => String(fav.id) === String(id))
  }, [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites debe usarse dentro de FavoritesProvider")
  }
  return context
}
