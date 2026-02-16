"use client"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { Search, Plus, Send } from "lucide-react"

interface Chat {
  id: string
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

interface Message {
  id: string
  sender: "me" | "other"
  text: string
  time: string
}

export default function ChatsClient() {
  const [chats, setChats] = useState<Chat[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [messageText, setMessageText] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const user = JSON.parse(stored)
        setUserId(user.id)
      } catch {
        console.log("[SWAPPLY] Error reading user from localStorage")
      }
    }
  }, [])

  useEffect(() => {
    if (userId) {
      fetchChats()
    }
  }, [userId])

  const fetchChats = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/chats?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setChats(data)
        if (data.length > 0 && !selectedChatId) {
          setSelectedChatId(data[0].id)
        }
      }
    } catch (error) {
      console.error("[SWAPPLY] Error fetching chats:", error)
    } finally {
      setLoading(false)
    }
  }

  const selectedChat = chats.find((c) => c.id === selectedChatId)
  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedChat || !selectedChatId) return

    const time = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })

    // Optimistic update
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: "me",
      text: messageText,
      time: time,
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [...chat.messages, tempMessage],
            lastMessage: messageText,
            lastTime: time,
          }
        }
        return chat
      })
    )
    setMessageText("")

    try {
      const res = await fetch(`/api/chats/${selectedChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: "me",
          text: tempMessage.text,
          time: time,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        // Replace temp message with real one
        setChats((prev) =>
          prev.map((chat) => {
            if (chat.id === selectedChatId) {
              return {
                ...chat,
                messages: chat.messages.map((msg) =>
                  msg.id === tempMessage.id ? { ...data.data } : msg
                ),
              }
            }
            return chat
          })
        )
      }
    } catch (error) {
      console.error("[SWAPPLY] Error sending message:", error)
    }
  }

  return (
    <>
      {/* Lista de chats - Mobile y Desktop */}
      <div className="w-full md:w-96 border-r border-border bg-card flex flex-col">
        {/* Header de chats */}
        <div className="p-4 border-b border-border">
          <h1 className="text-2xl font-bold text-foreground mb-4">Mensajes</h1>
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar conversación..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>
        </div>

        {/* Lista de chats */}
        <div className="flex-1 overflow-y-auto hidden md:block">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Cargando chats...</div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No hay conversaciones</div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full p-4 border-b border-border hover:bg-background transition-colors text-left ${selectedChatId === chat.id ? "bg-background" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{chat.avatar}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-semibold text-foreground text-sm">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">{chat.lastTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Mobile chat list */}
        <div className="md:hidden flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-muted-foreground">Cargando chats...</div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">No hay conversaciones</div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => setSelectedChatId(chat.id)}
                className={`w-full p-4 border-b border-border hover:bg-background transition-colors text-left ${selectedChatId === chat.id ? "bg-accent/10" : ""
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{chat.avatar}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline gap-2">
                      <h3 className="font-semibold text-foreground">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground">{chat.lastTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{chat.lastMessage}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Área de chat */}
      <div className="hidden md:flex flex-1 flex-col bg-background">
        {selectedChat ? (
          <>
            {/* Chat header */}
            <div className="p-4 border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{selectedChat.avatar}</div>
                <h2 className="text-lg font-semibold text-foreground">{selectedChat.name}</h2>
              </div>
              <button className="p-2 hover:bg-secondary/20 rounded-lg transition-colors">
                <Plus size={20} className="text-muted-foreground" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${message.sender === "me"
                        ? "bg-accent text-accent-foreground rounded-br-none"
                        : "bg-secondary/30 text-foreground rounded-bl-none"
                      }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <span className="text-xs opacity-70 block mt-1">{message.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input de mensaje */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2">
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-2 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground rounded-lg transition-colors"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <p>{loading ? "Cargando..." : "Selecciona un chat para empezar"}</p>
          </div>
        )}
      </div>
    </>
  )
}
