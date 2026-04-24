import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { FileText, Plus, Trash2 } from 'lucide-react'

export default async function QuickNotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: notes } = await supabase
    .from('quick_notes')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  async function createNote(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const content = formData.get('content') as string
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user && content) {
      await supabase.from('quick_notes').insert({ user_id: user.id, title, content })
      revalidatePath('/quick-notes')
    }
  }

  async function deleteNote(id: string, formData: FormData) {
    'use server'
    const supabase = await createClient()
    await supabase.from('quick_notes').delete().eq('id', id)
    revalidatePath('/quick-notes')
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-fade-in-up">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-slate-900">Quick Notes</h2>
        <p className="mt-2 text-sm text-slate-500">Jot down temporary information, reminders, or drafts.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Create Note */}
        <div className="md:col-span-1 h-fit glass-panel rounded-2xl p-6">
          <h3 className="mb-5 text-lg font-semibold text-slate-900">New Note</h3>
          <form action={createNote} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title (Optional)</label>
              <input type="text" name="title" className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Content *</label>
              <textarea name="content" required rows={4} className="block w-full rounded-xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm transition-all placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10" />
            </div>
            <button type="submit" className="w-full flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition-all hover:bg-indigo-500 hover:shadow-lg active:scale-[0.98]">
              <Plus className="mr-2 h-4 w-4" /> Save Note
            </button>
          </form>
        </div>

        {/* Notes List */}
        <div className="md:col-span-2 space-y-4">
          {!notes || notes.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center glass-panel rounded-2xl">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-300 mb-4 shadow-sm ring-1 ring-slate-100">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">No notes yet</h3>
              <p className="mt-1 text-sm text-slate-500">Create your first quick note.</p>
            </div>
          ) : (
            notes.map(note => (
              <div key={note.id} className="relative glass-panel card-hover rounded-2xl p-6 group">
                <form action={deleteNote.bind(null, note.id)} className="absolute right-5 top-5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                  <button type="submit" className="rounded-lg p-2 text-slate-400 transition-all hover:bg-red-50 hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </form>
                {note.title && <h4 className="font-semibold text-slate-900 mb-2 pr-8">{note.title}</h4>}
                <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">{note.content}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
