"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Header from "@/components/header"
import { Trash2, Edit2 } from "lucide-react"
import { useArticles } from "@/lib/articles-context"

export default function MisArticulosPage() {
  const router = useRouter()
  const { articles, deleteArticle } = useArticles()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handleDelete = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este artículo?")) {
      deleteArticle(id)
    }
  }

  const handleEdit = (id: number) => {
    router.push(`/editar-articulo/${id}`)
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16">
      <Navigation />
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Mis Artículos</h1>
        <p className="text-muted-foreground mb-8">{articles.length} artículos publicados</p>

        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {articles.map((article) => (
              <div key={article.id} className="bg-card border border-border rounded-xl overflow-hidden">
                <div className="h-40 bg-secondary/20">
                  <img
                    src={article.image || "/placeholder.svg"}
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2">{article.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    Condición: <span className="font-medium text-foreground">{article.condition}</span>
                  </p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Busca: <span className="font-medium text-foreground">{article.wantsFor}</span>
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(article.id)}
                      className="flex-1 bg-accent text-accent-foreground py-2 rounded-lg text-sm font-semibold hover:bg-accent/90 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit2 size={14} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 size={14} />
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">No has publicado artículos aún</p>
          </div>
        )}
      </div>
    </main>
  )
}
