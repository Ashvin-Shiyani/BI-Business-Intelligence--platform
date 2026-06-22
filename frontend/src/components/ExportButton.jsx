import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useState } from 'react'

export default function ExportButton() {
  const [loading, setLoading] = useState(false)

  const handleExport = async () => {
    setLoading(true)
    try {
      const kpiSection = document.querySelector('.kpi-grid')
      const chartsSection = document.querySelector('.charts-grid')
      const anomalySection = document.querySelector('.anomaly-card')

      const pdf = new jsPDF('p', 'mm', 'a4')
      const pdfWidth = pdf.internal.pageSize.getWidth()

      pdf.setFontSize(20)
      pdf.setTextColor(99, 102, 241)
      pdf.text('BI Platform Report', pdfWidth / 2, 20, { align: 'center' })
      pdf.setFontSize(10)
      pdf.setTextColor(170, 170, 170)
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pdfWidth / 2, 28, { align: 'center' })

      let yPosition = 40

      const sections = [kpiSection, chartsSection, anomalySection].filter(Boolean)

      for (const section of sections) {
        const canvas = await html2canvas(section, {
          backgroundColor: '#1a1d27',
          scale: 1.5,
          useCORS: true
        })
        const imgData = canvas.toDataURL('image/png')
        const imgHeight = (canvas.height * (pdfWidth - 20)) / canvas.width

        if (yPosition + imgHeight > 280) {
          pdf.addPage()
          yPosition = 10
        }

        pdf.addImage(imgData, 'PNG', 10, yPosition, pdfWidth - 20, imgHeight)
        yPosition += imgHeight + 10
      }

      pdf.save('bi-platform-report.pdf')
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button className="export-btn" onClick={handleExport} disabled={loading}>
      {loading ? 'Generating PDF...' : 'Export PDF Report'}
    </button>
  )
}