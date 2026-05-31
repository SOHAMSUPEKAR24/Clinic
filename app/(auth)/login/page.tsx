'use client'

import { login } from './actions'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { useFormStatus } from 'react-dom'
import { Loader2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  
  return (
    <>
      <button
        type="submit"
        disabled={pending}
        className="group relative w-full overflow-hidden rounded-xl bg-black px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-black/20 transition-all duration-300 hover:bg-neutral-800 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98] disabled:opacity-90 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-none border border-white/10"
        onClick={(e) => {
          const usernameInput = document.getElementById('username') as HTMLInputElement
          const emailInput = document.getElementById('email-hidden') as HTMLInputElement
          if (usernameInput && usernameInput.value && emailInput) {
            // Map username to internal email for Supabase Auth
            emailInput.value = `${usernameInput.value}@clinic.internal`
          }
        }}
      >
        <span className={`flex items-center justify-center gap-2 transition-all duration-300 ${pending ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
          Sign in to Workspace
          <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </span>
        <span className={`absolute inset-0 flex items-center justify-center gap-2 transition-all duration-300 ${pending ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
          <Loader2 className="h-5 w-5 animate-spin text-white/90" />
          Authenticating...
        </span>
      </button>

      {/* Full panel loading overlay */}
      {pending && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl animate-in fade-in duration-300 rounded-[2.5rem]">
           <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-black/50 mb-6 shadow-inner animate-pulse border border-white/10">
             <div className="absolute inset-0 rounded-2xl border-4 border-white/10 border-t-white animate-spin"></div>
             <Loader2 className="h-8 w-8 text-white animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }} />
           </div>
           <h3 className="text-xl font-bold text-white animate-pulse">Securing Connection</h3>
           <p className="mt-2 text-sm text-neutral-300 font-medium">Please wait while we log you in...</p>
        </div>
      )}
    </>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  return (
    <form action={login} className="space-y-6 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
      {error && (
        <div className="rounded-xl bg-red-500/10 border border-red-500/20 p-4 text-sm font-medium text-red-400 flex items-center gap-2 backdrop-blur-sm">
          <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
          
          <div>
            <label className="block text-sm font-semibold text-neutral-200 mb-1.5" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              className="block w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white transition-all placeholder-neutral-500 focus:border-white/30 focus:bg-black/60 focus:outline-none focus:ring-4 focus:ring-white/10 hover:border-white/20 backdrop-blur-md"
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
            <label className="block text-sm font-semibold text-neutral-200 mb-1.5" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="block w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white transition-all placeholder-neutral-500 focus:border-white/30 focus:bg-black/60 focus:outline-none focus:ring-4 focus:ring-white/10 hover:border-white/20 backdrop-blur-md"
              placeholder="••••••••"
            />
          </div>

          <SubmitButton />
    </form>
  )
}

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black bg-[url('/clinic_os_bg.png')] bg-cover bg-center">
      {/* Dark gradient overlay for better contrast */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-black/80 via-black/40 to-black/80 pointer-events-none"></div>

      <div className="relative z-10 w-full max-w-md perspective-1000">
        {/* Extreme Glassmorphism Panel */}
        <div className="relative rounded-[2.5rem] p-10 mx-4 sm:mx-0 overflow-hidden shadow-2xl shadow-black/50 bg-white/5 backdrop-blur-2xl border border-white/10 ring-1 ring-white/5">
          <div className="mb-10 text-center animate-fade-in-up">
            {/* Black Logo */}
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-black shadow-xl shadow-black/50 border border-white/10 transform transition-transform hover:scale-105 duration-300">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-sm">Welcome Back</h1>
            <p className="mt-2 text-sm text-neutral-400">Sign in to your clinic workspace.</p>
          </div>
          <Suspense fallback={<div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-white" /></div>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
