'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createPatient(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const name = formData.get('name') as string
  const age = parseInt(formData.get('age') as string)
  const gender = formData.get('gender') as string
  const phone = formData.get('phone') as string
  const email = formData.get('email') as string
  const address = formData.get('address') as string

  const { data, error } = await supabase
    .from('patients')
    .insert([
      {
        user_id: user.id,
        name,
        age: isNaN(age) ? null : age,
        gender,
        phone,
        email,
        address,
      },
    ])
    .select()
    .single()

  if (error) {
    console.error('Error creating patient:', error)
    throw new Error('Failed to create patient')
  }

  redirect(`/patients/${data.id}`)
}
