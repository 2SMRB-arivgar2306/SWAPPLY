"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

const plans = [
  {
    id: "free",
    name: "Gratis",
    priceLabel: "0€",
    description: "Aplicación base sin funciones exclusivas.",
    features: [
      "Búsqueda básica",
      "Crear anuncios",
      "Ver artículos disponibles"
    ],
    cta: "Usar plan gratis"
  },
  {
    id: "medio",
    name: "Plan medio",
    priceLabel: "10€/mes",
    description: "Búsquedas más específicas y mejor experiencia.",
    features: [
      "Filtrar por ciudad y condición",
      "Ver distancia aproximada",
      "Seguro en productos perdidos"
    ],
    cta: "Elegir plan medio"
  },
  {
    id: "premium",
    name: "Plan premium",
    priceLabel: "20€/mes",
    description: "Mejor visibilidad, envíos gratis y filtros avanzados.",
    features: [
      "Búsqueda totalmente personalizada",
      "Productos destacados en el homepage",
      "Envíos gratis y seguro de productos perdidos"
    ],
    cta: "Elegir plan premium"
  }
]

export default function SelectPlanPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/auth/login")
      return
    }

    const parsed = JSON.parse(storedUser)
    setUser(parsed)
    if (!parsed.isVerified) {
      router.push('/auth/verify-email')
      return
    }

    if (parsed.plan) {
      router.push("/")
    }
  }, [router])

  const handlePlanSelect = async (plan: string) => {
    if (!user) return
    setLoading(true)
    setError("")

    if (plan === 'free') {
      try {
        const res = await fetch(`/api/users/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ plan }),
        })

        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.message || "No se pudo guardar el plan")
        }

        const updatedUser = await res.json()
        const newUser = { ...user, plan: updatedUser.plan || plan }
        localStorage.setItem("user", JSON.stringify(newUser))
        window.location.href = "/"
      } catch (err: any) {
        setError(err.message || "Error al guardar el plan")
      } finally {
        setLoading(false)
      }
      return
    }

    setLoading(false)
    router.push(`/auth/payment?plan=${plan}`)
  }

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground">Elige tu plan</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Selecciona el plan que quieres utilizar. El plan premium desbloquea búsquedas avanzadas, productos destacados y envíos gratuitos.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">{error}</div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div key={plan.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-semibold text-foreground">{plan.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1">{plan.priceLabel}</p>
                </div>
                <div className="rounded-full bg-accent/10 text-accent text-xs font-semibold px-3 py-1">
                  {plan.priceLabel}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-5">{plan.description}</p>
              <ul className="space-y-3 mb-6 text-sm text-foreground/90">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <span className="text-accent">•</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handlePlanSelect(plan.id)}
                disabled={loading}
                className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-xl hover:bg-accent/90 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Guardando..." : plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
