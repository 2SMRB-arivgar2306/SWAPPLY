"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/header"
import SearchBar from "@/components/search-bar"
import ProductGrid from "@/components/product-grid"
import Navigation from "@/components/navigation"
import { Plus } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const handlePublish = () => {
    router.push("/publicar")
  }

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16">
      <Navigation />
      <Header />
      <div className="bg-gradient-to-r from-secondary to-secondary/80 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-accent mb-2">Cambia todo, gasta nada...</h2>
          <p className="text-secondary-foreground text-lg">
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
