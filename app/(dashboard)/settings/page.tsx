import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building, Phone, Mail, MapPin, Stethoscope } from 'lucide-react'
import { PatientExport } from '@/components/settings/PatientExport'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  // Settings are global essentially for this tenant. Admin sets them.
  // Due to RLS, users can view their own settings or we might have made them viewable.
  // Wait, if it's a SaaS, each user is a separate clinic? 
  // Ah! The prompt says: "Each user has isolated data". 
  // "Settings page exists in UI BUT: USERS cannot edit it. Only admin controls settings."
  // If admin controls it, the settings are either per user (managed by admin) or global.
  // Wait, if it's a SaaS, the admin creates users. Each user is a clinic.
  // So the admin sets the clinic name for the user?
  // Let's assume the admin can edit settings for ANY user, or there's only one master clinic? 
  // "A FULL SaaS clinic system where: Admin creates users... Each user has isolated data... Settings page exists in UI BUT USERS cannot edit it... Only admin controls settings"
  // Let's fetch the current user's clinic settings.
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  // Try to get settings for this user. If admin, they manage settings in the admin panel.
  const { data: settings } = await supabase
    .from('clinic_settings')
    .select('*')
    // If it's a single clinic system with multiple users, maybe admin sets global settings.
    // If SaaS, each user has their own settings, but only admin can edit them.
    // We'll fetch settings where user_id = user.id.
    .eq('user_id', user.id)
    .single()

  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Clinic Settings</h2>
        <p className="mt-2 text-sm text-slate-500">
          View your clinic information. These settings are managed by the system administrator.
          {profile?.role === 'admin' && ' (As an admin, you can edit these in the Admin Panel).'}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="glass-panel card-hover rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Building className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Clinic Details</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clinic Name</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{settings?.clinic_name || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doctor Name</p>
              <p className="mt-1 text-base font-semibold text-slate-900">{settings?.doctor_name || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Registration Number</p>
              <p className="mt-1 text-base font-medium text-slate-900">{settings?.reg_number || 'Not configured'}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel card-hover rounded-2xl p-6 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <Phone className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Contact Info</h3>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone</p>
              <p className="mt-1 text-base font-medium text-slate-900">{settings?.phone || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email</p>
              <p className="mt-1 text-base font-medium text-slate-900">{settings?.email || 'Not configured'}</p>
            </div>
          </div>
        </div>

        <div className="glass-panel card-hover rounded-2xl p-6 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-slate-900">Address Details</h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Street Address</p>
              <p className="mt-1 text-base font-medium text-slate-900">{settings?.address || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City</p>
              <p className="mt-1 text-base font-medium text-slate-900">{settings?.city || 'Not configured'}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">State & PIN</p>
              <p className="mt-1 text-base font-medium text-slate-900">
                {settings?.state ? `${settings.state} ` : ''}
                {settings?.pin || 'Not configured'}
              </p>
            </div>
          </div>
        </div>

        <PatientExport />
      </div>
      
      {profile?.role === 'user' && (
        <div className="rounded-2xl bg-indigo-50/50 p-5 ring-1 ring-inset ring-indigo-500/10">
          <p className="text-sm text-indigo-800">
            <strong>Need to make changes?</strong> Please contact your administrator to update your clinic details or import medicines.
          </p>
        </div>
      )}
    </div>
  )
}
