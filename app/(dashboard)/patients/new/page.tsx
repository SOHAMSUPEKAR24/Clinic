import { PatientForm } from '@/components/patients/PatientForm'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NewPatientPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link href="/patients" className="rounded-full p-2.5 transition-all hover:bg-slate-200/50 hover:shadow-sm active:scale-95">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">New Patient</h2>
          <p className="mt-1.5 text-sm text-slate-500">Register a new patient to your clinic.</p>
        </div>
      </div>

      <div className="glass-panel rounded-2xl p-8 sm:p-10">
        <PatientForm />
      </div>
    </div>
  )
}
