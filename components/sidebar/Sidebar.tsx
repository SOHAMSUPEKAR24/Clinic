'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Calendar, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Patient', href: '/patients/new', icon: Users },
  { name: 'Quick Notes', href: '/quick-notes', icon: FileText },
  { name: 'Upcoming Visits', href: '/upcoming-visits', icon: Calendar },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-slate-200/60 bg-white/60 backdrop-blur-2xl">
      <div className="flex h-20 items-center px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/20">
            <LayoutDashboard className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Clinic OS</h1>
        </div>
      </div>

      <nav className="flex-1 space-y-1.5 px-4 py-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              prefetch={true}
              className={cn(
                'group flex items-center rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                isActive
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm ring-1 ring-indigo-100'
                  : 'text-slate-600 hover:bg-slate-50/80 hover:text-slate-900 active:scale-[0.98]'
              )}
            >
              <item.icon
                className={cn(
                  'mr-3 h-5 w-5 flex-shrink-0 transition-colors',
                  isActive ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'
                )}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-slate-200/60 p-4">
        <form action="/api/auth/signout" method="POST">
          <button
            type="submit"
            className="group flex w-full items-center rounded-xl px-4 py-3 text-sm font-semibold text-slate-600 transition-all duration-300 hover:bg-red-50 hover:text-red-700 active:scale-[0.98]"
          >
            <LogOut className="mr-3 h-5 w-5 flex-shrink-0 text-slate-400 transition-colors group-hover:text-red-500" />
            Sign out
          </button>
        </form>
      </div>
    </div>
  )
}
