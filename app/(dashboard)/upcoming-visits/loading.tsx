export default function UpcomingVisitsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div>
        <div className="h-9 w-48 rounded-xl bg-slate-200" />
        <div className="mt-2 h-4 w-64 rounded-lg bg-slate-100" />
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/70 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200/60 bg-white/40">
          <div className="h-5 w-32 rounded-lg bg-slate-200" />
        </div>
        <ul className="divide-y divide-slate-100">
          {[0, 1, 2, 3].map(i => (
            <li key={i} className="flex items-center justify-between p-5">
              <div>
                <div className="h-4 w-36 rounded-lg bg-slate-200" />
                <div className="mt-1.5 h-3 w-28 rounded-lg bg-slate-100" />
              </div>
              <div className="text-right">
                <div className="h-4 w-24 rounded-lg bg-slate-200 ml-auto" />
                <div className="mt-1.5 h-6 w-16 rounded-md bg-slate-100 ml-auto" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
