"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const isLengthValid = password.length >= 8 && password.length <= 16;
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    if (!isLengthValid || !hasUppercase || !hasNumber) {
      setError("La contraseña no cumple con los requisitos mínimos")
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Error al registrarse')
      }

      localStorage.setItem("user", JSON.stringify(data.user))
      window.location.href = "/"
    } catch (err: any) {
      setError(err.message || "No se pudo registrar el usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Image src="/logo-swapply.png" alt="Swapply" width={80} height={80} className="w-20 h-20" priority />
          </div>
          <p className="text-muted-foreground text-sm">Cambia todo, gasta nada...</p>
        </div>

        <h2 className="text-2xl font-bold text-foreground mb-6">Crear cuenta</h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
              Nombre completo
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {/* Requisitos de la contraseña */}
            <div className="text-sm space-y-1 mt-3">
              <p className={isLengthValid ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                {isLengthValid ? "✓" : "✗"} 8 - 16 caracteres
              </p>
              <p className={hasUppercase ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                {hasUppercase ? "✓" : "✗"} 1 letra mayúscula
              </p>
              <p className={hasNumber ? "text-green-600 font-medium" : "text-red-500 font-medium"}>
                {hasNumber ? "✓" : "✗"} 1 número
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                className={`w-full px-4 py-3 bg-background border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors pr-10 ${confirmPassword && confirmPassword !== password ? 'border-red-500' : 'border-border'
                  }`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-3 rounded-lg transition-colors mt-6"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿Ya tienes cuenta? {" "}
          <Link href="/auth/login" className="text-accent font-semibold hover:underline">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
