export default function QuickNotesLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-40 rounded-xl bg-slate-200" />
          <div className="mt-2 h-4 w-56 rounded-lg bg-slate-100" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-slate-200" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div key={i} className="rounded-2xl border border-white/20 bg-white/70 p-5 space-y-3">
            <div className="h-5 w-3/4 rounded-lg bg-slate-200" />
            <div className="space-y-1.5">
              <div className="h-3 w-full rounded bg-slate-100" />
              <div className="h-3 w-5/6 rounded bg-slate-100" />
              <div className="h-3 w-4/6 rounded bg-slate-100" />
            </div>
            <div className="h-3 w-20 rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  )
}
