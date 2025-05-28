'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'
import PerfilButton from '@/components/PerfilButton'

type EditorProfile = {
  id: string
  bio: string
  specialties: string[]
  languages: string[]
  price_range: string
  experience_years: number
}

// Página de exploración de editores
export default async function Page() {
  const [editors, setEditors] = useState<EditorProfile[]>([])
  const [filtered, setFiltered] = useState<EditorProfile[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEditors = async () => {
      const { data, error } = await supabase.from('editors_profiles').select('*')
      if (error) {
        console.error('Error al cargar editores:', error.message)
      } else {
        setEditors(data || [])
        setFiltered(data || [])
      }
      setLoading(false)
    }

    fetchEditors()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase()
    setSearch(value)
    const filteredList = editors.filter(
      (editor) =>
        editor.bio.toLowerCase().includes(value) ||
        editor.specialties?.some((s) => s.toLowerCase().includes(value)) ||
        editor.languages?.some((l) => l.toLowerCase().includes(value))
    )
    setFiltered(filteredList)
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Buscar por especialidad, idioma..."
          className="w-full max-w-xl p-2 border rounded"
        />
        <PerfilButton />
      </div>

      {loading ? (
        <p className="text-gray-500">Cargando editores...</p>
      ) : filtered.length === 0 ? (
        <p className="text-gray-500">No se encontraron editores.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((editor) => (
            <div key={editor.id} className="p-4 border rounded shadow bg-white">
              <p className="text-lg font-semibold mb-1">{editor.bio}</p>
              <p className="text-sm text-gray-600">
                <strong>Especialidades:</strong> {editor.specialties?.join(', ')}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Idiomas:</strong> {editor.languages?.join(', ')}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Experiencia:</strong> {editor.experience_years} años
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Precio:</strong> {editor.price_range}
              </p>
              <Link
                href={`/editors/${editor.id}`}
                className="inline-block mt-2 text-blue-600 hover:underline"
              >
                Ver perfil
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
