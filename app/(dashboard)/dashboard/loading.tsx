export default function DashboardLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-9 w-48 rounded-xl bg-slate-200" />
        <div className="mt-2 h-4 w-64 rounded-lg bg-slate-100" />
      </div>
      <div className="flex gap-4">
        <div className="h-10 w-32 rounded-xl bg-slate-200" />
        <div className="h-10 w-28 rounded-xl bg-slate-100" />
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {[0, 1, 2].map(i => (
          <div key={i} className="rounded-2xl border border-white/20 bg-white/70 p-6">
            <div className="flex items-center justify-between pb-4">
              <div className="h-4 w-28 rounded-lg bg-slate-200" />
              <div className="h-10 w-10 rounded-xl bg-slate-100" />
            </div>
            <div className="h-9 w-16 rounded-xl bg-slate-200" />
          </div>
        ))}
      </div>
    </div>
  )
}
