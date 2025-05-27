import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'

type Props = {
  params: {
    id: string
  }
}

type EditorProfile = {
  id: string
  bio?: string
  specialties?: string[]
  languages?: string[]
  price_range?: string
  experience_years?: number
  portfolio_urls?: string[]
}

export default async function EditorProfilePage({ params }: { params: { id: string } }) {
  const id = params.id

  // Consulta tipada
  const { data, error } = await supabase
    .from('editors_profiles')
    .select('*')
    .eq('id', id)
    .single<EditorProfile>()

  if (error || !data) {
    console.error('Error cargando perfil:', error?.message)
    return notFound()
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-2">Perfil del editor</h1>
      <p className="mb-4 text-gray-600">{data.bio || 'Sin biografía disponible'}</p>
      <p><strong>Especialidades:</strong> {data.specialties?.join(', ') || 'No especificado'}</p>
      <p><strong>Idiomas:</strong> {data.languages?.join(', ') || 'No especificado'}</p>
      <p><strong>Rango de precios:</strong> {data.price_range || 'No especificado'}</p>
      <p><strong>Experiencia:</strong> {data.experience_years ? `${data.experience_years} años` : 'No especificado'}</p>
      {Array.isArray(data.portfolio_urls) && data.portfolio_urls.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold">Portafolio</h2>
          <ul className="list-disc ml-6 mt-2">
            {data.portfolio_urls.map((url: string, i: number) => (
              <li key={i}>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Proyecto {i + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}


