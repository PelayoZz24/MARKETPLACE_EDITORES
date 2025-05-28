'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

import NavbarCliente from '../../../components/NavbarCliente'
import PedidoCard    from '../../../components/PedidoCard'

/* ─────────────────── Tipos ─────────────────── */
interface Pedido {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'delivered'
}

/*  Simplificamos: por ahora solo necesitamos los datos de la oferta.
    Más adelante podrás hacer otra query para traer la bio del editor. */
interface Offer {
  id: string
  title: string
  description: string | null
  price: number
  delivery_time: string | null
}

export default function ClienteDashboard() {
  const supabase = createClientComponentClient()
  const router   = useRouter()

  const [loading, setLoading] = useState(true)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [offers,  setOffers]  = useState<Offer[]>([])

  /* ───── carga inicial ───── */
  useEffect(() => {
    ;(async () => {
      /* Sesión */
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/login')
        return
      }
      const userId = session.user.id

      /* Pedidos */
      const { data: pedidosData } = await supabase
        .from('orders')
        .select('id, title, status')
        .eq('client_id', userId)
        .limit(4)

      setPedidos((pedidosData || []) as Pedido[])

      /* Ofertas activas  */
      const { data: offersData, error: offersErr } = await supabase
        .from('offers')
        .select('id, title, description, price, delivery_time')
        .eq('active', true)
        .order('created_at', { ascending: false })
        .limit(4)

      if (offersErr) {
        console.error('Error cargando ofertas:', offersErr.message)
      } else {
        setOffers((offersData || []) as Offer[])
      }

      setLoading(false)
    })()
  }, [router, supabase])

  /* ───── loader ───── */
  if (loading) {
    return (
      <div className="bg-neutral-100 min-h-screen">
        <NavbarCliente />
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-cliente">
            Tus pedidos recientes
          </h1>
          <span className="animate-pulse text-neutral-400">Cargando…</span>
        </main>
      </div>
    )
  }

  /* ───── UI ───── */
  return (
    <div className="bg-neutral-100 min-h-screen">
      <NavbarCliente />

      <main className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
        {/* ▸ Pedidos */}
        <section>
          <h1 className="text-3xl md:text-4xl font-bold mb-8 text-primary-cliente">
            Tus pedidos recientes
          </h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pedidos.length === 0 ? (
              <p className="col-span-2 text-neutral-400">
                No tienes pedidos recientes.
              </p>
            ) : (
              pedidos.map((p) => (
                <PedidoCard
                  key={p.id}
                  title={p.title}
                  status={p.status}
                  onView={() => router.push(`/orders/${p.id}`)}
                />
              ))
            )}
          </div>
        </section>

        {/* ▸ Ofertas destacadas */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2 text-primary-cliente">
            <svg className="w-6 h-6 text-accent-cliente" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M13 16h-1v-4h-1m4 0h.01M12 20c4.418 0 8-1.79 8-4V6c0-2.21-3.582-4-8-4S4 3.79 4 6v10c0 2.21 3.582 4 8 4z"/>
            </svg>
            Explora editores destacados
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {offers.length === 0 ? (
              <p className="col-span-4 text-neutral-400">No hay ofertas activas.</p>
            ) : (
              offers.map((o) => (
                <OfferCard
                  key={o.id}
                  offer={o}
                  onClick={() => router.push(`/offers/${o.id}`)}
                />
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

/* ───── Tarjeta Oferta ───── */
function OfferCard({ offer, onClick }: { offer: Offer; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white rounded-lg shadow p-4 hover:shadow-md transition flex flex-col h-full"
    >
      <h3 className="font-semibold text-lg mb-0.5">{offer.title}</h3>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {offer.description}
      </p>

      <div className="mt-auto">
        <span className="text-green-700 font-bold">
          € {offer.price.toFixed(2)}
        </span>
        <span className="block text-xs text-gray-500">
          Plazo: {offer.delivery_time}
        </span>
      </div>
    </div>
  )
}
