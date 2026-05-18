"use client"
import ProductCard from "./product-card"
import { useArticles } from "@/lib/articles-context"

export default function ProductGrid({
  searchTerm,
  selectedCategory,
  filterCity,
  filterCondition,
  minPrice,
  maxPrice,
}: {
  searchTerm: string
  selectedCategory: string
  filterCity: string
  filterCondition: string
  minPrice: string
  maxPrice: string
}) {
  const { articles } = useArticles()

  const filteredProducts = articles
    .filter((product: any) => {
      const searchLower = searchTerm.toLowerCase()
      const titleMatch = product.title?.toLowerCase().includes(searchLower) || false
      const wantsMatch = product.wantsFor?.toLowerCase().includes(searchLower) || false
      const descriptionMatch = product.description?.toLowerCase().includes(searchLower) || false
      const featuresMatch = product.features?.toLowerCase().includes(searchLower) || false
      const matchesSearch = !searchTerm || titleMatch || wantsMatch || descriptionMatch || featuresMatch
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesCity = filterCity === "all" || product.location === filterCity
      const matchesCondition = filterCondition === "all" || product.condition === filterCondition
      const matchesPrice =
        (!minPrice || product.price >= Number(minPrice)) &&
        (!maxPrice || product.price <= Number(maxPrice))

      return matchesSearch && matchesCategory && matchesCity && matchesCondition && matchesPrice
    })
    .sort((a: any, b: any) => {
      const aPremium = a.sellerPlan === "premium" ? 0 : 1
      const bPremium = b.sellerPlan === "premium" ? 0 : 1
      return aPremium - bPremium
    })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          Se encontraron <strong className="text-foreground">{filteredProducts.length}</strong> artículos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product: any) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground text-lg">No se encontraron artículos</p>
          <p className="text-muted-foreground text-sm mt-2">Intenta con otras palabras clave o categoría</p>
        </div>
      )}
    </div>
  )
}
