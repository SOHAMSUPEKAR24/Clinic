import { createClient, verifySubscription } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  
  if (!(await verifySubscription(user.id))) return NextResponse.json({ error: 'Subscription expired' }, { status: 403 })

  const { data } = await supabase.from('patients').select('id, name, age, phone').eq('user_id', user.id)
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!(await verifySubscription(user.id))) return NextResponse.json({ error: 'Subscription expired' }, { status: 403 })

  const body = await request.json()
  const { data, error } = await supabase.from('patients').insert([{ ...body, user_id: user.id }]).select().single()
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
