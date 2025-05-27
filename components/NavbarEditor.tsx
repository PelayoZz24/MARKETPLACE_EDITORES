// components/NavbarEditor.tsx
'use client'

import Link from 'next/link'
import LogoutButton from './LogoutButton'

export default function NavbarEditor() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white shadow">
      <Link href="/" className="text-2xl font-bold text-gray-800">
        VideoMarket
      </Link>

      <div className="flex space-x-4 items-center">
        <Link
          href="/profile"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Mi perfil
        </Link>
        <LogoutButton />
      </div>
    </nav>
  )
}