// components/EditorCard.tsx
'use client'
import Link from 'next/link'

interface EditorCardProps {
  id: string
  bio: string
  specialties: string[] | string | null | undefined
}

export default function EditorCard({ id, bio, specialties }: EditorCardProps) {
  const specialtiesArray = Array.isArray(specialties)
    ? specialties
    : typeof specialties === 'string'
    ? specialties.split(',').map((s) => s.trim())
    : []

  return (
    <div className="bg-white rounded-xl border border-neutral-200 shadow-md p-4 mb-4 transition-shadow hover:shadow-xl hover:scale-105 group flex flex-col gap-2">
      <h4 className="text-lg font-semibold text-neutral-900 mb-1">{bio}</h4>
      <div className="flex items-center gap-2 mb-2">
        <svg className="w-5 h-5 text-accent-editor" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 21l3-1.5L15 21l-.75-4M12 3v6m0 0l3 3m-3-3l-3 3" /></svg>
        <p className="text-sm text-neutral-400 font-medium">{specialtiesArray.join(', ')}</p>
      </div>
      <Link
        href={`/editors/${id}`}
        className="text-accent-editor font-semibold hover:underline transition-colors"
      >
        Ver perfil
      </Link>
    </div>
  )
}
