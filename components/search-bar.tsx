"use client"

import { Search } from "lucide-react"

const categories = [
  { id: "all", name: "Todas las categorías" },
  { id: "electronica", name: "Electrónica" },
  { id: "deportes", name: "Deportes" },
  { id: "ropa", name: "Ropa" },
  { id: "libros", name: "Libros" },
  { id: "muebles", name: "Muebles" },
]

const cities = [
  "Todas las ciudades",
  "Madrid",
  "Barcelona",
  "Valencia",
  "Sevilla",
  "Zaragoza",
  "Málaga",
  "Murcia",
  "Palma",
  "Las Palmas",
  "Bilbao",
  "Alicante",
  "Córdoba",
  "Granada",
  "Valladolid",
  "Vigo",
  "Gijón",
  "Oviedo",
]

const conditions = [
  { id: "all", name: "Todas las condiciones" },
  { id: "como-nueva", name: "Como nueva" },
  { id: "buen-estado", name: "Buen estado" },
  { id: "estado-normal", name: "Estado normal" },
]

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  plan,
  filterCity,
  setFilterCity,
  filterCondition,
  setFilterCondition,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
}: {
  searchTerm: string
  setSearchTerm: (value: string) => void
  selectedCategory: string
  setSelectedCategory: (value: string) => void
  plan: string
  filterCity: string
  setFilterCity: (value: string) => void
  filterCondition: string
  setFilterCondition: (value: string) => void
  minPrice: string
  setMinPrice: (value: string) => void
  maxPrice: string
  setMaxPrice: (value: string) => void
}) {
  const premiumEnabled = plan === "premium"

  return (
    <div className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
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

          <div className="bg-muted/70 border border-border rounded-3xl p-4 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm font-semibold text-foreground">Filtros avanzados</p>
                <p className="text-xs text-muted-foreground">Solo para plan premium</p>
              </div>
              <div className="text-xs font-semibold text-accent">{plan === "premium" ? "Premium" : plan === "medio" ? "Medio" : "Gratis"}</div>
            </div>

            <div className={premiumEnabled ? "space-y-4" : "space-y-4 opacity-40 pointer-events-none"}>
              <div>
                <label htmlFor="filterCity" className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Ciudad
                </label>
                <select
                  id="filterCity"
                  value={filterCity}
                  onChange={(e) => setFilterCity(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                >
                  {cities.map((city) => (
                    <option key={city} value={city === "Todas las ciudades" ? "all" : city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="filterCondition" className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                  Condición
                </label>
                <select
                  id="filterCondition"
                  value={filterCondition}
                  onChange={(e) => setFilterCondition(e.target.value)}
                  className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                >
                  {conditions.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="minPrice" className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Precio mínimo
                  </label>
                  <input
                    id="minPrice"
                    type="number"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="0"
                    className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="block text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Precio máximo
                  </label>
                  <input
                    id="maxPrice"
                    type="number"
                    min="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="100"
                    className="w-full bg-background border border-border rounded-lg px-3 py-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent transition-colors"
                  />
                </div>
              </div>
            </div>

            {!premiumEnabled && (
              <div className="absolute inset-0 bg-black/10 flex items-center justify-center p-6 text-center">
                <div>
                  <p className="text-sm font-semibold text-foreground mb-2">Acceso premium necesario</p>
                  <p className="text-xs text-muted-foreground">Contrata el plan premium para usar filtros avanzados y búsquedas totalmente personalizadas.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
