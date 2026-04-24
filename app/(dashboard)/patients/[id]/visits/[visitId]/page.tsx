import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Printer, Download } from 'lucide-react'
import { format } from 'date-fns'
import { PrescriptionView } from '@/components/prescriptions/PrescriptionView'

export default async function VisitDetailsPage({
  params,
}: {
  params: Promise<{ id: string; visitId: string }>
}) {
  const { id, visitId } = await params
  const supabase = await createClient()

  // Fetch visit, patient, prescription, clinic settings in parallel
  const [visitRes, patientRes, prescRes, settingsRes] = await Promise.all([
    supabase.from('visits').select('*').eq('id', visitId).single(),
    supabase.from('patients').select('*').eq('id', id).single(),
    supabase.from('prescriptions').select('*').eq('visit_id', visitId).single(),
    supabase.from('clinic_settings').select('*').single() // Uses RLS
  ])

  if (!visitRes.data || !patientRes.data) {
    return <div>Visit not found</div>
  }

  const visit = visitRes.data
  const patient = patientRes.data
  const prescription = prescRes.data
  const settings = settingsRes.data

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20 animate-fade-in-up">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <Link href={`/patients/${id}`} className="rounded-full p-2.5 transition-all hover:bg-slate-200/50 hover:shadow-sm active:scale-95">
            <ArrowLeft className="h-5 w-5 text-slate-600" />
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900">Visit Details</h2>
            <p className="mt-1 text-sm text-slate-500">
              {patient.name} • {format(new Date(visit.visit_date), 'MMM do, yyyy')}
            </p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <PrescriptionView 
            visit={visit} 
            patient={patient} 
            prescription={prescription} 
            settings={settings} 
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 print:hidden">
        <div className="md:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-5">Clinical Notes</h3>
            <div className="space-y-5 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Chief Complaint</p>
                <p className="mt-1.5 text-slate-900">{visit.chief_complaint || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Symptoms</p>
                <p className="mt-1.5 text-slate-900">{visit.symptoms || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Diagnosis</p>
                <p className="mt-1.5 text-slate-900">{visit.diagnosis || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Notes / Instructions</p>
                <p className="mt-1.5 text-slate-900">{visit.notes || 'N/A'}</p>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-5">Prescription</h3>
            {!prescription || !prescription.medicines || prescription.medicines.length === 0 ? (
              <p className="text-sm text-slate-500">No medicines prescribed during this visit.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-slate-200/60">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200/60 bg-slate-50/50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Medicine</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Dosage</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Freq</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Duration</th>
                      <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider">Instructions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {prescription.medicines.map((med: any, i: number) => (
                      <tr key={i} className="transition-colors hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-semibold text-slate-900">{med.medicine_name}</td>
                        <td className="px-4 py-3 text-slate-600">{med.dosage || '-'}</td>
                        <td className="px-4 py-3 text-slate-600">{med.frequency || '-'}</td>
                        <td className="px-4 py-3 text-slate-600">{med.duration || '-'}</td>
                        <td className="px-4 py-3 text-slate-600">{med.instructions || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-panel card-hover rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-5">Vitals</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between items-center">
                <span className="text-slate-500">Blood Pressure</span>
                <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{visit.bp || '--'} mmHg</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-500">Temperature</span>
                <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{visit.temperature || '--'} °F</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="text-slate-500">Heart Rate</span>
                <span className="font-semibold text-slate-900 bg-slate-50 px-3 py-1 rounded-lg">{visit.heart_rate || '--'} bpm</span>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl bg-indigo-50/50 p-6 ring-1 ring-inset ring-indigo-500/10">
            <h3 className="text-sm font-semibold text-indigo-900 mb-2">Follow-up</h3>
            <p className="text-indigo-800 font-semibold">
              {visit.next_visit_date 
                ? format(new Date(visit.next_visit_date), 'MMMM do, yyyy')
                : 'No follow-up scheduled'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
