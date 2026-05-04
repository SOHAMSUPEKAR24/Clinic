import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Search, ChevronRight } from 'lucide-react'

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q: query = '' } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null


  let patientsQuery = supabase
    .from('patients')
    .select('id, name, age, gender, phone, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (query) {
    patientsQuery = patientsQuery.or(`name.ilike.%${query}%,phone.ilike.%${query}%`)
  }

  const { data: patients } = await patientsQuery

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Patients</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your patient records.</p>
        </div>
        <Link
          href="/patients/new"
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Patient
        </Link>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="border-b border-slate-200/60 p-5 bg-white/40">
          <form className="relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-slate-400" />
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search patients by name or phone..."
              className="w-full rounded-xl border border-slate-200/80 bg-white/60 py-3 pl-12 pr-4 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
            />
          </form>
        </div>

        {patients?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300 mb-6 shadow-sm ring-1 ring-slate-100">
              <Search className="h-8 w-8" />
            </div>
            <h3 className="text-base font-semibold text-slate-900">No patients found</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-sm">
              {query ? 'We couldn\'t find any patients matching your search.' : 'Your clinic has no patients yet. Start by adding your first patient.'}
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {patients?.map((patient) => (
              <li key={patient.id}>
                <Link
                  href={`/patients/${patient.id}`}
                  className="group flex items-center justify-between p-5 transition-all duration-300 hover:bg-slate-50/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">
                      {patient.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{patient.name}</p>
                      <p className="text-sm text-slate-500">
                        {patient.age} yrs • {patient.gender} {patient.phone ? `• ${patient.phone}` : ''}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300 transition-colors group-hover:text-indigo-500 group-hover:translate-x-1 duration-300" />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
