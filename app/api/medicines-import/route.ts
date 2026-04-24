import { createAdminClient, createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import Papa from 'papaparse'
import { logger } from '@/lib/logger'

// Ensure we don't timeout too quickly if on Vercel Pro/Enterprise (max is higher). 
// On free, this will still timeout at 10-15s if the file is massive.
export const maxDuration = 300; // 5 minutes

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Check if admin
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { fileName, mapping } = await request.json()

  if (!fileName || !mapping || !mapping.medicine_name) {
    return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  try {
    // 1. Download file from Storage
    const { data: fileData, error: downloadError } = await adminClient.storage
      .from('medicines_csv')
      .download(fileName)

    if (downloadError || !fileData) {
      throw new Error('Failed to download CSV from storage')
    }

    const csvText = await fileData.text()
    
    // 2. Parse CSV and build batch
    let processedRows = 0
    let batch: any[] = []
    
    const parseResult = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    })
    
    if (parseResult.errors.length > 0 && parseResult.data.length === 0) {
       throw new Error(`CSV Parse error: ${parseResult.errors[0].message}`)
    }

    const rows = parseResult.data

    // 3. Insert in batches sequentially to not overwhelm DB
    const BATCH_SIZE = 1000
    for (let i = 0; i < rows.length; i += BATCH_SIZE) {
      const chunk = rows.slice(i, i + BATCH_SIZE)
      
      const mappedChunk = chunk.map((data: any) => {
        let combinedStrength = null
        if (Array.isArray(mapping.strength)) {
          combinedStrength = mapping.strength
            .map((col: string) => data[col])
            .filter((val: any) => val && val !== 'null' && val !== 'None')
            .join(' + ')
        } else if (mapping.strength) {
          combinedStrength = data[mapping.strength]
        }

        return {
          medicine_name: data[mapping.medicine_name],
          strength: combinedStrength,
          dosage_form: mapping.dosage_form ? data[mapping.dosage_form] : null,
          manufacturer: mapping.manufacturer ? data[mapping.manufacturer] : null,
          price: mapping.price ? parseFloat(data[mapping.price]) || null : null,
          user_id: null,
          is_custom: false
        }
      }).filter((item: any) => item.medicine_name) // filter out empties

      if (mappedChunk.length > 0) {
        const { error: insertError } = await adminClient.from('medicines').insert(mappedChunk)
        if (insertError) {
          console.error('Batch insert error', insertError)
          throw new Error(insertError.message)
        }
        processedRows += mappedChunk.length
      }
    }

    // Optional: Delete the file after processing to save storage space
    await adminClient.storage.from('medicines_csv').remove([fileName])

    logger.info('CSV_IMPORT_COMPLETE', { processed: processedRows }, user.id)
    return NextResponse.json({ success: true, processed: processedRows })
  } catch (e: any) {
    logger.error('CSV_IMPORT_FAILED', e, user.id, { fileName })
    return NextResponse.json({ error: e.message || 'Processing failed' }, { status: 500 })
  }
}
