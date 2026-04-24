export default function SubscriptionExpiredPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#FAFAFA] p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[30%] left-[25%] w-[400px] h-[400px] bg-red-200/30 rounded-full blur-[100px] opacity-70 animate-pulse"></div>
        <div className="absolute bottom-[30%] right-[25%] w-[300px] h-[300px] bg-orange-200/30 rounded-full blur-[100px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-md glass-panel rounded-[2rem] p-10 text-center animate-fade-in-up">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-red-50 ring-1 ring-red-500/10 shadow-sm">
          <svg className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-3">Subscription Expired</h1>
        <p className="text-slate-500 mb-10 leading-relaxed">
          Your access to Clinic OS has expired. Please contact your system administrator to renew your subscription.
        </p>
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="w-full rounded-xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/20 transition-all duration-300 hover:bg-slate-800 hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.98]"
          >
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
