"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Header from "@/components/header"
import { Heart } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"

export default function FavoritesPage() {
  const router = useRouter()
  const { favorites, removeFavorite } = useFavorites()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleRemoveFavorite = (id: number) => {
    removeFavorite(id)
  }

  const handleContact = (user: string) => {
    router.push(`/chats?user=${user}`)
  }

  const handleViewMore = (id: number) => {
    router.push(`/producto/${id}`)
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16">
      <Navigation />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Favoritos</h1>
        <p className="text-muted-foreground mb-8">{favorites.length} artículos guardados</p>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48 bg-secondary/20">
                  <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => handleRemoveFavorite(item.id)}
                    className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                  >
                    <Heart size={20} className="fill-red-500 text-red-500" />
                  </button>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                  <div className="space-y-2 text-sm">
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Condición:</span> {item.condition}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Busca:</span> {item.seeking}
                    </p>
                    <p className="text-muted-foreground">
                      <span className="font-medium text-foreground">Ubicación:</span> {item.location}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex gap-2">
                    <button
                      onClick={() => handleContact(item.user)}
                      className="flex-1 bg-accent text-accent-foreground py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors"
                    >
                      Contactar
                    </button>
                    <button
                      onClick={() => handleViewMore(item.id)}
                      className="flex-1 bg-secondary/20 text-foreground py-2 rounded-lg text-sm font-semibold hover:bg-secondary/30 transition-colors"
                    >
                      Ver más
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Heart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <p className="text-muted-foreground text-lg">No tienes favoritos aún</p>
            <p className="text-sm text-muted-foreground mt-2">Guarda tus artículos favoritos para verlos después</p>
          </div>
        )}
      </div>
    </main>
  )
}
