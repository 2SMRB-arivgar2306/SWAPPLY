"use client"

import type React from "react"
import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"

const cardBrands = [
  { id: 'visa', label: 'Visa', pattern: /^4[0-9]{0,15}$/ },
  { id: 'mastercard', label: 'Mastercard', pattern: /^5[1-5][0-9]{0,14}$/ },
  { id: 'amex', label: 'American Express', pattern: /^3[47][0-9]{0,13}$/ },
]

function luhnCheck(value: string) {
  const digits = value.replace(/\D/g, '').split('').reverse().map(Number)
  let sum = 0
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i]
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  return sum % 10 === 0
}

function normalizeCardNumber(value: string) {
  return value.replace(/\D/g, '')
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const plan = searchParams?.get('plan') || 'free'
  const [user, setUser] = useState<any>(null)
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (!storedUser) {
      router.push('/auth/login')
      return
    }
    setUser(JSON.parse(storedUser))
  }, [router])

  const selectedPlan = useMemo(() => {
    if (plan === 'premium') return { label: 'Plan Premium', price: '20€ / mes' }
    if (plan === 'medio') return { label: 'Plan Medio', price: '10€ / mes' }
    return { label: 'Plan Gratis', price: '0€' }
  }, [plan])

  const cardBrand = useMemo(() => {
    const cleaned = normalizeCardNumber(cardNumber)
    return cardBrands.find((brand) => brand.pattern.test(cleaned))?.label || 'Desconocida'
  }, [cardNumber])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!user) {
      setError('Usuario no encontrado.')
      setLoading(false)
      return
    }

    if (!cardHolder || !cardNumber || !expiry || !cvc) {
      setError('Completa todos los campos de pago.')
      setLoading(false)
      return
    }

    const normalizedNumber = normalizeCardNumber(cardNumber)
    if (!luhnCheck(normalizedNumber)) {
      setError('Número de tarjeta inválido.')
      setLoading(false)
      return
    }

    const [month, year] = expiry.split('/').map((part) => part.trim())
    if (!month || !year || Number(month) < 1 || Number(month) > 12 || year.length !== 2) {
      setError('Fecha de expiración inválida.')
      setLoading(false)
      return
    }

    const res = await fetch('/api/payments/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        plan,
        amount: plan === 'premium' ? 20 : plan === 'medio' ? 10 : 0,
        cardNumber: normalizedNumber,
        expiry,
        cvc,
        cardHolder,
      }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.message || 'Error realizando el pago')
      setLoading(false)
      return
    }

    const updatedUser = { ...user, plan }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    window.location.href = '/'
  }

  if (!user) {
    return <div className="min-h-screen bg-background" />
  }

  if (plan === 'free') {
    router.push('/auth/select-plan')
    return null
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-8 shadow-lg">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Pago de {selectedPlan.label}</h1>
          <p className="text-sm text-muted-foreground mt-2">Precio: {selectedPlan.price}</p>
          <p className="text-sm text-muted-foreground mt-2">Aceptamos Visa, Mastercard y American Express.</p>
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handlePayment} className="space-y-6">
          <div>
            <label htmlFor="cardHolder" className="block text-sm font-medium text-foreground mb-2">Titular de la tarjeta</label>
            <input
              id="cardHolder"
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="Nombre en la tarjeta"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
          </div>

          <div>
            <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-2">Número de tarjeta</label>
            <input
              id="cardNumber"
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
            />
            <p className="text-xs text-muted-foreground mt-2">Marca detectada: {cardBrand}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="expiry" className="block text-sm font-medium text-foreground mb-2">Mes / Año</label>
              <input
                id="expiry"
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="MM/AA"
                maxLength={5}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              />
            </div>
            <div>
              <label htmlFor="cvc" className="block text-sm font-medium text-foreground mb-2">CVC</label>
              <input
                id="cvc"
                type="text"
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="123"
                maxLength={4}
                className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground font-semibold py-3 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-50">
            {loading ? 'Procesando pago...' : `Pagar ${selectedPlan.price}`}
          </button>
        </form>
      </div>
    </div>
  )
}
