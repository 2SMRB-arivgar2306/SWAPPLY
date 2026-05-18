"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { ArrowLeft } from "lucide-react"
import { useArticles } from "@/lib/articles-context"

export default function PublicarPage() {
  const router = useRouter()
  const { addArticle } = useArticles()
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    condition: "",
    wantsFor: "",
    image: "",
    price: "",
    location: "",
    features: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setImagePreview(base64String)
        setFormData((prev) => ({ ...prev, image: base64String }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      setError("Debes iniciar sesión para publicar")
      return
    }

    setLoading(true)
    setError("")

    const saved = await addArticle({
      userId: user.id,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      condition: formData.condition,
      wantsFor: formData.wantsFor,
      image: formData.image || "/placeholder.svg",
      price: parseFloat(formData.price) || 0,
      location: formData.location,
      features: formData.features,
      sellerPlan: user.plan || "free",
    })

    if (saved) {
      router.push("/mis-articulos")
    } else {
      setError("No se pudo guardar el artículo en la base de datos")
    }

    setLoading(false)
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

        <h1 className="text-3xl font-bold text-foreground mb-6">Publicar artículo</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-foreground mb-2">
              Foto del artículo
            </label>
            <div className="relative border-2 border-dashed border-accent/40 rounded-lg p-6 hover:border-accent/60 transition-colors cursor-pointer">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {imagePreview ? (
                <div className="text-center">
                  <img
                    src={imagePreview || "/placeholder.svg"}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg mx-auto mb-3"
                  />
                  <p className="text-sm text-foreground font-medium">Imagen seleccionada</p>
                  <p className="text-xs text-muted-foreground">Haz clic para cambiar</p>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-sm text-foreground font-medium">Haz clic o arrastra una imagen</p>
                  <p className="text-xs text-muted-foreground">JPG, PNG o WebP</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
              Título del artículo
            </label>
            <input
              id="title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: Bicicleta de montaña"
              required
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe el estado y características del artículo"
              rows={4}
              required
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                Categoría
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              >
                <option value="">Selecciona una categoría</option>
                <option value="electronica">Electrónica</option>
                <option value="deportes">Deportes</option>
                <option value="ropa">Ropa</option>
                <option value="libros">Libros</option>
                <option value="muebles">Muebles</option>
              </select>
            </div>

            <div>
              <label htmlFor="condition" className="block text-sm font-medium text-foreground mb-2">
                Condición
              </label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              >
                <option value="">Selecciona la condición</option>
                <option value="como-nueva">Como nueva</option>
                <option value="buen-estado">Buen estado</option>
                <option value="estado-normal">Estado normal</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="wantsFor" className="block text-sm font-medium text-foreground mb-2">
              ¿Por qué te gustaría intercambiarlo?
            </label>
            <input
              id="wantsFor"
              type="text"
              name="wantsFor"
              value={formData.wantsFor}
              onChange={handleChange}
              placeholder="Ej: Busco videojuegos"
              required
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                Ciudad
              </label>
              <select
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              >
                <option value="">Selecciona la ciudad</option>
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
                <option value="Valladolid">Valladolid</option>
                <option value="Vigo">Vigo</option>
                <option value="Gijón">Gijón</option>
                <option value="Granada">Granada</option>
              </select>
            </div>

            <div>
              <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                Precio
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                value={formData.price}
                onChange={handleChange}
                placeholder="Ej: 10"
                className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              />
            </div>
          </div>

          <div>
            <label htmlFor="features" className="block text-sm font-medium text-foreground mb-2">
              Características
            </label>
            <textarea
              id="features"
              name="features"
              value={formData.features}
              onChange={handleChange}
              placeholder="Añade detalles como color, tamaño, marca o cualquier característica relevante"
              rows={3}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-3 rounded-lg transition-colors"
          >
            {loading ? "Publicando..." : "Publicar artículo"}
          </button>
        </form>
      </div>
    </main>
  )
}
