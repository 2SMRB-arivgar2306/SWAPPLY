"use client"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { Search, Plus, Send } from "lucide-react"

interface Chat {
  id: number
  name: string
  avatar: string
  lastMessage: string
  lastTime: string
  unread: number
  messages: Message[]
}

interface Message {
  id: number
  sender: "me" | "other"
  text: string
  time: string
}

export default function ChatsClient() {
  const [chats, setChats] = useState<Chat[]>([
    {
      id: 1,
      name: "Juan Pérez",
      avatar: "👨",
      lastMessage: "¿Sigues interesado en el cambio?",
      lastTime: "10:30",
      unread: 2,
      messages: [
        { id: 1, sender: "other", text: "Hola, me interesa tu bicicleta", time: "10:15" },
        { id: 2, sender: "me", text: "Claro, te la enseño cuando quieras", time: "10:20" },
        { id: 3, sender: "other", text: "¿Sigues interesado en el cambio?", time: "10:30" },
      ],
    },
    {
      id: 2,
      name: "María García",
      avatar: "👩",
      lastMessage: "Perfecto, nos vemos mañana",
      lastTime: "09:45",
      unread: 0,
      messages: [
        { id: 1, sender: "other", text: "Hola, tengo ese auricular", time: "09:30" },
        { id: 2, sender: "me", text: "Excelente, ¿a qué hora?", time: "09:35" },
        { id: 3, sender: "other", text: "Perfecto, nos vemos mañana", time: "09:45" },
      ],
    },
  ])

  useEffect(() => {
    const storedChats = localStorage.getItem("swapply_chats")
    if (storedChats) {
      try {
        setChats(JSON.parse(storedChats))
      } catch {
        console.log("[v0] Error loading chats from localStorage")
      }
    }
  }, [])

  const [selectedChatId, setSelectedChatId] = useState<number | null>(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [messageText, setMessageText] = useState("")

  const selectedChat = chats.find((c) => c.id === selectedChatId)
  const filteredChats = chats.filter((chat) => chat.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageText.trim() || !selectedChat) return

    const updatedChats = chats.map((chat) => {
      if (chat.id === selectedChatId) {
        return {
          ...chat,
          messages: [
            ...chat.messages,
            {
              id: chat.messages.length + 1,
              sender: "me",
              text: messageText,
              time: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
            },
          ],
          lastMessage: messageText,
          lastTime: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" }),
        }
      }
      return chat
    })

    setChats(updatedChats)
    setMessageText("")
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
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`w-full p-4 border-b border-border hover:bg-background transition-colors text-left ${
                selectedChatId === chat.id ? "bg-background" : ""
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
          ))}
        </div>

        {/* Mobile chat list */}
        <div className="md:hidden flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChatId(chat.id)}
              className={`w-full p-4 border-b border-border hover:bg-background transition-colors text-left ${
                selectedChatId === chat.id ? "bg-accent/10" : ""
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
          ))}
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
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      message.sender === "me"
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
            <p>Selecciona un chat para empezar</p>
          </div>
        )}
      </div>
    </>
  )
}
