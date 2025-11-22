"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FeedbackResponse } from "@/lib/feedback"

interface FeedbackTableProps {
  feedbacks: FeedbackResponse[]
}

export function FeedbackTable({ feedbacks }: FeedbackTableProps) {
  const getStressBadge = (level?: string) => {
    const variants = {
      "muito-baixo": "default",
      baixo: "secondary",
      moderado: "outline",
      alto: "destructive",
      "muito-alto": "destructive",
    } as const

    const labels = {
      "muito-baixo": "Muito Baixo",
      baixo: "Baixo",
      moderado: "Moderado",
      alto: "Alto",
      "muito-alto": "Muito Alto",
    } as const

    const v = level ?? "moderado"
    return (
      <Badge variant={(variants as any)[v] ?? "outline"}>
        {(labels as any)[v] ?? v}
      </Badge>
    )
  }

  const getSatisfactionBadge = (level?: string) => {
    const variants = {
      "muito-satisfeito": "default",
      satisfeito: "secondary",
      neutro: "outline",
      insatisfeito: "destructive",
      "muito-insatisfeito": "destructive",
    } as const

    const labels = {
      "muito-satisfeito": "Muito Satisfeito",
      satisfeito: "Satisfeito",
      neutro: "Neutro",
      insatisfeito: "Insatisfeito",
      "muito-insatisfeito": "Muito Insatisfeito",
    } as const

    const v = level ?? "neutro"
    return (
      <Badge variant={(variants as any)[v] ?? "outline"}>
        {(labels as any)[v] ?? v}
      </Badge>
    )
  }

  const safeDate = (d?: string | Date | null) => {
    if (!d) return "—"
    try {
      const date = d instanceof Date ? d : new Date(d)
      if (isNaN(date.getTime())) return String(d)
      return date.toLocaleDateString("pt-BR")
    } catch {
      return String(d)
    }
  }

  if (!feedbacks || feedbacks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Respostas dos Colaboradores</CardTitle>
          <CardDescription>Nenhuma resposta recebida ainda</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-8">
            As respostas dos colaboradores aparecerão aqui quando o questionário for respondido.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <CardTitle>Respostas dos Colaboradores</CardTitle>
          <CardDescription>Visualize as respostas individuais (dados anonimizados)</CardDescription>
        </div>
        <div className="text-sm text-muted-foreground">
          {feedbacks.length} resposta{feedbacks.length > 1 ? "s" : ""}
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {feedbacks.map((feedback, index) => {
            const physicalSymptoms = Array.isArray(feedback.responses?.physicalSymptoms)
              ? feedback.responses!.physicalSymptoms
              : []

            return (
              <div key={feedback.id ?? index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Resposta #{index + 1}</h4>
                  <span className="text-sm text-muted-foreground">{safeDate(feedback.submittedAt)}</span>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <span className="text-sm font-medium">Nível de Estresse:</span>
                    <div className="mt-1">{getStressBadge(feedback.responses?.stressLevel)}</div>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Satisfação:</span>
                    <div className="mt-1">{getSatisfactionBadge(feedback.responses?.jobSatisfaction)}</div>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Equilíbrio Vida-Trabalho:</span>
                    <div className="mt-1">
                      <Badge variant="outline">{feedback.responses?.workLifeBalance ?? "—"}</Badge>
                    </div>
                  </div>

                  <div>
                    <span className="text-sm font-medium">Sintomas Físicos:</span>
                    <div className="mt-1">
                      <span className="text-sm text-muted-foreground">
                        {physicalSymptoms.length} sintoma{physicalSymptoms.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>

                {feedback.responses?.improvements && (
                  <div>
                    <span className="text-sm font-medium">Sugestões de Melhoria:</span>
                    <p className="text-sm text-muted-foreground mt-1">{feedback.responses.improvements}</p>
                  </div>
                )}

                {feedback.responses?.additionalComments && (
                  <div>
                    <span className="text-sm font-medium">Comentários:</span>
                    <p className="text-sm text-muted-foreground mt-1">{feedback.responses.additionalComments}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
