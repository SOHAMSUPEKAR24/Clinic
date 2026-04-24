import { createClient, verifySubscription } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')

  if (!q) {
    return NextResponse.json([])
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Rate Limiting (60 requests per minute per user)
  const rateLimitResult = rateLimit(`med_search_${user.id}`, { interval: 60000, limit: 60 })
  if (!rateLimitResult.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  // Subscription Check
  const isActive = await verifySubscription(user.id)
  if (!isActive) {
    return NextResponse.json({ error: 'Subscription expired' }, { status: 403 })
  }

  // Full text search on medicines, OR custom medicines for this user
  const { data, error } = await supabase
    .from('medicines')
    .select('id, medicine_name, strength, dosage_form, manufacturer, is_custom')
    .or(`user_id.is.null,user_id.eq.${user.id}`)
    .textSearch('medicine_name', `${q.split(' ').join(' & ')}:*`)
    .limit(20)

  if (error) {
    // Fallback to ilike if textSearch fails (e.g., small search)
    const { data: fallbackData } = await supabase
      .from('medicines')
      .select('id, medicine_name, strength, dosage_form, manufacturer, is_custom')
      .or(`user_id.is.null,user_id.eq.${user.id}`)
      .ilike('medicine_name', `%${q}%`)
      .limit(20)
    
    return NextResponse.json(fallbackData || [])
  }

  return NextResponse.json(data || [])
}
