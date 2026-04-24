import { createAdminClient, createClient } from '@/lib/supabase/server'
import { CSVImport } from '@/components/csv/CSVImport'
import Link from 'next/link'
import { createUser, extendSubscription } from './actions'
import { format, parseISO } from 'date-fns'

export default async function AdminPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const adminClient = createAdminClient()
  
  // Fetch all users (profiles)
  const { data: profiles } = await adminClient
    .from('profiles')
    .select('*, clinic_settings(clinic_name)')
    .order('created_at', { ascending: false })

  const inputClass = "block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5"

  return (
    <div className="space-y-8 pb-20 max-w-6xl mx-auto animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Admin Panel</h2>
        <p className="mt-2 text-sm text-slate-500">Manage clinic users, subscriptions, and medicine data.</p>
      </div>
      
      {/* Create User Form */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <h3 className="text-lg font-semibold text-slate-900 mb-6">Create New Clinic User</h3>
        <form action={createUser} className="grid gap-6 sm:grid-cols-4 items-end">
          <div>
            <label className={labelClass}>Username</label>
            <input type="text" name="username" required className={inputClass} placeholder="clinic123" />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="password" name="password" required className={inputClass} placeholder="••••••••" />
          </div>
          <div>
            <label className={labelClass}>Subscription Duration</label>
            <select name="duration" className={inputClass}>
              <option value="30">30 Days</option>
              <option value="180">6 Months</option>
              <option value="365">1 Year</option>
            </select>
          </div>
          <div>
            <button type="submit" className="w-full rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]">
              Create User
            </button>
          </div>
        </form>
      </div>

      {/* User Management Table */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/60 bg-white/40">
          <h3 className="text-lg font-semibold text-slate-900">Manage Users</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50/50 text-slate-600">
              <tr>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Username</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Clinic Name</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Role</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider">Status / Expiry</th>
                <th className="px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {profiles?.map((p: any) => {
                const expiry = p.subscription_end ? parseISO(p.subscription_end) : null
                const isExpired = expiry ? expiry < new Date() : false
                
                return (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-semibold text-slate-900">{p.username}</td>
                    <td className="px-6 py-4 text-slate-600">{p.clinic_settings?.[0]?.clinic_name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${p.role === 'admin' ? 'bg-purple-50 text-purple-700 ring-purple-500/20' : 'bg-indigo-50 text-indigo-700 ring-indigo-500/20'}`}>
                        {p.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {p.role === 'admin' ? (
                        <span className="text-slate-400 font-medium">Lifetime</span>
                      ) : isExpired ? (
                        <span className="text-red-600 font-semibold">Expired ({expiry ? format(expiry, 'MMM d, yyyy') : 'N/A'})</span>
                      ) : (
                        <span className="text-emerald-600 font-semibold">Active (until {expiry ? format(expiry, 'MMM d, yyyy') : 'N/A'})</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {p.role !== 'admin' && (
                        <div className="flex justify-end gap-3">
                          <Link
                            href={`/admin/users/${p.id}`}
                            className="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-200 active:scale-[0.98]"
                          >
                            Edit Settings
                          </Link>
                          <form action={extendSubscription.bind(null, p.id, 30)}>
                            <button type="submit" className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-500/20 transition-all hover:bg-indigo-100 active:scale-[0.98]">
                              +30 Days
                            </button>
                          </form>
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CSV Import */}
      <CSVImport />

    </div>
  )
}
