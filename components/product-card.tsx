"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"

export default function ProductCard({ product }) {
  const router = useRouter()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [isFav, setIsFav] = useState(isFavorite(product.id))
  const [showDetails, setShowDetails] = useState(false)

  const handleFavorite = () => {
    if (isFav) {
      removeFavorite(product.id)
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        image: product.image,
        condition: product.condition,
        category: product.category,
        seeking: product.wantsFor,
        user: product.user,
        location: product.location,
      })
    }
    setIsFav(!isFav)
    router.push("/favorites")
  }

  const handleContact = () => {
    const chatsStorage = localStorage.getItem("swapply_chats")
    const chats = chatsStorage ? JSON.parse(chatsStorage) : []

    const chatExists = chats.find((c: any) => c.userId === product.user)

    if (!chatExists) {
      const newChat = {
        id: Date.now(),
        userId: product.user,
        name: product.user,
        avatar: "👤",
        lastMessage: `Interesado en: ${product.title}`,
        lastTime: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        unread: 0,
        messages: [
          {
            id: 1,
            sender: "me",
            text: `Hola, me interesa tu ${product.title}. ¿Sigues disponible para intercambiar?`,
            time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
          },
        ],
        productId: product.id,
      }
      chats.push(newChat)
      localStorage.setItem("swapply_chats", JSON.stringify(chats))
    }

    router.push(`/chats?user=${product.user}`)
  }

  const handleProductClick = () => {
    setShowDetails(true)
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
        {/* Imagen del producto */}
        <div className="relative h-40 bg-muted overflow-hidden" onClick={handleProductClick}>
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />

          <button
            onClick={(e) => {
              e.stopPropagation()
              handleFavorite()
            }}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
          >
            <Heart size={18} className={`${isFav ? "fill-accent stroke-accent" : "stroke-foreground"}`} />
          </button>

          {/* Badge de condición */}
          <div className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
            {product.condition}
          </div>
        </div>

        {/* Contenido */}
        <div className="p-4" onClick={handleProductClick}>
          {/* Título */}
          <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-2">{product.title}</h3>

          {/* Ubicación */}
          <p className="text-xs text-muted-foreground mb-3">📍 {product.location}</p>

          {/* Lo que quiere */}
          <div className="mb-3 p-2 bg-muted rounded border border-border">
            <p className="text-xs text-muted-foreground font-medium">Intercambia por:</p>
            <p className="text-xs text-foreground font-semibold line-clamp-1">{product.wantsFor}</p>
          </div>

          {/* Usuario */}
          <p className="text-xs text-muted-foreground mb-3">@{product.user}</p>
        </div>

        {/* Botones de acción */}
        <div className="px-4 pb-4">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleContact()
            }}
            className="w-full bg-accent text-accent-foreground text-sm font-medium py-2 rounded-lg hover:bg-accent/90 transition-colors"
          >
            Contactar
          </button>
        </div>
      </div>

      {/* Modal de detalles del producto */}
      {showDetails && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowDetails(false)}
        >
          <div
            className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">Detalles del artículo</h2>
              <button
                onClick={() => setShowDetails(false)}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Imagen grande */}
              <div className="w-full">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              {/* Información principal */}
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
                <p className="text-muted-foreground">@{product.user}</p>
              </div>

              {/* Descripción */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {/* Detalles en grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Condición</p>
                  <p className="font-semibold text-foreground capitalize">{product.condition.replace("-", " ")}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Categoría</p>
                  <p className="font-semibold text-foreground capitalize">{product.category}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Ubicación</p>
                  <p className="font-semibold text-foreground">📍 {product.location}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Intercambia por</p>
                  <p className="font-semibold text-foreground">{product.wantsFor}</p>
                </div>
              </div>

              {/* Información del vendedor */}
              <div className="bg-secondary/20 p-4 rounded-lg border border-border">
                <h3 className="font-semibold text-foreground mb-3">Información del vendedor</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Nombre de usuario: <span className="font-semibold text-foreground">@{product.user}</span>
                </p>
                <button
                  onClick={() => {
                    handleContact()
                    setShowDetails(false)
                  }}
                  className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-lg hover:bg-accent/90 transition-colors"
                >
                  Contactar ahora
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
