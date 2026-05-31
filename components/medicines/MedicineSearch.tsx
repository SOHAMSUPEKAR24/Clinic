'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, Search } from 'lucide-react'

export function MedicineSearch({ onAdd }: { onAdd: (medicine: any) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showCustom, setShowCustom] = useState(false)
  const [customName, setCustomName] = useState('')
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchMeds = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }
      setLoading(true)
      try {
        const res = await fetch(`/api/medicines/search?q=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(data)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    const timer = setTimeout(fetchMeds, 300)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <div className="relative space-y-2" ref={wrapperRef}>
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search for medicines..."
          className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-4 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center transition-colors"
        >
          {showCustom ? <X className="mr-1 h-3 w-3" /> : <Plus className="mr-1 h-3 w-3" />}
          {showCustom ? "Cancel" : "Add Custom Medicine Manually"}
        </button>
      </div>

      {showCustom && (
        <div className="flex gap-2 items-center bg-slate-50 p-3 rounded-lg border border-slate-200 animate-in fade-in slide-in-from-top-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder="Enter custom medicine name..."
            className="flex-1 rounded-md border border-slate-300 py-2 px-3 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            autoFocus
          />
          <button
            type="button"
            onClick={() => {
              if (customName.trim()) {
                onAdd({ medicine_name: customName.trim(), isNewCustom: true })
                setCustomName('')
                setShowCustom(false)
              }
            }}
            className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors whitespace-nowrap"
          >
            Add Medicine
          </button>
        </div>
      )}

      {isOpen && !showCustom && (query || results.length > 0) && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {loading ? (
            <div className="px-4 py-2 text-sm text-slate-500">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((med) => (
                <button
                  key={med.id}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 transition-colors"
                  onClick={() => {
                    onAdd(med)
                    setQuery('')
                    setIsOpen(false)
                  }}
                >
                  <span className="font-medium">{med.medicine_name}</span>
                  {med.strength && <span className="ml-2 text-slate-500 text-xs">{med.strength}</span>}
                  {med.is_custom && <span className="ml-2 rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-700 ring-1 ring-inset ring-indigo-500/20">Custom</span>}
                </button>
              ))}
              <div className="border-t border-slate-100 px-4 py-2 bg-slate-50/50">
                <button
                  type="button"
                  className="flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
                  onClick={() => {
                    onAdd({ medicine_name: query, isNewCustom: true })
                    setQuery('')
                    setIsOpen(false)
                  }}
                >
                  <Plus className="mr-1 h-4 w-4" /> Add "{query}" as Custom Medicine
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-3 bg-slate-50/50 text-center">
              <p className="text-sm text-slate-500 mb-2">No results found for "{query}".</p>
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-md bg-indigo-50 px-3 py-1.5 text-sm font-medium text-indigo-700 ring-1 ring-inset ring-indigo-600/20 hover:bg-indigo-100 transition-colors"
                onClick={() => {
                  onAdd({ medicine_name: query, isNewCustom: true })
                  setQuery('')
                  setIsOpen(false)
                }}
              >
                <Plus className="mr-1 h-4 w-4" /> Add as Custom Medicine
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
