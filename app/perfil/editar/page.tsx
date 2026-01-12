"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { ArrowLeft } from "lucide-react"

export default function EditarPerfilPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        bio: "",
        location: "",
      })
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const updatedUser = { ...user, ...formData }
    localStorage.setItem("user", JSON.stringify(updatedUser))

    setTimeout(() => {
      router.push("/perfil")
      setLoading(false)
    }, 800)
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16">
      <Navigation />

      <div className="max-w-2xl mx-auto p-4 md:p-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-accent hover:text-accent/80 mb-6 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver
        </button>

        <h1 className="text-3xl font-bold text-foreground mb-6">Editar Perfil</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled
              className="w-full px-4 py-3 bg-card border border-border rounded-lg opacity-50 cursor-not-allowed"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Cuéntanos sobre ti"
              rows={4}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
              Ubicación
            </label>
            <input
              id="location"
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Tu ciudad"
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Guardando..." : "Guardar cambios"}
          </button>
        </form>
      </div>
    </main>
  )
}
