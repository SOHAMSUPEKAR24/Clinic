'use client'

import { useState, use } from 'react'
import { createVisit } from './actions'
import { MedicineSearch } from '@/components/medicines/MedicineSearch'
import { ArrowLeft, Trash2 } from 'lucide-react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function NewVisitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [medicines, setMedicines] = useState<any[]>([])

  const handleAddMedicine = (med: any) => {
    setMedicines([...medicines, { ...med, dosage: '', frequency: '', duration: '', instructions: '' }])
  }

  const handleRemoveMedicine = (index: number) => {
    setMedicines(medicines.filter((_, i) => i !== index))
  }

  const updateMedicine = (index: number, field: string, value: string) => {
    const newMeds = [...medicines]
    newMeds[index][field] = value
    setMedicines(newMeds)
  }

  const handleSubmit = async (formData: FormData) => {
    try {
      await createVisit(id, formData, JSON.stringify(medicines))
      toast.success('Visit saved successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save visit')
    }
  }

  const inputClass = "block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5"
  const smallInputClass = "mt-1 block w-full rounded-lg border border-slate-200/80 bg-slate-50/50 px-3 py-2 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link href={`/patients/${id}`} className="rounded-full p-2.5 transition-all hover:bg-slate-200/50 hover:shadow-sm active:scale-95">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">New Visit</h2>
          <p className="mt-1 text-sm text-slate-500">Record visit details and create prescription.</p>
        </div>
      </div>

      <form action={handleSubmit} className="space-y-8">
        
        {/* Visit Details */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">Clinical Notes</h3>
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Date of Visit *</label>
              <input type="date" name="visit_date" required defaultValue={new Date().toISOString().split('T')[0]} className={inputClass} />
            </div>
            
            <div>
              <label className={labelClass}>Next Visit Date (Follow-up)</label>
              <input type="date" name="next_visit_date" className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Chief Complaint *</label>
              <textarea name="chief_complaint" required rows={2} className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Symptoms</label>
              <textarea name="symptoms" rows={2} className={inputClass} />
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Diagnosis</label>
              <input type="text" name="diagnosis" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Vitals */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">Vitals</h3>
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <label className={labelClass}>Blood Pressure (mmHg)</label>
              <input type="text" name="bp" placeholder="120/80" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Temperature (°F)</label>
              <input type="text" name="temperature" placeholder="98.6" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Heart Rate (bpm)</label>
              <input type="text" name="heart_rate" placeholder="72" className={inputClass} />
            </div>
          </div>
        </div>

        {/* Prescription Builder */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8">
          <h3 className="mb-6 text-lg font-semibold text-slate-900">Prescription</h3>
          
          <div className="mb-6">
            <label className={labelClass}>Search & Add Medicine</label>
            <MedicineSearch onAdd={handleAddMedicine} />
          </div>

          {medicines.length > 0 ? (
            <div className="space-y-4">
              {medicines.map((med, index) => (
                <div key={index} className="flex flex-col gap-3 rounded-xl border border-slate-200/60 bg-white/40 p-5 sm:flex-row sm:items-start transition-all hover:shadow-sm">
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {med.medicine_name}
                      {med.isNewCustom && <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-500/20">New Custom</span>}
                    </p>
                    
                    <div className="mt-3 grid gap-3 sm:grid-cols-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Dosage</label>
                        <input type="text" value={med.dosage} onChange={(e) => updateMedicine(index, 'dosage', e.target.value)} placeholder="e.g. 500mg" className={smallInputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Frequency</label>
                        <input type="text" value={med.frequency} onChange={(e) => updateMedicine(index, 'frequency', e.target.value)} placeholder="e.g. 1-0-1" className={smallInputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</label>
                        <input type="text" value={med.duration} onChange={(e) => updateMedicine(index, 'duration', e.target.value)} placeholder="e.g. 5 days" className={smallInputClass} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Instructions</label>
                        <input type="text" value={med.instructions} onChange={(e) => updateMedicine(index, 'instructions', e.target.value)} placeholder="e.g. After meals" className={smallInputClass} />
                      </div>
                    </div>
                  </div>
                  <button type="button" onClick={() => handleRemoveMedicine(index)} className="mt-1 rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/30 p-8 text-center">
              <p className="text-sm text-slate-500">No medicines added to prescription.</p>
            </div>
          )}
          
          <div className="mt-6">
            <label className={labelClass}>Additional Instructions / Notes</label>
            <textarea name="notes" rows={2} className={inputClass} />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link href={`/patients/${id}`} className="rounded-xl px-6 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-[0.98]">
            Cancel
          </Link>
          <button type="submit" className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]">
            Save Visit & Generate Prescription
          </button>
        </div>
      </form>
    </div>
  )
}
