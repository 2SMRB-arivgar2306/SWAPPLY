"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import ChatsClient from "@/components/chats-client"

export default function ChatsPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      router.push("/auth/login")
    }
  }, [router])

  if (!user) {
    return null
  }

  return (
    <main className="min-h-screen bg-background pb-16 md:pb-0 md:ml-16 flex">
      <Navigation />
      <ChatsClient />
    </main>
  )
}
