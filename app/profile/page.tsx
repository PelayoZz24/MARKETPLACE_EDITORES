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
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <span className="animate-pulse text-lg text-gray-900 font-medium">Cargando perfil…</span>
      </div>
    )
  }
  if (!profile) return null

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Información del perfil</h2>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-medium">Nombre:</span> {profile.name || 'No proporcionado'}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> {profile.email}
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Rol:</span> <span className="capitalize">{profile.role}</span>
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-200">
              <button
                onClick={handleLogout}
                className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-semibold shadow transition-colors duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Cerrar sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
