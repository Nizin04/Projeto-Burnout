import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { FeedbackResponse } from "@/lib/feedback"

interface FeedbackTableProps {
  feedbacks: FeedbackResponse[]
}

export function FeedbackTable({ feedbacks }: FeedbackTableProps) {
  const getStressBadge = (level: string) => {
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

    return (
      <Badge variant={variants[level as keyof typeof variants] || "outline"}>
        {labels[level as keyof typeof labels] || level}
      </Badge>
    )
  }

  const getSatisfactionBadge = (level: string) => {
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

    return (
      <Badge variant={variants[level as keyof typeof variants] || "outline"}>
        {labels[level as keyof typeof labels] || level}
      </Badge>
    )
  }

  if (feedbacks.length === 0) {
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
      <CardHeader>
        <CardTitle>Respostas dos Colaboradores</CardTitle>
        <CardDescription>Visualize as respostas individuais (dados anonimizados)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {feedbacks.map((feedback, index) => (
            <div key={feedback.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Resposta #{index + 1}</h4>
                <span className="text-sm text-muted-foreground">
                  {feedback.submittedAt.toLocaleDateString("pt-BR")}
                </span>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div>
                  <span className="text-sm font-medium">Nível de Estresse:</span>
                  <div className="mt-1">{getStressBadge(feedback.responses.stressLevel)}</div>
                </div>

                <div>
                  <span className="text-sm font-medium">Satisfação:</span>
                  <div className="mt-1">{getSatisfactionBadge(feedback.responses.jobSatisfaction)}</div>
                </div>

                <div>
                  <span className="text-sm font-medium">Equilíbrio Vida-Trabalho:</span>
                  <div className="mt-1">
                    <Badge variant="outline">{feedback.responses.workLifeBalance}</Badge>
                  </div>
                </div>

                <div>
                  <span className="text-sm font-medium">Sintomas Físicos:</span>
                  <div className="mt-1">
                    <span className="text-sm text-muted-foreground">
                      {feedback.responses.physicalSymptoms.length} sintoma(s)
                    </span>
                  </div>
                </div>
              </div>

              {feedback.responses.improvements && (
                <div>
                  <span className="text-sm font-medium">Sugestões de Melhoria:</span>
                  <p className="text-sm text-muted-foreground mt-1">{feedback.responses.improvements}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
