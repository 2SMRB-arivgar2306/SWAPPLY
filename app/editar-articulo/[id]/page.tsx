"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Navigation from "@/components/navigation"
import { ArrowLeft } from "lucide-react"
import { useArticles, type Article } from "@/lib/articles-context"

export default function EditarArticuloPage() {
  const router = useRouter()
  const params = useParams()
  const articleId = Number(params.id)
  const { getArticleById, updateArticle } = useArticles()

  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth/login")
    }

    const article = getArticleById(articleId)
    if (article) {
      setFormData(article)
    } else {
      router.push("/mis-articulos")
    }
  }, [router, articleId, getArticleById])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (formData) {
      const { name, value } = e.target
      setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setLoading(true)
    updateArticle(articleId, formData)

    setTimeout(() => {
      router.push("/mis-articulos")
      setLoading(false)
    }, 800)
  }

  if (!user || !formData) {
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

        <h1 className="text-3xl font-bold text-foreground mb-6">Editar artículo</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
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
