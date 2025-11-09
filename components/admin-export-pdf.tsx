"use client"

import { jsPDF } from "jspdf"
import { getAllFeedbacks } from "@/lib/feedback"
import { Button } from "@/components/ui/button"
import { FileDown } from "lucide-react"

export function AdminExportPDF() {
  const handleExportPDF = () => {
    const feedbacks = getAllFeedbacks()
    if (!feedbacks || feedbacks.length === 0) {
      alert("Nenhum feedback encontrado para exportar.")
      return
    }

    const doc = new jsPDF()
    const margin = 20
    let y = margin

    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("Relatório de Feedbacks - BurnoutCare", margin, y)
    y += 10

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.text(`Total de feedbacks: ${feedbacks.length}`, margin, y)
    y += 15

    feedbacks.forEach((fb, index) => {
      const r = fb.responses || {}

      doc.setFont("helvetica", "bold")
      doc.text(`#${index + 1}  •  Usuário: ${fb ?? "(sem nome)"}`, margin, y)
      y += 10

      doc.setFont("helvetica", "normal")
      doc.text(`Data: ${new Date(fb.submittedAt).toLocaleString()}`, margin, y)
      y += 8

      const fields = [
        ["Nível de Estresse", r.stressLevel],
        ["Gerenciamento de Carga de Trabalho", r.workloadManageable],
        ["Equilíbrio Vida-Trabalho", r.workLifeBalance],
        ["Suporte do Gestor", r.supportFromManager],
        ["Colaboração em Equipe", r.teamCollaboration],
        ["Flexibilidade no Trabalho", r.workplaceFlexibility],
        ["Sintomas Físicos", (r.physicalSymptoms || []).join(", ")],
        ["Bem-Estar Mental", r.mentalWellbeing],
        ["Qualidade do Sono", r.sleepQuality],
        ["Satisfação no Trabalho", r.jobSatisfaction],
        ["Desenvolvimento de Carreira", r.careerDevelopment],
        ["Reconhecimento", r.recognition],
        ["Sugestões de Melhoria", r.improvements],
        ["Comentários Adicionais", r.additionalComments],
      ]

      fields.forEach(([label, value]) => {
        const text = `${label}: ${value || "—"}`
        const split = doc.splitTextToSize(text, 170)
        split.forEach((line: string) => {
          if (y > 270) {
            doc.addPage()
            y = margin
          }
          doc.text(line, margin + 10, y)
          y += 7
        })
      })

      y += 8
      if (y > 270) {
        doc.addPage()
        y = margin
      }
    })

    doc.save("feedbacks-burnoutcare.pdf")
  }

  return (
    <div className="border rounded-lg p-6 bg-card shadow-md">
      <h2 className="text-lg font-semibold mb-4">Exportar Relatório</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Gere um relatório completo em PDF com todos os feedbacks registrados.
      </p>
      <Button onClick={handleExportPDF} className="flex items-center gap-2">
        <FileDown className="w-4 h-4" />
        Exportar PDF
      </Button>
    </div>
  )
}
