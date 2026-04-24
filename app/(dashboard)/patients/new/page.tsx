import { createPatient } from './actions'
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
        <form action={createPatient} className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label htmlFor="age" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Gender
              </label>
              <select
                name="gender"
                id="gender"
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                id="phone"
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="address" className="block text-sm font-semibold text-slate-700 mb-1.5">
                Address
              </label>
              <textarea
                name="address"
                id="address"
                rows={3}
                className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
            <Link href="/patients" className="rounded-xl px-6 py-3.5 text-sm font-semibold text-slate-600 transition-all hover:bg-slate-100 active:scale-[0.98]">
              Cancel
            </Link>
            <button
              type="submit"
              className="rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/20 transition-all duration-300 hover:bg-indigo-500 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
            >
              Save Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
