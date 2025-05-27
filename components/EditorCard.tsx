// components/EditorCard.tsx
'use client'
import Link from 'next/link'

interface EditorCardProps {
  id: string
  bio: string
  specialties: string[]
}

export default function EditorCard({ id, bio, specialties }: EditorCardProps) {
  return (
    <div className="p-4 bg-white rounded shadow">
      <h4 className="font-semibold mb-1">{bio}</h4>
      <p className="text-sm text-gray-600 mb-2">{specialties.join(', ')}</p>
      <Link
        href={`/editors/${id}`}
        className="text-blue-600 hover:underline"
      >
        Ver perfil
      </Link>
    </div>
  )
}
