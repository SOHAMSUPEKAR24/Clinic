'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus, X, Search } from 'lucide-react'

export function MedicineSearch({ onAdd }: { onAdd: (medicine: any) => void }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
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
    <div className="relative" ref={wrapperRef}>
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
          className="w-full rounded-md border border-slate-300 py-2 pl-9 pr-4 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {isOpen && (query || results.length > 0) && (
        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-200 bg-white py-1 shadow-lg">
          {loading ? (
            <div className="px-4 py-2 text-sm text-slate-500">Searching...</div>
          ) : results.length > 0 ? (
            <>
              {results.map((med) => (
                <button
                  key={med.id}
                  type="button"
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50"
                  onClick={() => {
                    onAdd(med)
                    setQuery('')
                    setIsOpen(false)
                  }}
                >
                  <span className="font-medium">{med.medicine_name}</span>
                  {med.strength && <span className="ml-2 text-slate-500">{med.strength}</span>}
                  {med.is_custom && <span className="ml-2 rounded bg-blue-100 px-1.5 py-0.5 text-xs text-blue-800">Custom</span>}
                </button>
              ))}
              <div className="border-t border-slate-100 px-4 py-2">
                <button
                  type="button"
                  className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
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
            <div className="px-4 py-2">
              <p className="text-sm text-slate-500">No results found.</p>
              <button
                type="button"
                className="mt-2 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                onClick={() => {
                  onAdd({ medicine_name: query, isNewCustom: true })
                  setQuery('')
                  setIsOpen(false)
                }}
              >
                <Plus className="mr-1 h-4 w-4" /> Add "{query}" as Custom Medicine
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
