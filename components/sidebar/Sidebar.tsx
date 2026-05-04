'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, FileText, Calendar, Settings, LogOut, Menu, X } from 'lucide-react'
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
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar when navigating on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 rounded-xl bg-white p-2.5 shadow-lg shadow-slate-200/50 border border-slate-200 lg:hidden active:scale-95 transition-all"
      >
        <Menu className="h-6 w-6 text-slate-600" />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-all duration-300 animate-in fade-in"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 transform bg-white/80 backdrop-blur-2xl border-r border-slate-200/60 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-20 items-center justify-between px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 shadow-lg shadow-indigo-600/20">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">Clinic OS</h1>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="lg:hidden rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
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

      {/* Mobile Bottom Navigation (Optional but good for UX) */}
      <div className="fixed bottom-0 inset-x-0 z-40 h-16 bg-white/80 backdrop-blur-lg border-t border-slate-200 lg:hidden flex items-center justify-around px-2 pb-safe">
        {navItems.slice(0, 4).map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 flex-1 h-full rounded-lg transition-colors",
                isActive ? "text-indigo-600" : "text-slate-500"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{item.name.split(' ')[0]}</span>
            </Link>
          )
        })}
      </div>
    </>
  )
}
