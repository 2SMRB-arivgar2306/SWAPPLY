"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface Favorite {
  id: number
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
  removeFavorite: (id: number) => void
  isFavorite: (id: number) => boolean
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined)

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Favorite[]>([])

  useEffect(() => {
    const stored = localStorage.getItem("swapply_favorites")
    if (stored) {
      try {
        setFavorites(JSON.parse(stored))
      } catch {
        console.log("[v0] Error al cargar favoritos")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("swapply_favorites", JSON.stringify(favorites))
  }, [favorites])

  const addFavorite = (product: Favorite) => {
    if (!isFavorite(product.id)) {
      setFavorites([...favorites, product])
    }
  }

  const removeFavorite = (id: number) => {
    setFavorites(favorites.filter((fav) => fav.id !== id))
  }

  const isFavorite = (id: number) => {
    return favorites.some((fav) => fav.id === id)
  }

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
