import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar, CheckCircle, ChevronRight } from 'lucide-react'
import { format, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns'
import { markVisitCompleted } from './actions'

export default async function UpcomingVisitsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  // Fetch visits with future next_visit_date
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const { data: visits } = await supabase
    .from('visits')
    .select('*, patients(id, name, phone)')
    .eq('user_id', user.id)
    .gte('next_visit_date', today.toISOString().split('T')[0])
    .order('next_visit_date', { ascending: true })

  const upcomingVisits = visits || []

  const todayVisits = upcomingVisits.filter(v => isToday(parseISO(v.next_visit_date)))
  const tomorrowVisits = upcomingVisits.filter(v => isTomorrow(parseISO(v.next_visit_date)))
  const thisWeekVisits = upcomingVisits.filter(v => 
    !isToday(parseISO(v.next_visit_date)) && 
    !isTomorrow(parseISO(v.next_visit_date)) && 
    isThisWeek(parseISO(v.next_visit_date))
  )
  const laterVisits = upcomingVisits.filter(v => 
    !isToday(parseISO(v.next_visit_date)) && 
    !isTomorrow(parseISO(v.next_visit_date)) && 
    !isThisWeek(parseISO(v.next_visit_date))
  )

  const VisitSection = ({ title, visits, emptyMsg }: { title: string, visits: any[], emptyMsg: string }) => {
    if (visits.length === 0) return null
    return (
      <div className="mb-8 animate-fade-in-up">
        <h3 className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
        <div className="glass-panel rounded-2xl overflow-hidden">
          <ul className="divide-y divide-slate-100">
            {visits.map(visit => (
              <li key={visit.id} className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 transition-all duration-300 hover:bg-slate-50/50">
                <div className="flex-1 mb-4 sm:mb-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold">
                      {(visit.patients as any).name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-900">{(visit.patients as any).name}</p>
                        <span className="text-xs font-semibold bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full ring-1 ring-indigo-500/20">
                          {format(parseISO(visit.next_visit_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Phone: {(visit.patients as any).phone || 'N/A'}
                      </p>
                    </div>
                  </div>
                  {visit.diagnosis && (
                    <div className="mt-3 ml-13">
                      <p className="text-xs text-slate-500 bg-slate-100/50 px-3 py-2 rounded-lg inline-block border border-slate-200/50">
                        <span className="font-semibold text-slate-600">Diagnosis:</span> {visit.diagnosis}
                      </p>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-3 ml-13 sm:ml-0">
                  <form action={markVisitCompleted.bind(null, visit.id)}>
                    <button type="submit" className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white/60 px-4 py-2.5 text-sm font-semibold text-slate-600 shadow-sm transition-all hover:bg-white hover:text-green-600 hover:border-green-200 hover:shadow-md active:scale-[0.98]">
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Mark Done</span>
                    </button>
                  </form>
                  <Link href={`/patients/${visit.patient_id}`} className="flex items-center gap-1.5 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 shadow-sm transition-all hover:bg-indigo-100 hover:shadow-md active:scale-[0.98]">
                    Profile <ChevronRight className="h-4 w-4" />
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fade-in-up max-w-5xl">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Upcoming Visits</h2>
        <p className="mt-2 text-sm text-slate-500">Manage scheduled patient follow-ups.</p>
      </div>

      {upcomingVisits.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-2xl">
          <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-50 text-slate-300 mb-6 shadow-sm ring-1 ring-slate-100">
            <Calendar className="h-10 w-10" />
          </div>
          <h3 className="text-base font-semibold text-slate-900">No upcoming visits</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-sm">You do not have any scheduled follow-ups at this time.</p>
        </div>
      ) : (
        <div>
          <VisitSection title="Today" visits={todayVisits} emptyMsg="" />
          <VisitSection title="Tomorrow" visits={tomorrowVisits} emptyMsg="" />
          <VisitSection title="This Week" visits={thisWeekVisits} emptyMsg="" />
          <VisitSection title="Later" visits={laterVisits} emptyMsg="" />
        </div>
      )}
    </div>
  )
}
