'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'

export function CSVImport() {
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'parsing' | 'mapping' | 'uploading' | 'processing' | 'complete' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const [previewHeaders, setPreviewHeaders] = useState<string[]>([])
  const supabase = createClient()
  
  // Mapping standard DB fields -> CSV Columns
  const [mapping, setMapping] = useState<{
    medicine_name: string;
    strength: string | string[];
    dosage_form: string;
    manufacturer: string;
    price: string;
  }>({
    medicine_name: '',
    strength: [],
    dosage_form: '',
    manufacturer: '',
    price: '',
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setStatus('parsing')
      
      Papa.parse(selectedFile, {
        header: true,
        preview: 1, // just read header to get fields
        complete: (results) => {
          if (results.meta.fields) {
            setPreviewHeaders(results.meta.fields)
            
            // Auto-detect common headers
            const autoMap: any = { ...mapping, strength: [] }
            results.meta.fields.forEach(h => {
              const hl = h.toLowerCase()
              if (hl.includes('name') || hl.includes('medicine') || hl.includes('item') || hl.includes('product') || hl.includes('brand')) {
                if (!autoMap.medicine_name) autoMap.medicine_name = h
              }
              else if (hl.includes('strength') || hl.includes('power') || hl.includes('composition') || hl.includes('content') || hl.includes('mg') || hl.includes('ml')) {
                autoMap.strength.push(h)
              }
              else if (hl.includes('form') || hl.includes('type') || hl.includes('pack') || hl.includes('size') || hl.includes('label')) {
                if (!autoMap.dosage_form) autoMap.dosage_form = h
              }
              else if (hl.includes('mfg') || hl.includes('manufacturer') || hl.includes('company') || hl.includes('lab') || hl.includes('brand')) {
                if (!autoMap.manufacturer) autoMap.manufacturer = h
              }
              else if (hl.includes('price') || hl.includes('mrp') || hl.includes('cost') || hl.includes('rate')) {
                if (!autoMap.price) autoMap.price = h
              }
            })
            setMapping(autoMap)
            setStatus('mapping')
          }
        },
        error: (err) => {
          setStatus('error')
          setErrorMsg(err.message)
          toast.error(`Parse Error: ${err.message}`)
        }
      })
    }
  }

  const startImport = async () => {
    if (!file) return
    setStatus('uploading')

    try {
      const fileName = `${Date.now()}_${file.name}`
      const { error: uploadError } = await supabase.storage
        .from('medicines_csv')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw new Error(`Upload Failed: ${uploadError.message}`)

      setStatus('processing')
      toast.success('File uploaded. Processing started...')

      const res = await fetch('/api/medicines-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fileName, mapping })
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || 'Backend processing failed')

      setStatus('complete')
      toast.success(`Import completed successfully! Inserted ${result.processed} medicines.`)
    } catch (e: any) {
      console.error('Import error:', e)
      setStatus('error')
      setErrorMsg(e.message)
      toast.error(e.message)
    }
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Import Medicine Database</h3>
      <p className="text-sm text-slate-500 mb-6">Upload a CSV containing up to 255K+ medicines. Global database (accessible to all clinics).</p>
      
      {status === 'idle' && (
        <div>
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="block w-full text-sm text-slate-500 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
          />
        </div>
      )}

      {status === 'parsing' && <div className="text-sm text-slate-600">Reading CSV headers...</div>}

      {status === 'mapping' && (
        <div className="space-y-4">
          <div className="rounded-md bg-blue-50 p-4 border border-blue-100">
            <h4 className="text-sm font-medium text-blue-900 mb-3">Map CSV Columns to Database Fields</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.keys(mapping).map((field) => (
                <div key={field} className="space-y-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    {field.replace('_', ' ')} {field === 'medicine_name' && <span className="text-red-500">*</span>}
                  </label>
                  
                  {field === 'strength' ? (
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto rounded-lg border border-slate-200 bg-white p-3">
                      {previewHeaders.map(h => (
                        <label key={h} className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={Array.isArray(mapping.strength) && mapping.strength.includes(h)}
                            onChange={(e) => {
                              const current = Array.isArray(mapping.strength) ? mapping.strength : []
                              if (e.target.checked) {
                                setMapping({ ...mapping, strength: [...current, h] })
                              } else {
                                setMapping({ ...mapping, strength: current.filter(x => x !== h) })
                              }
                            }}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          {h}
                        </label>
                      ))}
                    </div>
                  ) : (
                    <select
                      value={(mapping as any)[field]}
                      onChange={(e) => setMapping({ ...mapping, [field]: e.target.value })}
                      className="block w-full rounded-xl border border-slate-200 py-2.5 px-4 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-all"
                    >
                      <option value="">-- Ignore --</option>
                      {previewHeaders.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={startImport}
            disabled={!mapping.medicine_name}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Start Import
          </button>
        </div>
      )}

      {status === 'uploading' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-slate-700">
            <span>Uploading to secure storage...</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-blue-600 w-1/2 animate-pulse" />
          </div>
        </div>
      )}

      {status === 'processing' && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-medium text-slate-700">
            <span>Processing and inserting on backend (this may take a while)...</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
            <div className="h-full bg-green-500 w-full animate-pulse" />
          </div>
        </div>
      )}

      {status === 'complete' && (
        <div className="rounded-md bg-green-50 p-4 border border-green-200">
          <p className="text-sm font-medium text-green-800">Import completed successfully!</p>
          <button onClick={() => {setFile(null); setStatus('idle')}} className="mt-2 text-sm text-green-700 underline">Import another file</button>
        </div>
      )}

      {status === 'error' && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">Error during import</p>
          <p className="text-xs text-red-600 mt-1">{errorMsg}</p>
          <button onClick={() => {setFile(null); setStatus('idle')}} className="mt-3 rounded-md bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm border border-slate-300">Try Again</button>
        </div>
      )}
    </div>
  )
}
