// components/NavbarEditor.tsx
'use client'

import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function NavbarEditor() {
  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-8 py-3 bg-white border-b shadow-sm sticky top-0 z-30">
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-2 text-primary-editor text-2xl md:text-3xl font-bold tracking-tight hover:opacity-80"
      >
        <span className="hidden md:inline text-gray-900">VideoMarket</span>
        <span className="md:hidden text-gray-900">VM</span>
      </Link>

      {/* Acciones */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* NUEVO botón */}
        <Link
          href="/editor/create-offer"
          className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
        >
          Crear oferta
        </Link>

        <Link
          href="/profile"
          className="bg-primary-editor text-white px-4 py-2 rounded-lg font-semibold shadow hover:bg-primary-editor/80 focus:outline-none focus:ring-2 focus:ring-primary-editor"
        >
          Mi perfil
        </Link>

        <LogoutButton />
      </div>
    </nav>
  )
}
