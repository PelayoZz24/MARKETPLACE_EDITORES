// lib/supabase/server.ts
'use server'

import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  return createServerComponentClient<any>({ cookies })
}
