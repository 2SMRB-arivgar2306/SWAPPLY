"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export interface Article {
  id: number
  title: string
  description: string
  category: string
  condition: string
  wantsFor: string
  image: string
}

interface ArticlesContextType {
  articles: Article[]
  addArticle: (article: Article) => void
  updateArticle: (id: number, article: Article) => void
  deleteArticle: (id: number) => void
  getArticleById: (id: number) => Article | undefined
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined)

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: 1,
      title: "Bicicleta de Montaña",
      description: "Bicicleta en excelente estado",
      category: "deportes",
      condition: "como-nueva",
      wantsFor: "Patineta",
      image: "/mountain-bike.jpg",
    },
    {
      id: 2,
      title: "Auriculares Gaming",
      description: "Auriculares con micrófono integrado",
      category: "electronica",
      condition: "buen-estado",
      wantsFor: "Micrófono",
      image: "/gaming-headphones.jpg",
    },
  ])

  useEffect(() => {
    const stored = localStorage.getItem("swapply_articles")
    if (stored) {
      try {
        setArticles(JSON.parse(stored))
      } catch {
        console.log("[v0] Error al cargar artículos")
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("swapply_articles", JSON.stringify(articles))
  }, [articles])

  const addArticle = (article: Article) => {
    const newArticle = { ...article, id: Date.now() }
    setArticles([...articles, newArticle])
  }

  const updateArticle = (id: number, updatedArticle: Article) => {
    setArticles(articles.map((a) => (a.id === id ? { ...updatedArticle, id } : a)))
  }

  const deleteArticle = (id: number) => {
    setArticles(articles.filter((a) => a.id !== id))
  }

  const getArticleById = (id: number) => {
    return articles.find((a) => a.id === id)
  }

  return (
    <ArticlesContext.Provider value={{ articles, addArticle, updateArticle, deleteArticle, getArticleById }}>
      {children}
    </ArticlesContext.Provider>
  )
}

export function useArticles() {
  const context = useContext(ArticlesContext)
  if (!context) {
    throw new Error("useArticles debe usarse dentro de ArticlesProvider")
  }
  return context
}
