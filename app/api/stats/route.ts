import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [patients, visits] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('visits').select('id', { count: 'exact', head: true }).eq('user_id', user.id)
  ])

  return NextResponse.json({
    totalPatients: patients.count || 0,
    totalVisits: visits.count || 0
  })
}
