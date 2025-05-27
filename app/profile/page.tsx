'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import LogoutButton from '@/components/LogoutButton'

interface UserProfile {
  email: string
  name: string
  role: 'cliente' | 'editor'
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      // 1) Obtén la sesión
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session) return router.replace('/login')

      // 2) Lee la fila de users
      const { data, error } = await supabase
        .from('users')
        .select('email, name, role')
        .eq('id', session.user.id)
        .single()

      if (error || !data) {
        // Si algo falla o no hay fila, redirige a completar perfil
        router.replace('/complete-profile')
      } else {
        setProfile(data)
      }
      setLoading(false)
    })()
  }, [router, supabase])

  if (loading) {
    return <p className="flex items-center justify-center h-screen">Cargando perfil…</p>
  }
  if (!profile) return null

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white p-6 rounded shadow space-y-4">
        <h1 className="text-2xl font-bold">Mi Perfil</h1>
        <p><strong>Email:</strong> {profile.email}</p>
        <p><strong>Nombre:</strong> {profile.name}</p>
        <p><strong>Rol:</strong> {profile.role}</p>

        {profile.role === 'editor' && (
          <button
            onClick={() => router.push('/editor/profile')}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Editar perfil de editor
          </button>
        )}

        <LogoutButton />
      </div>
    </div>
  )
}
