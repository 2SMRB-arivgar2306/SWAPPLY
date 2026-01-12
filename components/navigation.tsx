"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter, usePathname } from "next/navigation"
import { Home, MessageCircle, User, LogOut } from "lucide-react"

export default function Navigation() {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth/login")
  }

  if (!user || pathname.startsWith("/auth")) {
    return null
  }

  const navItems = [
    { href: "/", icon: Home, label: "Inicio", id: "home" },
    { href: "/chats", icon: MessageCircle, label: "Chats", id: "chats" },
    { href: "/perfil", icon: User, label: "Perfil", id: "perfil" },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border md:top-0 md:left-0 md:w-16 md:h-screen md:flex md:flex-col md:border-r md:border-t-0 z-40">
      {/* Mobile view */}
      <div className="md:hidden flex justify-around items-center h-16 w-full">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex flex-col items-center justify-center w-16 h-16 transition-colors ${
                isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon size={24} />
              <span className="text-xs mt-1">{item.label}</span>
            </Link>
          )
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center w-16 h-16 text-muted-foreground hover:text-red-500 transition-colors"
        >
          <LogOut size={24} />
          <span className="text-xs mt-1">Salir</span>
        </button>
      </div>

      {/* Desktop view */}
      <div className="hidden md:flex flex-col items-center py-6 gap-8 h-screen">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Image src="/logo-swapply.png" alt="Swapply" width={48} height={48} className="w-12 h-12" priority />
        </Link>
        <div className="flex flex-col gap-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.id}
                href={item.href}
                className={`p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/20"
                }`}
              >
                <item.icon size={24} />
              </Link>
            )
          })}
        </div>
        <button
          onClick={handleLogout}
          className="mt-auto p-3 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={24} />
        </button>
      </div>
    </nav>
  )
}
