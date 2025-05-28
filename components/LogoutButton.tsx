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
      className="ml-2 md:ml-4 flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1" /></svg>
      Cerrar sesión
    </button>
  )
}
