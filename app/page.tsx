'use client'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Marketplace de Edición de Vídeo</h1>
        <Link href="/login" className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition">
          Empieza aquí
        </Link>
      </div>
    </div>
  )
}