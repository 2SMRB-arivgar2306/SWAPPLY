"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { LogOut, User } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  // Handlers for profile buttons
  const handleEditProfile = () => {
    router.push("/perfil/editar")
  }

  const handleMyItems = () => {
    router.push("/mis-articulos")
  }

  const handleFavorites = () => {
    router.push("/favorites")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16">
      <Navigation />

      <div className="max-w-2xl mx-auto p-4 md:p-6">
        {/* Perfil Header */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-center">
          <div className="w-24 h-24 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={48} className="text-accent" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">{user.name || user.email}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent">24</div>
            <p className="text-xs text-muted-foreground mt-1">Intercambios</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent">4.8</div>
            <p className="text-xs text-muted-foreground mt-1">Valoración</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-accent">142</div>
            <p className="text-xs text-muted-foreground mt-1">Artículos</p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleEditProfile}
            className="w-full bg-card border border-border hover:bg-secondary/10 text-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            Editar Perfil
          </button>
          <button
            onClick={handleMyItems}
            className="w-full bg-card border border-border hover:bg-secondary/10 text-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            Mis Artículos
          </button>
          <button
            onClick={handleFavorites}
            className="w-full bg-card border border-border hover:bg-secondary/10 text-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            Favoritos
          </button>
          <button
            onClick={handleLogout}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </main>
  )
}
