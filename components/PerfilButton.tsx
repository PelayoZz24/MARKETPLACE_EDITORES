// components/PerfilButton.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function PerfilButton() {
  const [loading, setLoading] = useState(true)
  const [destino, setDestino] = useState<string>('/login')
  const supabase = createClientComponentClient()
  const router = useRouter()

  useEffect(() => {
    ;(async () => {
      // Comprueba sesión
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setDestino('/login')
      } else {
        // Si hay sesión, simple: vamos siempre a /profile
        setDestino('/profile')
      }

      setLoading(false)
    })()
  }, [supabase])

  if (loading) return null

  return (
    <button
      onClick={() => router.push(destino)}
      className="ml-2 md:ml-4 flex items-center gap-2 bg-primary-cliente text-white px-4 py-2 rounded-lg font-semibold shadow transition-colors duration-200 hover:bg-primary-cliente/80 focus:outline-none focus:ring-2 focus:ring-primary-cliente"
    >
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
      Tu perfil
    </button>
  )
}
