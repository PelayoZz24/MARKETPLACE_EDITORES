'use client'

import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function LogoutButton() {
  const router = useRouter()

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Error al cerrar sesión: ' + error.message)
    } else {
      router.push('/login')
    }
  }

  return (
    <button
      onClick={handleLogout}
      className="mt-6 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
    >
      Cerrar sesión
    </button>
  )
}
