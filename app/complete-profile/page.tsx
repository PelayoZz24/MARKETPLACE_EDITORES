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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto space-y-8">
        <h2 className="text-center text-3xl font-extrabold">Completa tu perfil</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Nombre completo</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="role">Tipo de cuenta</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="cliente">Cliente</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-green-600 text-white p-2 rounded">
            {loading ? 'Guardando...' : 'Guardar perfil'}
          </button>
        </form>
      </div>
    </div>
  )
}