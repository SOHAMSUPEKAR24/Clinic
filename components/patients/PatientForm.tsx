'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'
import { createPatient } from '@/app/(dashboard)/patients/new/actions'
import { Modal } from '@/components/ui/modal'
import { AlertCircle, UserPlus } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface DuplicatePatient {
  id: string
  name: string
  age: number | null
  phone: string | null
}

export function PatientForm() {
  const [isPending, startTransition] = useTransition()
  const [showDuplicateModal, setShowDuplicateModal] = useState(false)
  const [duplicates, setDuplicates] = useState<DuplicatePatient[]>([])
  const [formData, setFormData] = useState<FormData | null>(null)
  
  const supabase = createClient()

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = fd.get('name') as string
    const phone = fd.get('phone') as string

    // Check for duplicates
    const { data: existingPatients, error } = await supabase
      .from('patients')
      .select('id, name, age, phone')
      .ilike('name', `%${name}%`) // Partial match for name
    
    if (error) {
      console.error('Error checking duplicates:', error)
      // If check fails, just proceed
      submitPatient(fd)
      return
    }

    // Filter for exact or close matches
    const potentialDuplicates = existingPatients?.filter(p => {
      const nameMatch = p.name.toLowerCase() === name.toLowerCase()
      const phoneMatch = phone && p.phone === phone
      return nameMatch || phoneMatch
    }) || []

    if (potentialDuplicates.length > 0) {
      setDuplicates(potentialDuplicates)
      setFormData(fd)
      setShowDuplicateModal(true)
    } else {
      submitPatient(fd)
    }
  }

  const submitPatient = (fd: FormData) => {
    startTransition(async () => {
      try {
        await createPatient(fd)
      } catch (error: unknown) {
        const message = error instanceof Error ? error.message : 'An unknown error occurred'
        toast.error(message || 'Failed to create patient')
      }
    })
  }

  const handleProceedAnyway = () => {
    if (formData) {
      submitPatient(formData)
      setShowDuplicateModal(false)
    }
  }

  return (
    <>
      <form onSubmit={handleFormSubmit} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="md:col-span-2">
            <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              placeholder="e.g. John Doe"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Age
            </label>
            <input
              type="number"
              name="age"
              id="age"
              className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              placeholder="e.g. 35"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Gender
            </label>
            <select
              name="gender"
              id="gender"
              className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              placeholder="e.g. +91 9876543210"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              placeholder="e.g. john@example.com"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Address
            </label>
            <textarea
              name="address"
              id="address"
              rows={3}
              className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Full residential address..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
          <Link href="/patients" className="rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-[0.98]">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isPending}
            className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-50"
          >
            {isPending ? 'Saving...' : 'Save Patient'}
          </button>
        </div>
      </form>

      <Modal 
        isOpen={showDuplicateModal} 
        onClose={() => setShowDuplicateModal(false)} 
        title="Potential Duplicate Found"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-semibold">Patients with similar details already exist.</p>
              <p className="text-xs mt-1 opacity-90">Please review the list below to avoid duplicate entries.</p>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {duplicates.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                  <p className="text-xs text-slate-500">
                    {p.age} yrs • {p.phone || 'No phone'}
                  </p>
                </div>
                <Link 
                  href={`/patients/${p.id}`} 
                  className="text-xs font-semibold text-indigo-600 hover:underline"
                  target="_blank"
                >
                  View Profile
                </Link>
              </div>
            ))}
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={handleProceedAnyway}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
            >
              <UserPlus className="h-4 w-4" />
              Create New Anyway
            </button>
            <button
              onClick={() => setShowDuplicateModal(false)}
              className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-600 border border-slate-200 transition-all hover:bg-slate-50 active:scale-[0.98]"
            >
              Cancel and Edit
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
