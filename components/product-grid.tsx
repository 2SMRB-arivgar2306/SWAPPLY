"use client"
import ProductCard from "./product-card"

const products = [
  {
    id: 1,
    title: "iPhone 12",
    category: "tech",
    image: "/iphone-12.png",
    location: "Madrid",
    user: "Juan M.",
    wantsFor: "iPad Pro",
    condition: "Como nuevo",
  },
  {
    id: 2,
    title: "Bicicleta montaña",
    category: "sports",
    image: "/mountain-bike-trail.png",
    location: "Barcelona",
    user: "María L.",
    wantsFor: "Patinete eléctrico",
    condition: "Muy buen estado",
  },
  {
    id: 3,
    title: "Zapatillas Nike Air Max",
    category: "fashion",
    image: "/product-1.png",
    location: "Valencia",
    user: "Carlos R.",
    wantsFor: "Zapatillas Adidas",
    condition: "Sin usar",
  },
  {
    id: 4,
    title: "PlayStation 5",
    category: "tech",
    image: "/playstation-5-console.png",
    location: "Sevilla",
    user: "Ana G.",
    wantsFor: "Xbox Series X",
    condition: "Perfectas condiciones",
  },
  {
    id: 5,
    title: "Lámpara de diseño",
    category: "home",
    image: "/design-lamp.jpg",
    location: "Bilbao",
    user: "Pedro H.",
    wantsFor: "Espejo vintage",
    condition: "Como nuevo",
  },
  {
    id: 6,
    title: "Colección libros clásicos",
    category: "books",
    image: "/classic-books.jpg",
    location: "Zaragoza",
    user: "Isabel S.",
    wantsFor: "Novelas de sci-fi",
    condition: "Muy buen estado",
  },
  {
    id: 7,
    title: "Cámara Canon EOS",
    category: "tech",
    image: "/canon-eos-camera.jpg",
    location: "Málaga",
    user: "David M.",
    wantsFor: "Lentes profesionales",
    condition: "Excelentes condiciones",
  },
  {
    id: 8,
    title: "Escritorio madera maciza",
    category: "home",
    image: "/wooden-desk-furniture.jpg",
    location: "Pamplona",
    user: "Laura P.",
    wantsFor: "Estantería moderna",
    condition: "Buen estado",
  },
]

export default function ProductGrid({ searchTerm, selectedCategory }) {
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.wantsFor.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <p className="text-muted-foreground text-sm">
          Se encontraron <strong className="text-foreground">{filteredProducts.length}</strong> artículos
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
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
