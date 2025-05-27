// components/NavbarCliente.tsx
'use client'

import Link from 'next/link'
import PerfilButton from './PerfilButton'

export default function NavbarCliente() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <Link href="/" className="text-2xl font-bold text-gray-800">
        VideoMarket
      </Link>

      <div className="flex-1 mx-6">
        <input
          type="text"
          placeholder="Buscar editores..."
          className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <PerfilButton />
    </nav>
  )
}
