"use client"

import { Search } from "lucide-react"

const categories = [
  { id: "all", name: "Todas las categorías" },
  { id: "tech", name: "Tecnología" },
  { id: "fashion", name: "Moda" },
  { id: "home", name: "Hogar" },
  { id: "sports", name: "Deportes" },
  { id: "books", name: "Libros" },
]

export default function SearchBar({ searchTerm, setSearchTerm, selectedCategory, setSelectedCategory }) {
  return (
    <div className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Barra de búsqueda */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <div className="flex-1 flex items-center bg-muted rounded-lg px-4 py-3 border border-border">
            <Search size={18} className="text-muted-foreground mr-2" />
            <input
              type="text"
              placeholder="Buscar artículos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent flex-1 outline-none text-foreground placeholder-muted-foreground"
            />
          </div>
          <button className="w-full sm:w-auto bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium">
            Buscar
          </button>
        </div>

        {/* Filtro de categorías */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-all ${
                selectedCategory === category.id
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-foreground hover:bg-border"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
