'use client'

import { login } from './actions'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <form action={login} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-sm font-medium text-red-600 ring-1 ring-inset ring-red-500/20">
          {error}
        </div>
      )}
          
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Enter your username"
            />
            {/* Hidden field to pass email to Supabase Auth */}
            <input 
              type="hidden" 
              name="email" 
              id="email-hidden" 
              value="" 
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
            onClick={(e) => {
              const usernameInput = document.getElementById('username') as HTMLInputElement
              const emailInput = document.getElementById('email-hidden') as HTMLInputElement
              if (usernameInput.value) {
                // Map username to internal email for Supabase Auth
                emailInput.value = `${usernameInput.value}@clinic.internal`
              }
            }}
          >
            Sign in to Workspace
          </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA]">
      {/* Decorative background elements */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[100px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[20%] right-[20%] w-[400px] h-[400px] bg-blue-200/40 rounded-full blur-[100px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="glass-panel rounded-[2rem] p-10 mx-4 sm:mx-0">
          <div className="mb-10 text-center animate-fade-in-up">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 shadow-xl shadow-indigo-600/30">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-slate-500">Sign in to your clinic workspace.</p>
          </div>
          <Suspense fallback={<div className="text-sm text-slate-500 text-center py-8">Loading...</div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
