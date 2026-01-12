import type React from "react"
import type { Metadata } from "next"
import { Poppins, Kalam } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { FavoritesProvider } from "@/lib/favorites-context"
import { ArticlesProvider } from "@/lib/articles-context"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
})

const kalam = Kalam({
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "Swapply - Intercambia, No Compres",
  description: "Plataforma de intercambio de artículos. Encuentra lo que necesitas, intercambia lo que ya no usas.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`${poppins.className} antialiased`}>
        <FavoritesProvider>
          <ArticlesProvider>{children}</ArticlesProvider>
        </FavoritesProvider>
        <Analytics />
      </body>
    </html>
  )
}
