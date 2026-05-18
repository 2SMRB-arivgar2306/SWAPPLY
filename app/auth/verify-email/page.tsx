"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function VerifyEmailPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (!storedUser) {
      router.push("/auth/login")
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    setError("")
    setMessage("")

    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, code }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Código inválido')

      const updatedUser = { ...user, isVerified: true }
      localStorage.setItem('user', JSON.stringify(updatedUser))
      setMessage('Correo verificado con éxito. Te llevamos a seleccionar plan.')
      window.location.href = '/auth/select-plan'
    } catch (err: any) {
      setError(err.message || 'Error al verificar el correo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold text-foreground mb-4">Verifica tu correo</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Hemos enviado un código de verificación a tu correo. Ingresa el código para continuar.
        </p>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}
        {message && <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg mb-4 text-sm">{message}</div>}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-foreground mb-2">Código de verificación</label>
            <input
              id="code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="123456"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50">
            {loading ? 'Verificando...' : 'Verificar correo'}
          </button>
        </form>
      </div>
    </div>
  )
}
