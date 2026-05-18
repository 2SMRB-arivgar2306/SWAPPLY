"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { useFavorites } from "@/lib/favorites-context"

const cityCoordinates: Record<string, { lat: number; lon: number }> = {
  Madrid: { lat: 40.4168, lon: -3.7038 },
  Barcelona: { lat: 41.3851, lon: 2.1734 },
  Valencia: { lat: 39.4699, lon: -0.3763 },
  Sevilla: { lat: 37.3891, lon: -5.9845 },
  Zaragoza: { lat: 41.6488, lon: -0.8891 },
  Málaga: { lat: 36.7213, lon: -4.4214 },
  Murcia: { lat: 37.9922, lon: -1.1307 },
  Palma: { lat: 39.5696, lon: 2.6502 },
  "Las Palmas": { lat: 28.1235, lon: -15.4363 },
  Bilbao: { lat: 43.2630, lon: -2.9350 },
  Alicante: { lat: 38.3452, lon: -0.4810 },
  Córdoba: { lat: 37.8882, lon: -4.7794 },
  Granada: { lat: 37.1773, lon: -3.5986 },
  Valladolid: { lat: 41.6523, lon: -4.7245 },
  Vigo: { lat: 42.2406, lon: -8.7207 },
  Gijón: { lat: 43.5322, lon: -5.6611 },
  Oviedo: { lat: 43.3619, lon: -5.8494 },
}

function toRadians(value: number) {
  return (value * Math.PI) / 180
}

function getDistanceBetweenCities(cityA: string, cityB: string) {
  const coordsA = cityCoordinates[cityA]
  const coordsB = cityCoordinates[cityB]
  if (!coordsA || !coordsB) return null

  const earthRadiusKm = 6371
  const dLat = toRadians(coordsB.lat - coordsA.lat)
  const dLon = toRadians(coordsB.lon - coordsA.lon)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(coordsA.lat)) * Math.cos(toRadians(coordsB.lat)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return earthRadiusKm * c
}

export default function ProductCard({ product }) {
  const router = useRouter()
  const { isFavorite, addFavorite, removeFavorite } = useFavorites()
  const [isFav, setIsFav] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [userLocation, setUserLocation] = useState<string>("")

  useEffect(() => {
    const cachedUser = localStorage.getItem("user")
    if (cachedUser) {
      const currentUser = JSON.parse(cachedUser)
      setUserLocation(currentUser.location || "")
      setIsFav(isFavorite(product.id))
    }
  }, [product.id, isFavorite])

  const distanceKm = userLocation && product.location ? getDistanceBetweenCities(userLocation, product.location) : null

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
  }

  const handleContact = async () => {
    if (!product.userId) {
      router.push(`/chats?user=${product.user}`)
      return
    }

    const cachedUser = localStorage.getItem("user")
    if (!cachedUser) {
      router.push("/auth/login")
      return
    }
    const myUser = JSON.parse(cachedUser)

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: myUser.id,
          otherUserId: product.userId,
          name: product.user,
          avatar: "👤",
          initialMessage: `Hola, me interesa tu ${product.title}. ¿Sigues disponible para intercambiar?`,
        }),
      })

      if (res.ok) {
        router.push(`/chats?user=${product.userId || product.user}`)
      }
    } catch (e) {
      console.error(e)
      router.push(`/chats`)
    }
  }

  const handleProductClick = () => {
    setShowDetails(true)
  }

  return (
    <>
      <div className="bg-card rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300 group cursor-pointer">
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

          <div className="absolute bottom-3 left-3 bg-accent text-accent-foreground text-xs font-medium px-2 py-1 rounded">
            {product.condition}
          </div>
          {product.sellerPlan === "premium" && (
            <div className="absolute top-3 left-3 bg-yellow-400 text-zinc-950 text-[11px] font-semibold px-2 py-1 rounded">
              Premium
            </div>
          )}
        </div>

        <div className="p-4" onClick={handleProductClick}>
          <div className="flex items-center justify-between gap-3 mb-2">
            <h3 className="font-semibold text-foreground text-sm line-clamp-2">{product.title}</h3>
            {product.price > 0 && <span className="text-sm font-semibold text-accent">€{product.price}</span>}
          </div>

          <p className="text-xs text-muted-foreground mb-2">
            📍 {product.location} {distanceKm ? `· ${distanceKm.toFixed(0)} km` : ""}
          </p>

          <div className="mb-3 p-2 bg-muted rounded border border-border">
            <p className="text-xs text-muted-foreground font-medium">Intercambia por:</p>
            <p className="text-xs text-foreground font-semibold line-clamp-1">{product.wantsFor}</p>
          </div>

          <p className="text-xs text-muted-foreground mb-3">@{product.user}</p>
        </div>

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

      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetails(false)}>
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-border bg-card">
              <h2 className="text-xl font-bold text-foreground">Detalles del artículo</h2>
              <button onClick={() => setShowDetails(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                ✕
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="w-full">
                <img
                  src={product.image || "/placeholder.svg"}
                  alt={product.title}
                  className="w-full h-96 object-cover rounded-lg"
                />
              </div>

              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">{product.title}</h1>
                <p className="text-muted-foreground">@{product.user}</p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Precio</p>
                  <p className="font-semibold text-foreground">€{product.price}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Ubicación</p>
                  <p className="font-semibold text-foreground">{product.location}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Condición</p>
                  <p className="font-semibold text-foreground capitalize">{product.condition.replace("-", " ")}</p>
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Categoría</p>
                  <p className="font-semibold text-foreground capitalize">{product.category}</p>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-2">Descripción</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              {product.features && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Características</p>
                  <p className="font-semibold text-foreground">{product.features}</p>
                </div>
              )}

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
