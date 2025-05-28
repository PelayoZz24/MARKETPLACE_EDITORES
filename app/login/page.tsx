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
      <form onSubmit={handleAuth} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg space-y-6 border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Correo electrónico</label>
          <input
            type="email"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input
            type="password"
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        
        <button
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-md shadow-sm transition duration-150 ease-in-out disabled:opacity-50"
        >
          {loading ? (isLogin ? 'Entrando...' : 'Registrando...') : (isLogin ? 'Iniciar sesión' : 'Crear cuenta')}
        </button>
        
        <p className="text-center text-sm text-gray-600">
          {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError(null)
            }}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {isLogin ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </p>
      </form>
    </div>
  )
}