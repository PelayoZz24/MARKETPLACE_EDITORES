// app/offers/[id]/page.tsx
'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter, useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function OfferDetail() {
  const supabase = createClientComponentClient()
  const router   = useRouter()
  const params   = useParams<{ id: string }>()
  const offerId  = params.id

  const [loading, setLoading] = useState(true)
  const [offer, setOffer]     = useState<any | null>(null)

  useEffect(() => {
    ;(async () => {
      const { data, error } = await supabase
        .from('offers')
        .select('*')
        .eq('id', offerId)
        .single()

      if (error) {
        console.error(error.message)
        router.replace('/404')   // o muestra un mensaje
        return
      }
      setOffer(data)
      setLoading(false)
    })()
  }, [offerId, supabase, router])

  if (loading) return <p className="p-10">Cargando…</p>
  if (!offer)  return <p className="p-10">Oferta no encontrada.</p>

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-3xl font-bold">{offer.title}</h1>
      <p className="text-gray-700">{offer.description}</p>

      <div className="font-semibold text-green-700 text-xl">
        € {offer.price.toFixed(2)}
      </div>
      <p className="text-sm text-gray-500">
        Plazo de entrega: {offer.delivery_time}
      </p>

      {/* muestra ejemplos si los hay */}
      {offer.sample_urls?.length > 0 && (
        <div className="grid grid-cols-2 gap-4 pt-4">
          {offer.sample_urls.map((url: string, idx: number) => (
            url.match(/\\.(mp4|webm|mov)$/i) ? (
              <video key={idx} src={url} controls className="w-full rounded" />
            ) : (
              <img  key={idx} src={url} alt=""       className="w-full rounded" />
            )
          ))}
        </div>
      )}
    </div>
  )
}
