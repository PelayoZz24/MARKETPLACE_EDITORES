'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

/**
 * Página: /app/editor/create-offer/page.tsx
 * Bucket público configurado con nombre offer-samples
 */
export default function CreateOfferPage() {
  const supabase = createClientComponentClient()
  const router   = useRouter()

  /* ---------- estados ---------- */
  const [title,         setTitle]         = useState('')
  const [description,   setDescription]   = useState('')
  const [price,         setPrice]         = useState<number | ''>('')
  const [deliveryTime,  setDeliveryTime]  = useState('')
  const [files,         setFiles]         = useState<FileList | null>(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  /* ---------- submit ---------- */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    /* sesión */
    const {
      data: { session },
      error: sessErr,
    } = await supabase.auth.getSession()
    if (sessErr || !session) {
      setError('Debes iniciar sesión')
      setLoading(false)
      return
    }
    const editor_id = session.user.id

    /* subir archivos al bucket público */
    const uploadedUrls: string[] = []
    if (files && files.length > 0) {
      const bucket = supabase.storage.from('offer-samples')

      for (const file of Array.from(files)) {
        /* limpiar nombre: quitar acentos y caracteres no válidos */
        const sanitized = file.name
          .normalize('NFD')
          .replace(/[^a-zA-Z0-9._-]/g, '_')

        const path = `${editor_id}/${crypto.randomUUID()}-${sanitized}`

        const { error: upErr } = await bucket.upload(path, file, {
          cacheControl: '3600',
          upsert: false,
        })
        if (upErr) {
          setError(`Error subiendo ${file.name}: ${upErr.message}`)
          setLoading(false)
          return
        }
        /* URL pública */
        const { data } = bucket.getPublicUrl(path)
        uploadedUrls.push(data.publicUrl)
      }
    }

    /* insertar oferta */
    const { error: insertErr } = await supabase.from('offers').insert({
      editor_id,
      title,
      description,
      price: price === '' ? null : price,
      delivery_time: deliveryTime,
      sample_urls: uploadedUrls,
    })

    if (insertErr) {
      setError(insertErr.message)
      setLoading(false)
      return
    }

    router.push('/editor/dashboard')
  }

  /* ---------- UI ---------- */
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-10 px-4">
      <div className="w-full max-w-xl bg-white p-8 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-6">Crear nueva oferta</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Título */}
          <div>
            <label className="block font-medium mb-1">Título</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block font-medium mb-1">Descripción</label>
            <textarea
              className="w-full border rounded px-3 py-2 h-28 resize-y"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Precio y Plazo */}
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Precio (€)</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="number"
                min={0}
                step="0.01"
                value={price}
                onChange={(e) =>
                  setPrice(e.target.value === '' ? '' : Number(e.target.value))
                }
              />
            </div>

            <div className="flex-1">
              <label className="block font-medium mb-1">Plazo de entrega</label>
              <input
                className="w-full border rounded px-3 py-2"
                type="text"
                placeholder="p. ej. 3 días"
                value={deliveryTime}
                onChange={(e) => setDeliveryTime(e.target.value)}
              />
            </div>
          </div>

          {/* Archivos */}
          <div>
            <label className="block font-medium mb-1">
              Ejemplos (imágenes o vídeos)
            </label>
            <input
              className="w-full border rounded px-3 py-2"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => setFiles(e.target.files)}
            />
          </div>

          {/* Error */}
          {error && <p className="text-red-600">{error}</p>}

          {/* Botón */}
          <button
            className="w-full bg-green-600 text-white py-2 rounded font-semibold hover:bg-green-700 disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Guardando…' : 'Publicar oferta'}
          </button>
        </form>
      </div>
    </div>
  )
}
