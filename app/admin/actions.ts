'use server'

import { createAdminClient, createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { logger } from '@/lib/logger'

export async function createUser(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const duration = parseInt(formData.get('duration') as string)

  const adminClient = createAdminClient()
  
  const email = `${username}@clinic.internal`

  // 1. Create auth user using Admin API
  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError || !authData.user) {
    console.error('Failed to create auth user', authError)
    throw new Error(authError?.message || 'Failed to create user')
  }

  // Calculate subscription end date
  const subEnd = new Date()
  subEnd.setDate(subEnd.getDate() + duration)

  // 2. Insert into profiles (bypassing RLS or using admin privileges via service role)
  const { error: profileError } = await adminClient
    .from('profiles')
    .insert({
      id: authData.user.id,
      username,
      role: 'user',
      subscription_end: subEnd.toISOString(),
    })

  if (profileError) {
    console.error('Failed to create profile', profileError)
    throw new Error('Failed to create profile')
  }

  // 3. Initialize default clinic settings
  await adminClient.from('clinic_settings').insert({
    user_id: authData.user.id,
    clinic_name: 'New Clinic',
  })

  revalidatePath('/admin')
}

export async function extendSubscription(userId: string, durationDays: number, formData: FormData) {
  const adminClient = createAdminClient()
  
  // Get current sub
  const { data: profile } = await adminClient.from('profiles').select('subscription_end').eq('id', userId).single()
  
  if (!profile) throw new Error('User not found')

  let newEnd = new Date()
  if (profile.subscription_end) {
    const currentEnd = new Date(profile.subscription_end)
    if (currentEnd > new Date()) {
      newEnd = currentEnd
    }
  }
  newEnd.setDate(newEnd.getDate() + durationDays)

  const { error } = await adminClient
    .from('profiles')
    .update({ subscription_end: newEnd.toISOString() })
    .eq('id', userId)

  if (error) {
    throw new Error('Failed to extend subscription')
  }

  revalidatePath('/admin')
}

export async function updateClinicSettings(userId: string, formData: FormData) {
  const adminClient = createAdminClient()
  
  const updates = {
    clinic_name: formData.get('clinic_name') as string,
    doctor_name: formData.get('doctor_name') as string,
    reg_number: formData.get('reg_number') as string,
    phone: formData.get('phone') as string,
    email: formData.get('email') as string,
    address: formData.get('address') as string,
    city: formData.get('city') as string,
    state: formData.get('state') as string,
    pin: formData.get('pin') as string,
  }

  const { error } = await adminClient
    .from('clinic_settings')
    .update(updates)
    .eq('user_id', userId)

  if (error) {
    console.error('Failed to update clinic settings', error)
    throw new Error('Failed to update clinic settings')
  }

  revalidatePath('/admin')
  revalidatePath(`/admin/users/${userId}`)
}
