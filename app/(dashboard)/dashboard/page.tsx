import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, Activity } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

// Revalidate stats every 60s — allows Next.js to serve cached HTML on repeat visits
export const revalidate = 60

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch stats
  const [patientsResult, visitsResult, monthVisitsResult, upcomingVisitsResult] = await Promise.all([
    supabase.from('patients').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase.from('visits').select('id', { count: 'exact', head: true }).eq('user_id', user.id),
    supabase
      .from('visits')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('visit_date', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()),
    supabase
      .from('visits')
      .select('*, patients(name, phone)')
      .eq('user_id', user.id)
      .gte('next_visit_date', new Date().toISOString().split('T')[0])
      .order('next_visit_date', { ascending: true })
      .limit(5)
  ])

  const stats = [
    { name: 'Total Patients', value: patientsResult.count || 0, icon: Users },
    { name: 'Total Visits', value: visitsResult.count || 0, icon: Activity },
    { name: 'This Month', value: monthVisitsResult.count || 0, icon: Calendar },
  ]

  const upcomingVisits = upcomingVisitsResult.data || []

  return (
    <div className="space-y-8 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-500">Overview of your clinic's activity.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/patients/new"
            className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-[0.98]"
          >
            <Users className="mr-2 h-4 w-4" />
            New Patient
          </Link>
          <Link
            href="/quick-notes"
            className="flex-1 sm:flex-none inline-flex items-center justify-center rounded-xl border border-slate-200/80 bg-white/60 px-5 py-2.5 text-sm font-semibold text-slate-700 backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md active:scale-[0.98]"
          >
            Quick Note
          </Link>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map((stat, i) => (
          <div key={stat.name} className={`glass-panel card-hover rounded-2xl p-6 ${i === 0 ? 'animate-fade-in-up' : ''}`} style={{ animationDelay: `${i * 100}ms` }}>
            <div className="flex items-center justify-between pb-4">
              <h3 className="text-sm font-semibold text-slate-500">{stat.name}</h3>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <stat.icon className="h-5 w-5" />
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold tracking-tight text-slate-900 bg-clip-text text-transparent bg-gradient-to-br from-slate-900 to-slate-600">
                {stat.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Find Patient</h3>
          <div className="glass-panel card-hover rounded-2xl p-6">
            <form action="/patients" method="GET" className="flex gap-3">
              <input
                type="text"
                name="q"
                placeholder="Search by name or phone..."
                className="flex-1 rounded-xl border border-slate-200/80 bg-white/50 px-4 py-3 text-sm transition-all focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
              <button
                type="submit"
                className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-slate-800 active:scale-[0.98]"
              >
                Search
              </button>
            </form>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">Upcoming Visits</h3>
          <div className="glass-panel rounded-2xl overflow-hidden">
            {upcomingVisits.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4">
                  <Calendar className="h-8 w-8" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900">No upcoming visits</h3>
                <p className="mt-1 text-sm text-slate-500">You don't have any follow-ups scheduled.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {upcomingVisits.map((visit) => (
                  <li key={visit.id} className="group flex items-center justify-between p-5 transition-colors hover:bg-slate-50/50">
                    <div>
                      <p className="font-semibold text-slate-900">{(visit.patients as any).name}</p>
                      <p className="text-sm text-slate-500">{(visit.patients as any).phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-indigo-600 mb-1">
                        {visit.next_visit_date && format(new Date(visit.next_visit_date), 'MMM d, yyyy')}
                      </p>
                      <Link
                        href={`/patients/${visit.patient_id}`}
                        className="inline-flex rounded-md bg-white px-2.5 py-1 text-xs font-semibold text-slate-600 shadow-sm ring-1 ring-inset ring-slate-300 transition-all hover:bg-slate-50"
                      >
                        Profile
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
