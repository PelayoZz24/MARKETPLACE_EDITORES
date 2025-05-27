// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()
  // LOG DE DEPURACIÓN
  console.log('MIDDLEWARE SESSION:', session)
  return res
}

export const config = {
  matcher: [
    /*
      Aquí listamos explícitamente SOLO las rutas que queremos
      proteger con sesión:
    */
    '/cliente/:path*',
    '/editor/:path*',
    // si más adelante proteges /editors/[id]/contratar, etc.
  ],
}
