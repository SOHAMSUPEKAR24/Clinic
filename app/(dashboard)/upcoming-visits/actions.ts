'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function markVisitCompleted(visitId: string, formData: FormData) {
  const supabase = await createClient()
  
  // Clears the next_visit_date so it's no longer 'upcoming'
  const { error } = await supabase
    .from('visits')
    .update({ next_visit_date: null })
    .eq('id', visitId)

  if (error) {
    console.error('Failed to mark completed', error)
  }
  
  revalidatePath('/upcoming-visits')
  revalidatePath('/dashboard')
}
