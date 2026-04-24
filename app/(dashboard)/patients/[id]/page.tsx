import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { ArrowLeft, Calendar, FileText, Plus, User } from 'lucide-react'
import { format } from 'date-fns'

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  
  const { data: patient } = await supabase
    .from('patients')
    .select('*')
    .eq('id', id)
    .single()

  if (!patient) {
    return <div>Patient not found</div>
  }

  const { data: visits } = await supabase
    .from('visits')
    .select('*')
    .eq('patient_id', id)
    .order('visit_date', { ascending: false })

  const upcomingVisits = visits?.filter(v => v.next_visit_date && new Date(v.next_visit_date) >= new Date(new Date().setHours(0,0,0,0))) || []
  const pastVisits = visits?.filter(v => !upcomingVisits.includes(v)) || []

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link href="/patients" className="rounded-full p-2.5 transition-all hover:bg-slate-200/50 hover:shadow-sm active:scale-95">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">{patient.name}</h2>
          <p className="mt-1 text-sm text-slate-500">Patient Profile</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Patient Details */}
        <div className="glass-panel rounded-2xl p-6 md:col-span-1 h-fit space-y-5">
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-xl">
              {patient.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{patient.name}</p>
              <p className="text-sm text-slate-500">{patient.age} yrs • {patient.gender}</p>
            </div>
          </div>
          
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</p>
              <p className="mt-1 font-medium text-slate-900">{patient.phone || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</p>
              <p className="mt-1 font-medium text-slate-900">{patient.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Address</p>
              <p className="mt-1 font-medium text-slate-900">{patient.address || 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 md:col-span-2">
          {/* Upcoming Visit Card */}
          {upcomingVisits.length > 0 && (
            <div className="rounded-2xl bg-indigo-50/50 p-6 ring-1 ring-inset ring-indigo-500/10">
              <div className="flex items-center gap-3 text-indigo-800 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Calendar className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">Next Upcoming Visit</h3>
              </div>
              <p className="text-lg font-bold text-indigo-900 ml-[52px]">
                {format(new Date(upcomingVisits[0].next_visit_date), 'MMMM do, yyyy')}
              </p>
            </div>
          )}

          {/* Visit History */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200/60 p-5 bg-white/40">
              <h3 className="font-semibold text-slate-900">Visit History</h3>
              <Link
                href={`/patients/${id}/visits/new`}
                className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-lg active:scale-[0.98]"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Visit
              </Link>
            </div>
            
            {pastVisits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4 shadow-sm ring-1 ring-slate-100">
                  <FileText className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No past visits</h3>
                <p className="mt-1 text-sm text-slate-500">Record your first visit for this patient.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {pastVisits.map((visit) => (
                  <li key={visit.id} className="group p-5 transition-all duration-300 hover:bg-slate-50/50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {format(new Date(visit.visit_date), 'MMM d, yyyy')}
                        </p>
                        <p className="text-sm text-slate-500 mt-1">
                          <span className="font-semibold text-slate-600">Diagnosis:</span> {visit.diagnosis || 'None'}
                        </p>
                      </div>
                      <Link
                        href={`/patients/${id}/visits/${visit.id}`}
                        className="inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm ring-1 ring-inset ring-slate-200 transition-all hover:bg-slate-50 hover:shadow-md"
                      >
                        Details
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
