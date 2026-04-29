export type Locale = "es" | "en" | "fr"

export const LOCALES: Array<{ id: Locale; label: string }> = [
  { id: "es", label: "Español" },
  { id: "en", label: "English" },
  { id: "fr", label: "Français" },
]

type Dict = {
  nav: {
    home: string
    chats: string
    profile: string
    logout: string
  }
  profile: {
    preferences: string
    language: string
    theme: string
    lightMode: string
    darkMode: string
    editProfile: string
    myItems: string
    favorites: string
    logout: string
    exchanges: string
    ratings: string
    articles: string
    loading: string
  }
}

const dict: Record<Locale, Dict> = {
  es: {
    nav: {
      home: "Inicio",
      chats: "Chats",
      profile: "Perfil",
      logout: "Salir",
    },
    profile: {
      preferences: "Preferencias",
      language: "Idioma",
      theme: "Tema",
      lightMode: "Modo claro",
      darkMode: "Modo oscuro",
      editProfile: "Editar Perfil",
      myItems: "Mis Artículos",
      favorites: "Favoritos",
      logout: "Cerrar sesión",
      exchanges: "Intercambios",
      ratings: "valoraciones",
      articles: "Artículos",
      loading: "Cargando tu perfil espectacular...",
    },
  },
  en: {
    nav: {
      home: "Home",
      chats: "Chats",
      profile: "Profile",
      logout: "Logout",
    },
    profile: {
      preferences: "Preferences",
      language: "Language",
      theme: "Theme",
      lightMode: "Light mode",
      darkMode: "Dark mode",
      editProfile: "Edit Profile",
      myItems: "My Items",
      favorites: "Favorites",
      logout: "Log out",
      exchanges: "Swaps",
      ratings: "ratings",
      articles: "Items",
      loading: "Loading your profile...",
    },
  },
  fr: {
    nav: {
      home: "Accueil",
      chats: "Chats",
      profile: "Profil",
      logout: "Déconnexion",
    },
    profile: {
      preferences: "Préférences",
      language: "Langue",
      theme: "Thème",
      lightMode: "Mode clair",
      darkMode: "Mode sombre",
      editProfile: "Modifier le profil",
      myItems: "Mes articles",
      favorites: "Favoris",
      logout: "Déconnexion",
      exchanges: "Échanges",
      ratings: "évaluations",
      articles: "Articles",
      loading: "Chargement de votre profil...",
    },
  },
}

export function getDict(locale: Locale): Dict {
  return dict[locale] || dict.es
}
