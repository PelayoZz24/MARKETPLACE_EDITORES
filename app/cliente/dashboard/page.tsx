'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import NavbarCliente from '../../../components/NavbarCliente'
import PedidoCard from '../../../components/PedidoCard'
import EditorCard from '../../../components/EditorCard'

interface Pedido {
  id: string
  title: string
  status: 'pending' | 'in_progress' | 'delivered'
}
interface EditorProfile {
  id: string
  bio: string
  specialties: string[]
}

export default function ClienteDashboard() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [topEditors, setTopEditors] = useState<EditorProfile[]>([])

  useEffect(() => {
    ;(async () => {
      // 1. Verificar sesión
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.replace('/login')
        return
      }

      const userId = session.user.id

      // 2. Cargar pedidos del cliente
      const { data: pedidosData, error: pedidosError } = await supabase
        .from('orders')
        .select('id, title, status')
        .eq('client_id', userId)
        .limit(4)

      if (pedidosError) {
        console.error('Error cargando pedidos:', pedidosError.message)
      } else {
        setPedidos(pedidosData || [])
      }

      // 3. Cargar top editores
      const { data: editorsData, error: editorsError } = await supabase
        .from('editors_profiles')
        .select('id, bio, specialties')
        .limit(4)

      if (editorsError) {
        console.error('Error cargando editores:', editorsError.message)
      } else {
        setTopEditors(editorsData || [])
      }

      setLoading(false)
    })()
  }, [router, supabase])

  if (loading) {
    return <p className="flex items-center justify-center h-screen">Cargando...</p>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <NavbarCliente />

      <main className="max-w-6xl mx-auto p-6 space-y-10">
        {/* Sección Tus pedidos */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Tus pedidos</h2>
          {pedidos.length === 0 ? (
            <p className="text-gray-600">No tienes pedidos todavía.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pedidos.map((p) => (
                <PedidoCard
                  key={p.id}
                  title={p.title}
                  status={p.status}
                  onView={() => router.push(`/orders/${p.id}`)}
                />
              ))}
            </div>
          )}
        </section>

        {/* Sección Explorar editores */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Explorar editores</h2>
          {topEditors.length === 0 ? (
            <p className="text-gray-600">No hay editores disponibles.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {topEditors.map((ed) => (
                <EditorCard
                  key={ed.id}
                  id={ed.id}
                  bio={ed.bio}
                  specialties={ed.specialties}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
