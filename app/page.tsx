"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import ProductGrid from "@/components/product-grid"
import Navigation from "@/components/navigation"
import { Plus } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isChecking, setIsChecking] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setIsChecking(false)
  }, [])

  const handlePublish = () => {
    router.push("/publicar")
  }

  if (isChecking) {
    return null
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center max-w-lg w-full text-center space-y-10">
          <div className="flex justify-center">
            <div className="w-40 h-40 rounded-full bg-zinc-950/90 flex items-center justify-center shadow-lg">
              <Image src="/logo-swapply.png" alt="Swapply" width={160} height={160} className="w-40 h-40" priority />
            </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-extrabold text-accent leading-tight">
              ¡Bienvenido a Swapply!
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              La plataforma para intercambiar eso que ya no necesitas, por lo que siempre has querido. <br />
              <span className="font-semibold text-foreground mt-2 block">Cambia todo, gasta nada.</span>
            </p>
          </div>
          <div className="pt-8 w-full flex justify-center">
            <Link
              href="/auth/login"
              className="w-full sm:w-80 bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-4 px-8 rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95 text-xl flex items-center justify-center"
            >
              Entrar
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16">
      <Navigation />
      <Header />
      <div className="bg-gradient-to-r from-secondary/95 via-secondary/90 to-secondary/95 px-4 py-10 text-white shadow-xl">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Cambia todo, gasta nada...</h2>
          <p className="text-white/80 text-lg">
            Intercambia tus artículos favoritos con la comunidad Swapply
          </p>
        </div>
      </div>
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />
      <ProductGrid searchTerm={searchTerm} selectedCategory={selectedCategory} />

      <button
        onClick={handlePublish}
        className="fixed bottom-20 md:bottom-6 right-6 bg-accent text-accent-foreground p-4 rounded-full shadow-lg hover:bg-accent/90 transition-colors flex items-center gap-2 z-30"
      >
        <Plus size={24} />
        <span className="hidden sm:inline">Publicar</span>
      </button>
    </main>
  )
}
