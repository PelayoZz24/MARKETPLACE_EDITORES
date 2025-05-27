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
      className="ml-4 bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700"
    >
      Tu perfil
    </button>
  )
}
