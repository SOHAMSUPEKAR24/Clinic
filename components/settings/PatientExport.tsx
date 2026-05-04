'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import * as XLSX from 'xlsx'
import { Download, FileSpreadsheet, Loader2 } from 'lucide-react'
import toast from 'react-hot-toast'

export function PatientExport() {
  const [isExporting, setIsExporting] = useState(false)
  const supabase = createClient()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not authenticated')

      // Fetch all patients for this user
      const { data: patients, error } = await supabase
        .from('patients')
        .select('name, age, gender, phone, email, address, created_at')
        .eq('user_id', user.id)
        .order('name', { ascending: true })

      if (error) throw error

      if (!patients || patients.length === 0) {
        toast.error('No patients found to export')
        return
      }

      // Format data for Excel
      const formattedData = patients.map(p => ({
        'Name': p.name,
        'Age': p.age || 'N/A',
        'Gender': p.gender || 'N/A',
        'Phone': p.phone || 'N/A',
        'Email': p.email || 'N/A',
        'Address': p.address || 'N/A',
        'Registration Date': p.created_at ? new Date(p.created_at).toLocaleDateString() : 'N/A'
      }))

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(formattedData)
      
      // Create workbook
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Patients')

      // Generate filename with current date
      const date = new Date().toISOString().split('T')[0]
      const fileName = `patients_export_${date}.xlsx`

      // Export to file
      XLSX.writeFile(workbook, fileName)
      
      toast.success('Patients data exported successfully!')
    } catch (error: unknown) {
      console.error('Export error:', error)
      const message = error instanceof Error ? error.message : 'An unknown error occurred'
      toast.error(`Export failed: ${message}`)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="glass-panel card-hover rounded-2xl p-6 md:col-span-2 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            <FileSpreadsheet className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Data Management</h3>
            <p className="text-sm text-slate-500">Export your patient records for backup or analysis.</p>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/50 border border-slate-100">
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold text-slate-900">Export Patients List</p>
          <p className="text-xs text-slate-500">Download all patient data in Microsoft Excel format (.xlsx)</p>
        </div>
        
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 shadow-sm border border-slate-200 transition-all hover:bg-slate-50 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Exporting...</span>
            </>
          ) : (
            <>
              <Download className="h-4 w-4" />
              <span>Export Excel</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
