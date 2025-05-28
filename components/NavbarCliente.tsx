// components/NavbarCliente.tsx
'use client'

import Link from 'next/link'
import PerfilButton from './PerfilButton'

export default function NavbarCliente() {
  return (
    <nav className="w-full flex items-center justify-between px-4 md:px-8 py-3 bg-white border-b border-neutral-200 shadow-sm sticky top-0 z-30">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 text-primary-cliente text-2xl md:text-3xl font-bold font-sans tracking-tight transition-colors hover:text-primary-cliente/80">
        <span className="hidden md:inline">VideoMarket</span>
        <span className="md:hidden">VM</span>
      </Link>

      {/* Buscador (oculto en mobile, visible en md+) */}
      <div className="flex-1 mx-4 hidden md:block">
        <input
          type="text"
          placeholder="Buscar editores..."
          className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cliente bg-neutral-100 text-neutral-900 transition-shadow shadow-sm hover:shadow-md"
        />
      </div>

      {/* Acciones: buscador en mobile, perfil */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Buscador botón en mobile */}
        <button className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors" aria-label="Buscar">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-neutral-900" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1116.65 16.65z" /></svg>
        </button>
        {/* Perfil */}
        <PerfilButton />
      </div>
    </nav>
  )
}
