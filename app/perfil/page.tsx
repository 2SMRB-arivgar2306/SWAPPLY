"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { LogOut, User } from "lucide-react"
import { useArticles } from "@/lib/articles-context"
import { LanguageSwitcher } from "@/components/language-switcher"
import { ThemeToggle } from "@/components/theme-toggle"
import { useLocale } from "@/lib/locale-context"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profileData, setProfileData] = useState<any>(null)

  const { articles } = useArticles()
  const { dict } = useLocale()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      const u = JSON.parse(storedUser)
      setUser(u)
      fetch(`/api/users/${u.id}`)
        .then(res => res.json())
        .then(data => setProfileData(data))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  // Handlers for profile buttons
  const handleEditProfile = () => {
    router.push("/perfil/editar")
  }

  const handleMyItems = () => {
    router.push("/mis-articulos")
  }

  const handleFavorites = () => {
    router.push("/favorites")
  }

  const handlePlanChange = () => {
    router.push("/auth/select-plan")
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/auth/login"
  }

  if (!user || !profileData) {
    return (
      <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16 animate-pulse">
        <Navigation />
        <div className="max-w-2xl mx-auto p-4 md:p-6 mt-10 text-center text-muted-foreground">{dict.profile.loading}</div>
      </main>
    )
  }

  const exactArticlesCount = articles.filter((a: any) => String(a.userId) === String(user.id)).length

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16">
      <Navigation />

      <div className="max-w-2xl mx-auto p-4 md:p-6 lg:mt-4">
        {/* Perfil Header */}
        <div className="bg-card shadow-sm border border-border rounded-2xl p-6 mb-6 text-center">

          {profileData.avatar && profileData.avatar !== '/placeholder.svg' ? (
            <div className="w-32 h-32 mx-auto mb-4 relative rounded-full overflow-hidden border-4 border-accent shadow-md">
              <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-32 h-32 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-transparent">
              <User size={64} className="text-accent" />
            </div>
          )}

          <h1 className="text-3xl font-bold text-foreground mb-1">{profileData.name}</h1>
          <p className="text-sm font-medium text-muted-foreground mb-4 opacity-80">@{profileData.email.split('@')[0]}</p>

          {profileData.bio && (
            <p className="text-foreground max-w-md mx-auto mb-4 text-sm italic">{profileData.bio}</p>
          )}

          {profileData.location && (
            <div className="inline-flex items-center justify-center bg-secondary/50 rounded-full px-4 py-1 text-xs font-semibold text-foreground/80 mb-2">
              📍 {profileData.location}
            </div>
          )}
          <div className="inline-flex items-center justify-center bg-accent/10 text-accent rounded-full px-4 py-1 text-xs font-semibold mb-2">
            {profileData.plan === 'premium' ? 'Plan Premium' : profileData.plan === 'medio' ? 'Plan Medio' : 'Plan Gratis'}
          </div>
          {!profileData.isVerified && (
            <div className="inline-flex items-center justify-center bg-orange-100 text-orange-700 rounded-full px-4 py-1 text-xs font-semibold mb-2">
              Correo no verificado
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-accent">{profileData.exchanges || 0}</div>
            <p className="text-xs text-muted-foreground mt-1 uppercase font-bold tracking-wider">{dict.profile.exchanges}</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-accent">{profileData.rating ? profileData.rating.toFixed(1) : "0.0"}</div>
            <p className="text-xs text-muted-foreground mt-1 uppercase font-bold tracking-wider opacity-70">
              ⭐ {profileData.ratingCount || 0} {dict.profile.ratings}
            </p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl font-bold text-accent">{exactArticlesCount}</div>
            <p className="text-xs text-muted-foreground mt-1 uppercase font-bold tracking-wider">{dict.profile.articles}</p>
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-card border border-border rounded-2xl p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4">{dict.profile.preferences}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="bg-background border border-border rounded-2xl p-4">
              <LanguageSwitcher />
            </div>
            <div className="bg-background border border-border rounded-2xl p-4">
              <div className="mb-3 text-sm font-medium text-muted-foreground">{dict.profile.theme}</div>
              <ThemeToggle />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={handleEditProfile}
            className="w-full bg-accent/10 border border-accent/20 hover:bg-accent/20 text-accent font-semibold py-3 rounded-xl transition-all"
          >
            {dict.profile.editProfile}
          </button>
          <button
            onClick={handlePlanChange}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-3 rounded-xl transition-all"
          >
            Cambiar plan
          </button>
          {!profileData.isVerified && (
            <button
              onClick={() => router.push('/auth/verify-email')}
              className="w-full bg-orange-500 text-white hover:bg-orange-600 font-semibold py-3 rounded-xl transition-all"
            >
              Verificar correo
            </button>
          )}
          <button
            onClick={handleMyItems}
            className="w-full bg-card border border-border hover:bg-secondary/20 text-foreground font-semibold py-3 rounded-xl transition-all shadow-sm"
          >
            {dict.profile.myItems}
          </button>
          <button
            onClick={handleFavorites}
            className="w-full bg-card border border-border hover:bg-secondary/20 text-foreground font-semibold py-3 rounded-xl transition-all shadow-sm"
          >
            {dict.profile.favorites}
          </button>
          <button
            onClick={handleLogout}
            className="w-full mt-8 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <LogOut size={20} />
            {dict.profile.logout}
          </button>
        </div>
      </div>
    </main>
  )
}
