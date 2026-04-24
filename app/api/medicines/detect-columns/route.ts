import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { headers } = await request.json()
    // Simulated detection based on common strings
    const mapping: any = {
      medicine_name: '',
      strength: '',
      dosage_form: '',
      manufacturer: '',
      price: ''
    }
    
    headers.forEach((h: string) => {
      const hl = h.toLowerCase()
      if (hl.includes('name') || hl.includes('medicine')) mapping.medicine_name = h
      else if (hl.includes('strength') || hl.includes('power')) mapping.strength = h
      else if (hl.includes('form') || hl.includes('type')) mapping.dosage_form = h
      else if (hl.includes('mfg') || hl.includes('manufacturer') || hl.includes('company')) mapping.manufacturer = h
      else if (hl.includes('price') || hl.includes('mrp')) mapping.price = h
    })
    
    return NextResponse.json({ mapping })
  } catch (e) {
    return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
  }
}
