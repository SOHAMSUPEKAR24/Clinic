import { Sidebar } from '@/components/sidebar/Sidebar'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFAFA]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto relative">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 pb-24 lg:pb-10">
          {children}
        </div>
      </main>
    </div>
  )
}
