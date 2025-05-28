// app/editor/dashboard/page.tsx
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
  client_email: string
  status: 'pending' | 'in_progress' | 'delivered'
}

interface PortItem {
  url: string
}

interface Offer {
  id: string
  title: string
  description: string | null
  price: number
  delivery_time: string | null
  active: boolean
}

export default function EditorDashboard() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [encargos, setEncargos] = useState<Encargo[]>([])
  const [portfolio, setPortfolio] = useState<PortItem[]>([])
  const [offers, setOffers] = useState<Offer[]>([])

  useEffect(() => {
    ;(async () => {
      /* ---------------------- SESIÓN ---------------------- */
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }
      const userId = session.user.id

      /* --------------------- ENCARGOS ---------------------- */
      const { data: encData } = await supabase
        .from('orders')
        .select('id, title, status, client_id')
        .eq('editor_id', userId)

      const enriched = await Promise.all(
        (encData || []).map(async (e) => {
          const { data: u } = await supabase
            .from('users')
            .select('email')
            .eq('id', e.client_id)
            .single()
          return { ...e, client_email: u?.email || '—' }
        })
      )
      setEncargos(enriched as Encargo[])

      /* --------------------- PORTAFOLIO -------------------- */
      const { data: portData } = await supabase
        .from('editors_profiles')
        .select('portfolio_urls')
        .eq('id', userId)
        .single()

      let urls: string[] = []
      if (Array.isArray(portData?.portfolio_urls)) urls = portData.portfolio_urls
      else if (typeof portData?.portfolio_urls === 'string') {
        try {
          urls = JSON.parse(portData.portfolio_urls)
        } catch {
          urls = []
        }
      }
      setPortfolio(urls.map((url) => ({ url })))

      /* ----------------------- OFFERS ---------------------- */
      const { data: offersData } = await supabase
        .from('offers')
        .select('id, title, description, price, delivery_time, active')
        .eq('editor_id', userId)
        .order('created_at', { ascending: false })

      setOffers((offersData || []) as Offer[])

      setLoading(false)
    })()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Cargando…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarEditor />

      <main className="max-w-6xl mx-auto p-6 space-y-12">
        {/* ENCARGOS ---------------------------------------------------- */}
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

        {/* PORTAFOLIO -------------------------------------------------- */}
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

        {/* OFFERS ------------------------------------------------------ */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tus ofertas publicadas</h2>

          {offers.length === 0 ? (
            <p className="text-gray-600">
              Aún no has creado ofertas. Usa el botón “Crear oferta” en la barra superior.
            </p>
          ) : (
            <div className="space-y-4">
              {offers.map((o) => (
                <div
                  key={o.id}
                  className="bg-white rounded-lg shadow p-5 flex flex-col sm:flex-row sm:items-center justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold">{o.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {o.description}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Plazo: {o.delivery_time || '—'}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:text-right">
                    <p className="text-xl font-bold text-green-700">
                      € {o.price.toFixed(2)}
                    </p>
                    {!o.active && (
                      <span className="text-xs text-red-600">Inactiva</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
