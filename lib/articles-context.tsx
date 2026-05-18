"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

export interface Article {
  id: string | number
  title: string
  description: string
  category: string
  condition: string
  wantsFor: string
  image: string
  price: number
  location: string
  features: string
  sellerPlan?: string
}

interface ArticlesContextType {
  articles: Article[]
  addArticle: (article: Omit<Article, 'id'> & { userId?: string; sellerPlan?: string }) => Promise<boolean>
  updateArticle: (id: string | number, article: Partial<Article>) => Promise<boolean>
  deleteArticle: (id: string | number) => Promise<boolean>
  getArticleById: (id: string | number) => Article | undefined
}

const ArticlesContext = createContext<ArticlesContextType | undefined>(undefined)

export function ArticlesProvider({ children }: { children: React.ReactNode }) {
  const [articles, setArticles] = useState<Article[]>([])

  const fetchArticles = async () => {
    try {
      const res = await fetch('/api/articles')
      if (res.ok) {
        const data = await res.json()
        setArticles(data)
      } else {
        console.error('[SWAPPLY] Error fetching articles')
      }
    } catch (error) {
      console.error('[SWAPPLY] Error fetching articles', error)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [])

  const addArticle = async (article: Omit<Article, 'id'> & { userId?: string }) => {
    try {
      const res = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(article),
      })
      if (res.ok) {
        await fetchArticles() // Refresh list
        return true
      }
      return false
    } catch (error) {
      console.error('[SWAPPLY] Error adding article', error)
      return false
    }
  }

  const updateArticle = async (id: string | number, updatedArticle: Partial<Article>) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedArticle),
      })
      if (res.ok) {
        await fetchArticles() // Refresh list
        return true
      }
      return false
    } catch (error) {
      console.error('[SWAPPLY] Error updating article', error)
      return false
    }
  }

  const deleteArticle = async (id: string | number) => {
    try {
      const res = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
      })
      if (res.ok) {
        await fetchArticles() // Refresh list
        return true
      }
      return false
    } catch (error) {
      console.error('[SWAPPLY] Error deleting article', error)
      return false
    }
  }

  const getArticleById = (id: string | number) => {
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
