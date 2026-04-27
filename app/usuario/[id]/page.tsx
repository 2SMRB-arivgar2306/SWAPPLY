"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import { User, ArrowLeft, Star, MessageCircle } from "lucide-react"
import { useArticles } from "@/lib/articles-context"
import ProductCard from "@/components/product-card"

export default function PublicProfilePage() {
    const router = useRouter()
    const params = useParams()
    const userId = params.id as string

    const [profileData, setProfileData] = useState<any>(null)

    const { articles } = useArticles()
    const [localUser, setLocalUser] = useState<any>(null)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setLocalUser(JSON.parse(storedUser))
        }
    }, [])

    useEffect(() => {
        if (userId) {
            fetch(`/api/users/${userId}`)
                .then(res => {
                    if (!res.ok) router.push('/');
                    return res.json()
                })
                .then(data => setProfileData(data))
        }
    }, [userId, router])


    if (!profileData) {
        return (
            <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16 animate-pulse">
                <Navigation />
                <div className="max-w-4xl mx-auto p-4 md:p-6 mt-10 text-center text-muted-foreground">Cargando vitrina de perfil...</div>
            </main>
        )
    }

    const userArticles = articles.filter((a: any) => String(a.userId) === userId)

    const handleContact = () => {
        // Basic logic to generate chat stub locally if needed or just redirect to chat
        router.push(`/chats?user=${userId}`);
    }

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-16 md:pb-0 md:ml-16">
            <Navigation />

            <div className="max-w-4xl mx-auto p-4 md:p-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
                >
                    <ArrowLeft size={20} />
                    Volver a explorar
                </button>

                {/* Public Header Card */}
                <div className="bg-card w-full shadow-lg border border-border rounded-3xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">

                    <div className="absolute top-0 right-0 w-64 h-64 bg-accent/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

                    {profileData.avatar && profileData.avatar !== '/placeholder.svg' ? (
                        <div className="w-40 h-40 shrink-0 relative rounded-full overflow-hidden border-4 border-background shadow-lg">
                            <img src={profileData.avatar} alt={profileData.name} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-40 h-40 shrink-0 bg-secondary/30 rounded-full flex items-center justify-center border-4 border-background shadow-lg">
                            <User size={64} className="text-accent" />
                        </div>
                    )}

                    <div className="flex-1 text-center md:text-left z-10">
                        <h1 className="text-4xl font-extrabold text-foreground mb-1">{profileData.name}</h1>
                        <p className="text-md font-medium text-accent mb-4 tracking-wide">
                            @{profileData.email.split('@')[0]}
                        </p>

                        <p className="text-foreground max-w-lg mb-6 text-sm">{profileData.bio || "Este usuario prefiere que sus artículos hablen por sí mismos."}</p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-6">
                            <div className="inline-flex items-center justify-center bg-secondary/30 border border-border rounded-full px-4 py-1.5 text-xs font-semibold text-foreground">
                                📍 {profileData.location || "Planeta Tierra"}
                            </div>
                            <div className="inline-flex items-center justify-center bg-secondary/30 border border-border rounded-full px-4 py-1.5 text-xs font-semibold text-foreground">
                                🚀 {profileData.exchanges || 0} Swaps
                            </div>
                            <div className="inline-flex items-center justify-center bg-yellow-400/20 text-yellow-600 border border-yellow-400/30 rounded-full px-4 py-1.5 text-xs font-bold">
                                <Star size={14} className="mr-1 fill-yellow-500" /> {profileData.rating ? profileData.rating.toFixed(1) : "0.0"} ({profileData.ratingCount || 0})
                            </div>
                        </div>

                        {localUser && String(localUser.id) !== userId && (
                            <button
                                onClick={handleContact}
                                className="bg-accent hover:bg-accent/90 text-white font-bold py-3 px-8 rounded-full shadow-md transition-transform active:scale-95 flex items-center gap-2 m-auto md:m-0"
                            >
                                <MessageCircle size={18} /> Contactar para negociar
                            </button>
                        )}
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">Artículos en Vitrina ({userArticles.length})</h2>

                {userArticles.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {userArticles.map((article: any) => (
                            <ProductCard key={article.id} product={article} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-card rounded-2xl border border-dashed border-border">
                        <p className="text-muted-foreground text-lg">No hay artículos disponibles en este momento.</p>
                    </div>
                )}

            </div>
        </main>
    )
}
