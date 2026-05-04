export default function PatientsLoading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-9 w-32 rounded-xl bg-slate-200" />
          <div className="mt-2 h-4 w-48 rounded-lg bg-slate-100" />
        </div>
        <div className="h-10 w-32 rounded-xl bg-slate-200" />
      </div>
      <div className="rounded-2xl border border-white/20 bg-white/70 overflow-hidden">
        <div className="border-b border-slate-200/60 p-5 bg-white/40">
          <div className="h-11 rounded-xl bg-slate-100 w-full" />
        </div>
        <ul className="divide-y divide-slate-100">
          {[0, 1, 2, 3, 4].map(i => (
            <li key={i} className="flex items-center justify-between p-5">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-slate-200" />
                <div>
                  <div className="h-4 w-36 rounded-lg bg-slate-200" />
                  <div className="mt-1.5 h-3 w-28 rounded-lg bg-slate-100" />
                </div>
              </div>
              <div className="h-5 w-5 rounded-full bg-slate-100" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
