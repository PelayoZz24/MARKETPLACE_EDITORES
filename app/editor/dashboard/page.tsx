// app/editor/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import NavbarEditor from '../../../components/NavbarEditor'
import EncargoItem from '../../../components/EncargoItem'
import PortfolioItem from '../../../components/PortfolioItem'
import { useRouter } from 'next/navigation'

interface Encargo { id: string; title: string; client_email: string; status: 'pending' | 'in_progress' | 'delivered' }
interface PortItem { url: string; title: string }

export default function EditorDashboard() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [encargos, setEncargos] = useState<Encargo[]>([])
  const [portfolio, setPortfolio] = useState<PortItem[]>([])

  useEffect(() => {
    ;(async () => {
      // Verifica sesión
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return router.replace('/login')
      const userId = session.user.id

      // Carga encargos
      const { data: encData } = await supabase
        .from('orders')
        .select('id, title, status, client_id')
        .eq('editor_id', userId)
      // Obtener email de cliente para cada
      const enriched = await Promise.all(
        (encData || []).map(async (e) => {
          const { data: u } = await supabase.from('users').select('email').eq('id', e.client_id).single()
          return { ...e, client_email: u?.email || '—' }
        })
      )
      setEncargos(enriched as Encargo[])

      // Carga portafolio
      const { data: portData } = await supabase
        .from('editors_profiles')
        .select('portfolio_urls')
        .eq('id', userId)
        .single()
      setPortfolio(
        (portData?.portfolio_urls || []).map((url: string) => ({ url }))
      )

      setLoading(false)
    })()
  }, [supabase, router])

  if (loading) {
    return <p className="flex items-center justify-center h-screen">Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarEditor />
      <main className="max-w-6xl mx-auto p-6 space-y-10">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tus encargos</h2>
          {encargos.length === 0 ? (
            <p className="text-gray-600">No tienes encargos.</p>
          ) : (
            <div className="space-y-4">
              {encargos.map((e) => (
                <EncargoItem
                  key={e.id}
                  id={e.id}
                  title={e.title}
                  status={e.status}
                  client_email={e.client_email}
                  onAction={(id) => console.log('Acción en encargo', id)}
                />
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Tu portafolio</h2>
          {portfolio.length === 0 ? (
            <p className="text-gray-600">No has agregado vídeos.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolio.map((p, i) => (
                <PortfolioItem key={i} url={p.url} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
