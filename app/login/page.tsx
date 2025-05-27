'use client'
import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createClientComponentClient()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    if (isLogin) {
      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
      if (authError || !data.user) {
        setError(authError?.message || 'Error al iniciar sesión')
      } else {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single()
        if (userError) setError('Error consultando tu rol: ' + userError.message)
        else if (!userData) router.push('/complete-profile')
        else router.push(userData.role === 'cliente' ? '/cliente/dashboard' : '/editor/dashboard')
      }
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError || !data.user) {
        setError(signUpError?.message || 'Error al registrarse')
      } else {
        await supabase.from('users').insert({ id: data.user.id, email, role: 'cliente', name: '' })
        router.push('/complete-profile')
      }
    }

    setLoading(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form onSubmit={handleAuth} className="w-full max-w-md bg-white p-8 rounded shadow space-y-6">
        <h2 className="text-2xl font-bold text-center">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        {error && <div className="text-red-600">{error}</div>}
        <input type="email" placeholder="Correo electrónico" className="w-full p-2 border rounded" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" className="w-full p-2 border rounded" value={password} onChange={e => setPassword(e.target.value)} required />
        <button disabled={loading} className="w-full bg-blue-600 disabled:opacity-50 text-white py-2 rounded hover:bg-blue-700 transition">
          {loading ? isLogin ? 'Entrando...' : 'Registrando...' : isLogin ? 'Entrar' : 'Registrarse'}
        </button>
        <p className="text-center text-sm">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-blue-600 underline">
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </form>
    </div>
  )
}