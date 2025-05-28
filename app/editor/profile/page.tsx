// app/editor/profile/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import NavbarEditor from '../../../components/NavbarEditor'
import EncargoItem from '../../../components/EncargoItem'
import PortfolioItem from '../../../components/PortfolioItem'

interface Encargo {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'delivered'
  client_id: string
}

interface PortItem {
  url: string
}

export default function EditorDashboard() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [encargos, setEncargos] = useState<Encargo[]>([])
  const [portfolio, setPortfolio] = useState<PortItem[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        // 1) Sesión
        const { data: { session }, error: sessErr } = await supabase.auth.getSession()
        if (sessErr || !session) {
          router.replace('/login')
          return
        }
        const userId = session.user.id

        // 2) Pedidos asignados a este editor
        const { data: encData, error: encErr } = await supabase
          .from('orders')
          .select('id, title, status, client_id')
          .eq('editor_id', userId)
        if (encErr) throw new Error('Error cargando encargos: ' + encErr.message)

        // 3) Enriquecer con email de cliente
        const enriched = await Promise.all(
          (encData || []).map(async (e) => {
            const { data: userRow, error: userErr } = await supabase
              .from('users')
              .select('email')
              .eq('id', e.client_id)
              .single()
            return {
              ...e,
              client_email: userErr || !userRow ? '—' : userRow.email,
            }
          })
        )
        setEncargos(enriched as any)

        // 4) Perfil del editor (portafolio)
        const { data: profData, error: profErr } = await supabase
          .from('editors_profiles')
          .select('portfolio_urls')
          .eq('id', userId)
          .single()
        if (profErr) throw new Error('Error cargando portafolio: ' + profErr.message)

        // 5) Normalizar portfolio_urls a array de strings
        let urls: string[] = []
        if (Array.isArray(profData?.portfolio_urls)) {
          urls = profData.portfolio_urls
        } else if (typeof profData?.portfolio_urls === 'string') {
          urls = profData.portfolio_urls
            .split(',')
            .map(u => u.trim())
            .filter(u => u)
        }
        setPortfolio(urls.map(url => ({ url })))

      } catch (err: any) {
        console.error(err)
        setError(err.message || 'Ocurrió un error inesperado.')
      } finally {
        setLoading(false)
      }
    })()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Cargando dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarEditor />

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        {/* Sección de encargos */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tus encargos</h2>
          {encargos.length === 0 ? (
            <p className="text-gray-600">No tienes encargos asignados.</p>
          ) : (
            <div className="space-y-4">
              {encargos.map((e) => (
                <EncargoItem
                  key={e.id}
                  id={e.id}
                  title={e.title}
                  client_email={(e as any).client_email}
                  status={e.status}
                  onAction={(id) => {
                    // según estado, navegar o llamar API
                    if (e.status === 'pending') {
                      // aceptar encargo
                      console.log('Aceptar ', id)
                    } else if (e.status === 'in_progress') {
                      console.log('Marcar entregado ', id)
                    } else {
                      router.push(`/orders/${id}`)
                    }
                  }}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sección de portafolio */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tu portafolio</h2>
          {portfolio.length === 0 ? (
            <p className="text-gray-600">No has agregado vídeos aún.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((p, idx) => (
                <PortfolioItem key={idx} url={p.url} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
