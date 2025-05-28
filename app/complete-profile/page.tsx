'use client'
import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

interface FormData { role: 'cliente' | 'editor'; name: string }

export default function CompleteProfile() {
  const [formData, setFormData] = useState<FormData>({ role: 'cliente', name: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string>('')

  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    ;(async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) return router.push('/login')
      setUserId(user.id)
      setUserEmail(user.email!)  
      const { data: profileData, error: profileError } = await supabase.from('users').select('role,name').eq('id', user.id).single()
      if (!profileError && profileData) setFormData({ role: profileData.role, name: profileData.name })
    })()
  }, [router, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value as any }))
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !userEmail) return setError('Sesión expirada, inicia de nuevo')
    if (!formData.name.trim()) return setError('El nombre es obligatorio')
    setLoading(true)
    const { error: upsertError } = await supabase.from('users').upsert([{ id: userId, email: userEmail, role: formData.role, name: formData.name }])
    if (upsertError) { setError(upsertError.message); setLoading(false); return }
    router.push(`/${formData.role}/dashboard`)
  }

  if (!userId) return <div className="flex items-center justify-center h-screen">Cargando...</div>

  return (
    <div className="min-h-screen bg-neutral-100 py-12 px-4 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-neutral-200 space-y-8">
        <h2 className="text-center text-3xl md:text-4xl font-extrabold text-primary-cliente mb-4">Completa tu perfil</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded flex items-center gap-2"><svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-1.414 1.414A9 9 0 105.636 18.364l1.414-1.414" /></svg> {error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block mb-1 font-semibold text-neutral-900">Nombre completo</label>
            <div className="relative">
              <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cliente bg-neutral-50 text-neutral-900 transition-shadow shadow-sm hover:shadow-md" required />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-cliente"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 15c2.485 0 4.797.657 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg></span>
            </div>
          </div>
          <div>
            <label htmlFor="role" className="block mb-1 font-semibold text-neutral-900">Tipo de cuenta</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-cliente bg-neutral-50 text-neutral-900">
              <option value="cliente">Cliente</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-success text-white py-2 rounded-lg font-semibold shadow transition-colors duration-200 hover:bg-success/80 focus:outline-none focus:ring-2 focus:ring-success disabled:opacity-50">
            {loading ? <span className="flex items-center justify-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></span>Guardando...</span> : 'Guardar perfil'}
          </button>
        </form>
      </div>
    </div>
  )
}