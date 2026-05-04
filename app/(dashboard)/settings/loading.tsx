export default function SettingsLoading() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 animate-pulse">
      <div>
        <div className="h-9 w-48 rounded-xl bg-slate-200" />
        <div className="mt-2 h-4 w-96 rounded-lg bg-slate-100" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        {[0, 1].map(i => (
          <div key={i} className="rounded-2xl border border-white/20 bg-white/70 p-6 space-y-6">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-10 w-10 rounded-xl bg-slate-200" />
              <div className="h-5 w-28 rounded-lg bg-slate-200" />
            </div>
            <div className="space-y-4">
              {[0, 1, 2].map(j => (
                <div key={j}>
                  <div className="h-3 w-24 rounded bg-slate-100" />
                  <div className="mt-1 h-5 w-40 rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="rounded-2xl border border-white/20 bg-white/70 p-6 md:col-span-2 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="h-10 w-10 rounded-xl bg-slate-200" />
            <div className="h-5 w-32 rounded-lg bg-slate-200" />
          </div>
          <div className="h-16 rounded-xl bg-slate-100 w-full" />
        </div>
      </div>
    </div>
  )
}
