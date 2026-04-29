"use client"

import { useState, useRef, useEffect } from "react"
import type React from "react"
import { Search, Plus, Send, Image as ImageIcon, CheckCircle, Star, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface Chat {
  id: string
  userId: string // Partner's ID
  name: string
  avatar: string
  bio?: string
  rating?: number
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
  image?: string
  isSystem?: boolean
}

export default function ChatsClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const renderAvatar = (avatarStr: string) => {
    const isUrl =
      avatarStr?.startsWith("http") ||
      avatarStr?.startsWith("data:") ||
      avatarStr?.startsWith("/") ||
      /\.(jpg|jpeg|png|webp|gif|svg)(\?.*)?$/i.test(avatarStr || "")
    if (isUrl) {
      return <img src={avatarStr} alt="Avatar" className="w-full h-full object-cover rounded-full" />
    }
    return <span className="text-2xl">{avatarStr || "👤"}</span>
  }

  const [chats, setChats] = useState<Chat[]>([])
  const [userId, setUserId] = useState<string | null>(null)
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [messageText, setMessageText] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)

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
    const handleResize = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [chats, selectedChatId])

  useEffect(() => {
    if (userId) {
      fetchChats()
    }
  }, [userId, isDesktop])

  const fetchChats = async () => {
    if (!userId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/chats?userId=${userId}`)
      if (res.ok) {
        const data = await res.json()
        setChats(data)

        const targetUser = searchParams.get("user")
        const matchedChat = targetUser
          ? data.find((chat: Chat) => chat.userId === targetUser || chat.name === targetUser)
          : undefined

        if (matchedChat) {
          setSelectedChatId(matchedChat.id)
        } else if (data.length > 0 && !selectedChatId && isDesktop) {
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

  const sendPayload = async (text: string, imageUrl?: string, systemMsg?: boolean) => {
    if (!selectedChatId) return;

    const time = new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      sender: (userId as "me" | "other" | any) || "me",
      text: text,
      time: time,
      image: imageUrl,
      isSystem: systemMsg,
    }

    setChats((prev) =>
      prev.map((chat) => {
        if (chat.id === selectedChatId) {
          return {
            ...chat,
            messages: [...chat.messages, tempMessage],
            lastMessage: text || (imageUrl ? "🖼️ Foto enviada" : "Intercambio Terminado"),
            lastTime: time,
          }
        }
        return chat
      })
    )

    try {
      const res = await fetch(`/api/chats/${selectedChatId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender: userId || "me",
          text: text,
          time: time,
          image: imageUrl,
          isSystem: systemMsg
        }),
      })

      if (res.ok) {
        const data = await res.json()
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
      console.error("[SWAPPLY] Error:", error)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if ((!messageText.trim() && !selectedImage) || !selectedChat || !selectedChatId) return
    const textToSend = messageText;
    const imageToSend = selectedImage;
    setMessageText("");
    setSelectedImage(null);
    await sendPayload(textToSend, imageToSend || undefined)
  }

  const handleSendImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert("Por favor selecciona una imagen válida.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target?.result as string;
        setSelectedImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleFinalize = async () => {
    if (!selectedChat || !userId) return;
    const ratingStr = prompt("Del 1 al 5, ¿cómo valorarías a este usuario por el intercambio?");
    const ratingNum = parseInt(ratingStr || "0");
    if (ratingNum >= 1 && ratingNum <= 5) {
      try {
        const res = await fetch(`/api/users/${selectedChat.userId}/rate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stars: ratingNum })
        });

        if (res.ok) {
          await sendPayload(`✅ El intercambio ha sido marcado como completado y calificado con ${ratingNum}/5 estrellas.`, undefined, true);
          alert("¡Intercambio finalizado excitósamente!");
        } else {
          alert("Error al finalizar el intercambio.");
        }
      } catch (e) {
        console.error(e)
        alert("Ocurrió un problema.");
      }
    } else {
      alert("Valoración no válida. Debía ser entre 1 y 5.");
    }
  }

  return (
    <>
      <div className={`w-full md:w-96 border-r border-border bg-card flex flex-col min-h-0 ${selectedChat ? "hidden md:flex" : "flex"}`}>
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

        <div className="flex-1 min-h-0 overflow-y-auto">
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
                  <div className="w-12 h-12 flex items-center justify-center bg-secondary/30 rounded-full shrink-0">
                    {renderAvatar(chat.avatar)}
                  </div>
                  <div className="flex-1 overflow-hidden">
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
      </div>

      <div className={`flex-1 flex min-h-0 flex-col bg-background relative ${selectedChat ? "flex" : "hidden md:flex"}`}>
        {selectedChat ? (
          <>
            <div className="p-4 border-b border-border flex items-center justify-between shadow-sm z-10">
              <div className="flex items-center gap-3 md:hidden">
                <button
                  type="button"
                  onClick={() => setSelectedChatId(null)}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={18} /> Volver
                </button>
              </div>
              <div
                className="flex items-center gap-3 cursor-pointer hover:bg-secondary/50 p-2 rounded-lg transition-transform max-w-[60%]"
                onClick={() => router.push(`/usuario/${selectedChat.userId}`)}
              >
                <div className="w-12 h-12 flex items-center justify-center bg-secondary/30 rounded-full shrink-0">
                  {renderAvatar(selectedChat.avatar)}
                </div>
                <div className="overflow-hidden w-full">
                  <h2 className="text-lg font-semibold text-foreground hover:underline flex items-center gap-2 truncate">
                    {selectedChat.name}
                    {(selectedChat.rating ?? 0) > 0 && <span className="text-yellow-500 text-sm flex items-center gap-1 shrink-0"><Star size={14} fill="currentColor" /> {selectedChat.rating?.toFixed(1)}</span>}
                  </h2>
                  <p className="text-xs text-muted-foreground truncate">{selectedChat.bio || "Ver perfil completo"}</p>
                </div>
              </div>
              <button
                onClick={handleFinalize}
                className="flex items-center gap-2 p-2 px-4 bg-green-500/10 hover:bg-green-500/20 text-green-600 rounded-lg transition-colors font-medium text-sm"
              >
                <CheckCircle size={18} />
                Terminar Intercambio
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedChat.messages.map((message) => {
                if (message.isSystem) {
                  return (
                    <div key={message.id} className="flex justify-center w-full my-4">
                      <div className="bg-secondary/50 text-muted-foreground text-xs font-semibold px-4 py-2 rounded-full border border-border/50 text-center shadow-sm">
                        {message.text}
                      </div>
                    </div>
                  );
                }

                const isMe = message.sender === userId || message.sender === "me";
                return (
                  <div key={message.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs md:max-w-md px-4 py-2 rounded-xl shadow-sm ${isMe
                        ? "bg-accent text-accent-foreground rounded-br-none"
                        : "bg-secondary/40 border border-black/5 text-foreground rounded-bl-none"
                        }`}
                    >
                      {message.image && (
                        <img src={message.image} alt="Adjunto" className="w-full max-w-full rounded-lg mb-2 border border-black/10" />
                      )}
                      {message.text && <p className="text-sm font-medium leading-relaxed break-words">{message.text}</p>}
                      <span className="text-[10px] opacity-70 block mt-1 text-right">{message.time}</span>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            {selectedImage && (
              <div className="px-4 py-2 bg-card border-t border-border flex justify-between items-end">
                <div className="relative w-16 h-16 rounded-md overflow-hidden border border-border">
                  <img src={selectedImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedImage(null)}
                  className="text-red-500 text-xs font-semibold hover:underline"
                >
                  Cancelar foto
                </button>
              </div>
            )}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-border flex gap-2 bg-card">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <button
                type="button"
                onClick={handleSendImageClick}
                className="p-3 bg-secondary/80 hover:bg-secondary text-foreground rounded-lg transition-colors shadow-sm"
              >
                <ImageIcon size={20} />
              </button>

              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="flex-1 px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent shadow-inner text-sm font-medium"
              />
              <button
                type="submit"
                disabled={!messageText.trim()}
                className="p-3 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-accent-foreground rounded-lg transition-colors shadow-sm"
              >
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground bg-secondary/10">
            <div className="p-6 bg-background rounded-2xl shadow-sm border border-border text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-accent/20 text-accent rounded-full flex items-center justify-center mb-4">
                <Send size={30} />
              </div>
              <h2 className="text-xl font-bold text-foreground mb-1">¡Tus Mensajes!</h2>
              <p className="max-w-[200px] text-sm">Selecciona una conversación a la izquierda para empezar.</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
