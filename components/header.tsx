"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Heart, MessageCircle, User } from "lucide-react"

export default function Header() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  if (!user) {
    return null
  }

  return (
    <header className="bg-card border-b border-border sticky top-0 z-30 md:ml-0">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo y nombre */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <Image src="/logo-swapply.png" alt="Swapply" width={40} height={40} className="w-10 h-10" priority />
            <div>
              <h1 className="text-2xl font-bold text-primary">Swapply</h1>
              <p className="text-xs text-muted-foreground">Cambia todo, gasta nada...</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-accent transition-colors">
              <Heart size={20} />
            </Link>
            <Link href="/chats" className="text-foreground hover:text-accent transition-colors">
              <MessageCircle size={20} />
            </Link>
            <Link href="/perfil" className="text-foreground hover:text-accent transition-colors">
              <User size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
