'use client'

import { Printer, Download } from 'lucide-react'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
import { pdf } from '@react-pdf/renderer'
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer'

// Create styles for React-PDF
const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: 'Helvetica' },
  header: { borderBottom: '1 solid #e2e8f0', paddingBottom: 20, marginBottom: 20 },
  clinicName: { fontSize: 24, fontWeight: 'bold', color: '#0f172a' },
  doctorName: { fontSize: 14, fontWeight: 'bold', color: '#334155', marginTop: 5 },
  regNumber: { fontSize: 10, color: '#64748b' },
  contactInfo: { fontSize: 10, color: '#64748b', marginTop: 5 },
  patientSection: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  patientDetails: { fontSize: 11, color: '#334155', lineHeight: 1.5 },
  label: { fontWeight: 'bold', color: '#0f172a' },
  rx: { fontSize: 24, fontWeight: 'bold', marginBottom: 15 },
  table: { width: 'auto', marginBottom: 20 },
  tableRow: { flexDirection: 'row', borderBottom: '1 solid #e2e8f0', paddingVertical: 8 },
  tableHeader: { fontWeight: 'bold', fontSize: 11, color: '#0f172a' },
  colMed: { width: '40%' },
  colDosage: { width: '15%' },
  colFreq: { width: '15%' },
  colDur: { width: '15%' },
  colInst: { width: '15%' },
  tableCell: { fontSize: 10, color: '#334155' },
  notesSection: { marginTop: 20, paddingTop: 20, borderTop: '1 solid #e2e8f0' },
  notesTitle: { fontSize: 12, fontWeight: 'bold', marginBottom: 5 },
  notesText: { fontSize: 10, color: '#334155' },
  footer: { position: 'absolute', bottom: 40, left: 40, right: 40, flexDirection: 'row', justifyContent: 'space-between' },
  signature: { width: 150, borderTop: '1 solid #334155', paddingTop: 5, textAlign: 'center', fontSize: 10 },
})

const PrescriptionPDF = ({ visit, patient, prescription, settings }: any) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.clinicName}>{settings?.clinic_name || 'Clinic Name'}</Text>
        <Text style={styles.doctorName}>{settings?.doctor_name || 'Doctor Name'}</Text>
        {settings?.reg_number && <Text style={styles.regNumber}>Reg: {settings.reg_number}</Text>}
        <Text style={styles.contactInfo}>
          {[settings?.address, settings?.city, settings?.state, settings?.pin].filter(Boolean).join(', ')}
        </Text>
        <Text style={styles.contactInfo}>
          {settings?.phone} {settings?.email ? `| ${settings?.email}` : ''}
        </Text>
      </View>

      {/* Patient Info */}
      <View style={styles.patientSection}>
        <View style={styles.patientDetails}>
          <Text><Text style={styles.label}>Patient: </Text>{patient.name}</Text>
          <Text><Text style={styles.label}>Age/Sex: </Text>{patient.age} / {patient.gender}</Text>
          <Text><Text style={styles.label}>Phone: </Text>{patient.phone || 'N/A'}</Text>
        </View>
        <View style={styles.patientDetails}>
          <Text><Text style={styles.label}>Date: </Text>{format(new Date(visit.visit_date), 'MMM dd, yyyy')}</Text>
          <Text><Text style={styles.label}>Vitals: </Text>BP: {visit.bp || '--'} | T: {visit.temperature || '--'} | HR: {visit.heart_rate || '--'}</Text>
        </View>
      </View>

      <Text style={styles.rx}>Rx</Text>

      {/* Medicines Table */}
      {prescription?.medicines?.length > 0 && (
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={[styles.tableHeader, styles.colMed]}>Medicine</Text>
            <Text style={[styles.tableHeader, styles.colDosage]}>Dosage</Text>
            <Text style={[styles.tableHeader, styles.colFreq]}>Freq</Text>
            <Text style={[styles.tableHeader, styles.colDur]}>Duration</Text>
            <Text style={[styles.tableHeader, styles.colInst]}>Instructions</Text>
          </View>
          {prescription.medicines.map((med: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, styles.colMed, { fontWeight: 'bold' }]}>{med.medicine_name}</Text>
              <Text style={[styles.tableCell, styles.colDosage]}>{med.dosage || '-'}</Text>
              <Text style={[styles.tableCell, styles.colFreq]}>{med.frequency || '-'}</Text>
              <Text style={[styles.tableCell, styles.colDur]}>{med.duration || '-'}</Text>
              <Text style={[styles.tableCell, styles.colInst]}>{med.instructions || '-'}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Notes & Next Visit */}
      <View style={styles.notesSection}>
        {visit.diagnosis && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.notesTitle}>Diagnosis</Text>
            <Text style={styles.notesText}>{visit.diagnosis}</Text>
          </View>
        )}
        {visit.notes && (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.notesTitle}>Notes / Instructions</Text>
            <Text style={styles.notesText}>{visit.notes}</Text>
          </View>
        )}
        {visit.next_visit_date && (
          <View style={{ marginTop: 10 }}>
            <Text style={[styles.notesText, { fontWeight: 'bold' }]}>
              Next Visit: {format(new Date(visit.next_visit_date), 'MMMM dd, yyyy')}
            </Text>
          </View>
        )}
      </View>

      {/* Footer / Signature */}
      <View style={styles.footer}>
        <Text style={{ fontSize: 9, color: '#94a3b8' }}>Generated by Clinic OS</Text>
        <View>
          <Text style={styles.signature}>Doctor Signature</Text>
        </View>
      </View>
    </Page>
  </Document>
)

export function PrescriptionView({ visit, patient, prescription, settings }: any) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  const handleDownload = async () => {
    const blob = await pdf(<PrescriptionPDF visit={visit} patient={patient} prescription={prescription} settings={settings} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Prescription_${patient.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.pdf`
    link.click()
    URL.revokeObjectURL(url)
  }

  // Print using standard browser print, hidden normally, shown on @media print
  const handlePrint = () => {
    window.print()
  }

  if (!isClient) return null

  return (
    <>
      <button
        onClick={handlePrint}
        className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <Printer className="mr-2 h-4 w-4" />
        Print
      </button>
      <button
        onClick={handleDownload}
        className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
      >
        <Download className="mr-2 h-4 w-4" />
        Download PDF
      </button>

      {/* Printable Area (Hidden on screen, visible on print) */}
      <div className="hidden print:block w-full text-black">
        <div className="border-b border-black pb-4 mb-4">
          <h1 className="text-3xl font-bold">{settings?.clinic_name || 'Clinic Name'}</h1>
          <p className="font-bold mt-1 text-lg">{settings?.doctor_name || 'Doctor Name'}</p>
          {settings?.reg_number && <p className="text-sm">Reg: {settings.reg_number}</p>}
          <p className="text-sm mt-1">{[settings?.address, settings?.city, settings?.state, settings?.pin].filter(Boolean).join(', ')}</p>
          <p className="text-sm">{settings?.phone} {settings?.email ? `| ${settings?.email}` : ''}</p>
        </div>

        <div className="flex justify-between mb-8 text-sm">
          <div>
            <p><span className="font-bold">Patient:</span> {patient.name}</p>
            <p><span className="font-bold">Age/Sex:</span> {patient.age} / {patient.gender}</p>
            <p><span className="font-bold">Phone:</span> {patient.phone || 'N/A'}</p>
          </div>
          <div className="text-right">
            <p><span className="font-bold">Date:</span> {format(new Date(visit.visit_date), 'MMM dd, yyyy')}</p>
            <p><span className="font-bold">Vitals:</span> BP: {visit.bp || '--'} | T: {visit.temperature || '--'} | HR: {visit.heart_rate || '--'}</p>
          </div>
        </div>

        <h2 className="text-3xl font-bold mb-4">Rx</h2>

        {prescription?.medicines?.length > 0 && (
          <table className="w-full text-left mb-8 border-collapse">
            <thead>
              <tr className="border-b border-black text-sm">
                <th className="pb-2 font-bold w-2/5">Medicine</th>
                <th className="pb-2 font-bold">Dosage</th>
                <th className="pb-2 font-bold">Freq</th>
                <th className="pb-2 font-bold">Duration</th>
                <th className="pb-2 font-bold">Instructions</th>
              </tr>
            </thead>
            <tbody>
              {prescription.medicines.map((med: any, i: number) => (
                <tr key={i} className="border-b border-gray-300 text-sm">
                  <td className="py-2 font-bold">{med.medicine_name}</td>
                  <td className="py-2">{med.dosage || '-'}</td>
                  <td className="py-2">{med.frequency || '-'}</td>
                  <td className="py-2">{med.duration || '-'}</td>
                  <td className="py-2">{med.instructions || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="border-t border-black pt-4 mt-8 text-sm">
          {visit.diagnosis && (
            <div className="mb-4">
              <p className="font-bold">Diagnosis</p>
              <p>{visit.diagnosis}</p>
            </div>
          )}
          {visit.notes && (
            <div className="mb-4">
              <p className="font-bold">Notes</p>
              <p>{visit.notes}</p>
            </div>
          )}
          {visit.next_visit_date && (
            <div className="mt-4">
              <p className="font-bold">Next Visit: {format(new Date(visit.next_visit_date), 'MMMM dd, yyyy')}</p>
            </div>
          )}
        </div>

        <div className="fixed bottom-0 right-0 left-0 flex justify-between items-end pb-8">
          <p className="text-xs text-gray-500">Generated by Clinic OS</p>
          <div className="w-48 text-center border-t border-black pt-2">
            <p className="text-sm font-bold">Doctor Signature</p>
          </div>
        </div>
      </div>
    </>
  )
}
