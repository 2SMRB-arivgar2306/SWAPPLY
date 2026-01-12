"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Check, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const passwordStrength = {
    hasLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
  }

  const isPasswordValid = Object.values(passwordStrength).every(Boolean)
  const passwordsMatch = formData.password === formData.confirmPassword && formData.password

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (!formData.name || !formData.email || !formData.password) {
      setError("Por favor completa todos los campos")
      setLoading(false)
      return
    }

    if (!isPasswordValid) {
      setError("La contraseña no cumple con los requisitos")
      setLoading(false)
      return
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden")
      setLoading(false)
      return
    }

    setTimeout(() => {
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: formData.name,
          email: formData.email,
          id: Date.now(),
        }),
      )
      router.push("/")
      setLoading(false)
    }, 800)
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
          {/* Name */}
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
              placeholder="Tu nombre"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
              Contraseña
            </label>
            <div className="relative mb-3">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
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

            {/* Password strength */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                {passwordStrength.hasLength ? (
                  <Check size={16} className="text-secondary" />
                ) : (
                  <X size={16} className="text-red-500" />
                )}
                <span className={passwordStrength.hasLength ? "text-muted-foreground" : "text-red-500"}>
                  Mínimo 8 caracteres
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordStrength.hasUpperCase ? (
                  <Check size={16} className="text-secondary" />
                ) : (
                  <X size={16} className="text-red-500" />
                )}
                <span className={passwordStrength.hasUpperCase ? "text-muted-foreground" : "text-red-500"}>
                  Una mayúscula
                </span>
              </div>
              <div className="flex items-center gap-2">
                {passwordStrength.hasNumber ? (
                  <Check size={16} className="text-secondary" />
                ) : (
                  <X size={16} className="text-red-500" />
                )}
                <span className={passwordStrength.hasNumber ? "text-muted-foreground" : "text-red-500"}>Un número</span>
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-2">
              Confirmar contraseña
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {formData.confirmPassword && (
              <div className="mt-2 flex items-center gap-2 text-xs">
                {passwordsMatch ? (
                  <>
                    <Check size={16} className="text-secondary" />
                    <span className="text-muted-foreground">Las contraseñas coinciden</span>
                  </>
                ) : (
                  <>
                    <X size={16} className="text-red-500" />
                    <span className="text-red-500">Las contraseñas no coinciden</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !isPasswordValid || !passwordsMatch}
            className="w-full bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground font-semibold py-3 rounded-lg transition-colors mt-6"
          >
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        {/* Link to login */}
        <p className="text-center text-sm text-muted-foreground mt-4">
          ¿Ya tienes cuenta?{" "}
          <Link href="/auth/login" className="text-accent font-semibold hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
