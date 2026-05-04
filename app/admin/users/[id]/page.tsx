import { createAdminClient } from '@/lib/supabase/server'
import { updateClinicSettings } from '../../actions'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'

export default async function EditUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const adminClient = createAdminClient()

  const { data: profile } = await adminClient
    .from('profiles')
    .select('*, clinic_settings(*)')
    .eq('id', id)
    .single()

  if (!profile) return <div className="p-10 text-center text-slate-500">User not found</div>

  const settings = profile.clinic_settings?.[0] || {}

  const inputClass = "block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
  const labelClass = "block text-sm font-semibold text-slate-700 mb-1.5"

  return (
    <div className="space-y-8 pb-20 max-w-4xl mx-auto animate-fade-in-up">
      <div className="flex items-center gap-4">
        <Link href="/admin" className="rounded-full p-2.5 transition-all hover:bg-slate-200/50 hover:shadow-sm active:scale-95">
          <ArrowLeft className="h-5 w-5 text-slate-600" />
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">Edit Clinic Settings</h2>
          <p className="mt-1 text-sm text-slate-500">Managing settings for user: <span className="font-semibold text-slate-900">{profile.username}</span></p>
        </div>
      </div>

      <form action={updateClinicSettings.bind(null, id)} className="space-y-8">
        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4">Clinic Details</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <label className={labelClass}>Clinic Name</label>
              <input type="text" name="clinic_name" defaultValue={settings.clinic_name} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Doctor Name</label>
              <input type="text" name="doctor_name" defaultValue={settings.doctor_name} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Registration Number</label>
              <input type="text" name="reg_number" defaultValue={settings.reg_number} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input type="text" name="phone" defaultValue={settings.phone} className={inputClass} />
            </div>
            <div className="md:col-span-2">
              <label className={labelClass}>Email</label>
              <input type="email" name="email" defaultValue={settings.email} className={inputClass} />
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
          <h3 className="text-lg font-semibold text-slate-900 border-b border-slate-100 pb-4">Address Details</h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className={labelClass}>Street Address</label>
              <input type="text" name="address" defaultValue={settings.address} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>City</label>
              <input type="text" name="city" defaultValue={settings.city} className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>State</label>
                <input type="text" name="state" defaultValue={settings.state} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>PIN Code</label>
                <input type="text" name="pin" defaultValue={settings.pin} className={inputClass} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
          <Link href="/admin" className="w-full sm:w-auto inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-[0.98]">
            Cancel
          </Link>
          <button type="submit" className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]">
            <Save className="h-4 w-4" /> Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
