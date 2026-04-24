'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function createVisit(patientId: string, formData: FormData, prescriptionData: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const visit_date = formData.get('visit_date') as string
  const chief_complaint = formData.get('chief_complaint') as string
  const symptoms = formData.get('symptoms') as string
  const diagnosis = formData.get('diagnosis') as string
  const bp = formData.get('bp') as string
  const temperature = formData.get('temperature') as string
  const heart_rate = formData.get('heart_rate') as string
  const notes = formData.get('notes') as string
  let next_visit_date = formData.get('next_visit_date') as string

  if (!next_visit_date) {
    next_visit_date = null as any
  }

  // Insert Visit
  const { data: visit, error: visitError } = await supabase
    .from('visits')
    .insert([
      {
        patient_id: patientId,
        user_id: user.id,
        visit_date,
        chief_complaint,
        symptoms,
        diagnosis,
        bp,
        temperature,
        heart_rate,
        notes,
        next_visit_date,
      },
    ])
    .select()
    .single()

  if (visitError) {
    console.error('Error creating visit:', visitError)
    throw new Error('Failed to create visit')
  }

  // Insert Prescription
  const medicines = JSON.parse(prescriptionData)
  
  if (medicines.length > 0) {
    // Check for custom medicines to add to DB
    const customMedsToInsert = medicines
      .filter((m: any) => m.isNewCustom)
      .map((m: any) => ({
        user_id: user.id,
        medicine_name: m.medicine_name,
        is_custom: true,
      }))
    
    if (customMedsToInsert.length > 0) {
      await supabase.from('medicines').insert(customMedsToInsert)
    }

    // Insert prescription record
    const { error: prescError } = await supabase
      .from('prescriptions')
      .insert([
        {
          visit_id: visit.id,
          user_id: user.id,
          medicines: medicines.map((m: any) => ({
            medicine_name: m.medicine_name,
            dosage: m.dosage,
            frequency: m.frequency,
            duration: m.duration,
            instructions: m.instructions
          })),
        },
      ])

    if (prescError) {
      console.error('Error creating prescription:', prescError)
      throw new Error('Failed to create prescription')
    }
  }

  redirect(`/patients/${patientId}/visits/${visit.id}`)
}
