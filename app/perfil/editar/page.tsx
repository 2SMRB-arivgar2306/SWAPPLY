"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { ArrowLeft } from "lucide-react"

export default function EditarPerfilPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    bio: "",
    location: "",
    avatar: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      // Fetch full profile from MongoDB
      fetchProfile(userData.id)
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const fetchProfile = async (userId: string) => {
    try {
      const res = await fetch(`/api/users/${userId}`)
      if (res.ok) {
        const data = await res.json()
        setFormData({
          name: data.name || "",
          email: data.email || "",
          bio: data.bio || "",
          location: data.location || "",
          avatar: data.avatar || "",
        })
      }
    } catch (err) {
      console.error("Error fetching profile:", err)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      setError("Por favor selecciona una imagen válida.")
      return
    }
    if (file.size > 1_500_000) {
      setError("La imagen es demasiado grande. Usa una imagen menor a 1.5 MB.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result
      if (typeof result === "string") {
        setFormData((prev) => ({ ...prev, avatar: result }))
        setError("")
      }
    }
    reader.readAsDataURL(file)
  }

  const handleAvatarUpload = () => {
    fileInputRef.current?.click()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      const res = await fetch(`/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          bio: formData.bio,
          location: formData.location,
          avatar: formData.avatar,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || "Error al actualizar el perfil")
      }

      const updatedUser = await res.json()

      // Update localStorage with new data
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}")
      localStorage.setItem("user", JSON.stringify({
        ...storedUser,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        location: updatedUser.location,
        avatar: updatedUser.avatar,
      }))

      setSuccess("Perfil actualizado correctamente")
      setTimeout(() => {
        router.push("/perfil")
      }, 800)
    } catch (err: any) {
      setError(err.message || "Error al guardar los cambios")
    } finally {
      setLoading(false)
    }
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

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex gap-4">
            {formData.avatar && (
              <img src={formData.avatar} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-border" />
            )}
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-2">Foto de perfil</label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarFileChange}
              />
              <button
                type="button"
                onClick={handleAvatarUpload}
                className="w-full bg-accent/10 border border-accent/20 hover:bg-accent/20 text-accent font-semibold py-3 rounded-lg transition-colors"
              >
                Seleccionar imagen
              </button>
              <p className="mt-2 text-xs text-muted-foreground">
                Selecciona una imagen para tu avatar. La foto se almacenará directamente en tu perfil.
              </p>
            </div>
          </div>

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
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
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
            <select
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            >
              <option value="">Selecciona tu ciudad</option>
              <option value="Madrid">Madrid</option>
              <option value="Barcelona">Barcelona</option>
              <option value="Valencia">Valencia</option>
              <option value="Sevilla">Sevilla</option>
              <option value="Zaragoza">Zaragoza</option>
              <option value="Málaga">Málaga</option>
              <option value="Murcia">Murcia</option>
              <option value="Palma">Palma</option>
              <option value="Las Palmas">Las Palmas</option>
              <option value="Bilbao">Bilbao</option>
              <option value="Alicante">Alicante</option>
              <option value="Córdoba">Córdoba</option>
              <option value="Granada">Granada</option>
              <option value="Oviedo">Oviedo</option>
            </select>
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
