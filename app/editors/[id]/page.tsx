import { supabase } from '../../../lib/supabase'
import { notFound } from 'next/navigation'
import { FiAward, FiGlobe, FiDollarSign, FiClock, FiLink, FiAlertTriangle } from 'react-icons/fi'

// Mejor tipado y validación
type EditorProfile = {
  id: string
  full_name?: string
  avatar_url?: string
  bio?: string | null
  specialties?: string[] | string | null
  languages?: string[] | string | null
  price_range?: string | null
  experience_years?: number | null
  portfolio_urls?: string[] | null
}

function normalizeStringArray(input: string[] | string | null | undefined): string[] {
  try {
    if (!input) return []
    if (Array.isArray(input)) return input
    if (typeof input === 'string') {
      try {
        const parsed = JSON.parse(input)
        return Array.isArray(parsed) ? parsed : [parsed].filter(Boolean)
      } catch {
        return input.split(',').map(s => s.trim()).filter(Boolean)
      }
    }
    return []
  } catch (error) {
    console.error('Error normalizando array:', error)
    return []
  }
}

const InfoCard = ({ icon: Icon, title, value }: { icon: React.ComponentType<{ className?: string }>, title: string, value: React.ReactNode }) => (
  <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
    <div className="flex items-center mb-2 text-indigo-600">
      <Icon className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">{title}</span>
    </div>
    <div className="text-gray-800 font-medium">
      {value || <span className="text-gray-400">No especificado</span>}
    </div>
  </div>
)

export default async function EditorProfilePage({ params }: { params: { id: string } }) {
  const id = params.id
  if (!id) {
    console.error('ID de editor no proporcionado')
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-editor/10 to-accent-editor/10">
        <div className="bg-white p-8 rounded-xl shadow-lg flex flex-col items-center border border-neutral-200">
          <FiAlertTriangle className="text-warning w-10 h-10 mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold mb-2 text-neutral-900">ID de editor no proporcionado</h2>
          <p className="text-neutral-500">No se encontró el identificador del editor.</p>
        </div>
      </div>
    )
  }

  let data: EditorProfile | null = null
  let error: any = null
  try {
    const res = await supabase
      .from('editors_profiles')
      .select('*')
      .eq('id', id)
      .single<EditorProfile>()
    data = res.data
    error = res.error
  } catch (err) {
    error = err
    console.error('Error inesperado:', err)
  }

  if (error || !data) {
    console.error('Error cargando perfil:', error)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-100 to-pink-100">
        <div className="bg-white p-8 rounded shadow flex flex-col items-center">
          <FiAlertTriangle className="text-red-500 w-10 h-10 mb-4" />
          <h2 className="text-xl font-bold mb-2">Error cargando el perfil</h2>
          <p className="text-gray-600">{error?.message || 'No se pudo cargar el perfil. Por favor, revisa la consola para más detalles.'}</p>
        </div>
      </div>
    )
  }

  const specialties = normalizeStringArray(data.specialties)
  const languages = normalizeStringArray(data.languages)
  const portfolioUrls = Array.isArray(data.portfolio_urls) ? data.portfolio_urls.filter(Boolean) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-indigo-100">
        <div className="flex flex-col items-center mb-8">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold shadow-lg mb-4">
            {data.full_name ? data.full_name.charAt(0).toUpperCase() : 'E'}
          </div>
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">{data.full_name || 'Editor sin nombre'}</h1>
          <p className="mb-4 text-gray-600 text-center max-w-xl">{data.bio || 'Sin biografía disponible'}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <InfoCard icon={FiAward} title="Especialidades" value={specialties.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {specialties.map((specialty, i) => (
                <span key={i} className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                  {specialty}
                </span>
              ))}
            </div>
          ) : null} />
          <InfoCard icon={FiGlobe} title="Idiomas" value={languages.length > 0 ? languages.join(', ') : null} />
          <InfoCard icon={FiDollarSign} title="Rango de precios" value={data.price_range} />
          <InfoCard icon={FiClock} title="Experiencia" value={data.experience_years ? `${data.experience_years} ${data.experience_years === 1 ? 'año' : 'años'}` : null} />
        </div>
        {portfolioUrls.length > 0 && (
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
            <h2 className="text-xl font-semibold text-indigo-800 mb-4 flex items-center">
              <FiLink className="mr-2 text-indigo-600" />
              Portafolio
            </h2>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              {portfolioUrls.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-indigo-700 underline hover:text-purple-600 transition-colors">
                    Proyecto {i + 1} <span className="text-xs text-gray-500">({url})</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

