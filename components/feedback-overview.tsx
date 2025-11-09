// components/feedback-overview.tsx
"use client"

import { useEffect, useState } from "react"
import type { FeedbackResponse } from "@/lib/feedback"
import { getFeedbacksByUser, analyzeUserFeedbacks } from "@/lib/feedback"
import { getCurrentUser } from "@/lib/auth"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { FeedbackTable } from "@/components/feedback-table"
import { FeedbackCharts } from "@/components/feedback-charts"

export default function FeedbackOverview() {
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([])
  const [stats, setStats] = useState({
    totalResponses: 0,
    averageStress: 0,
    burnoutRisk: 0,
    satisfactionScore: 0,
  })

  useEffect(() => {
    const u = getCurrentUser()
    if (!u?.id) return
    const f = getFeedbacksByUser(u.id)
    setFeedbacks(f)
    setStats(analyzeUserFeedbacks(f))
  }, [])

  const needHelp = stats.burnoutRisk >= 60 || stats.averageStress >= 4

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Como você está</CardTitle>
            <CardDescription>Resumo baseado nas suas respostas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-3">
              <div className="text-xs text-muted-foreground">Risco de Burnout</div>
              <div className="flex items-center gap-3">
                <div className="w-full">
                  <Progress value={stats.burnoutRisk} />
                </div>
                <div className="w-16 text-right font-medium">{stats.burnoutRisk}%</div>
              </div>
            </div>

            <div className="mb-3">
              <div className="text-xs text-muted-foreground">Estresse médio</div>
              <div className="text-lg font-semibold">{stats.averageStress} / 5</div>
            </div>

            <div>
              <div className="text-xs text-muted-foreground">Satisfação no trabalho</div>
              <div className="text-lg font-semibold">{stats.satisfactionScore} / 5</div>
            </div>

            <div className="mt-4 flex gap-2">
              <Button variant={needHelp ? "destructive" : "secondary"} onClick={() => {
                // ação simples: abrir modal ou redirecionar - por enquanto faz um alert
                // Você pode trocar por modal real.
                if (needHelp) {
                  alert("Recomendamos que procure apoio: fale com seu gestor ou RH.")
                } else {
                  alert("Tudo bem por enquanto — mantenha o acompanhamento regular.")
                }
              }}>
                {needHelp ? "Preciso de ajuda" : "Tudo bem por enquanto"}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimos feedbacks</CardTitle>
            <CardDescription>Veja as últimas respostas que você enviou</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">
              {feedbacks.length === 0 ? "Nenhum feedback encontrado." : `${feedbacks.length} respostas`}
            </div>
            {feedbacks.length > 0 && <FeedbackTable feedbacks={feedbacks} />}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Visão geral</CardTitle>
            <CardDescription>Gráficos com evolução (se houver dados)</CardDescription>
          </CardHeader>
          <CardContent>
            <FeedbackCharts feedbacks={feedbacks} />
          </CardContent>
        </Card>
      </div>

      {/* Lista completa embaixo (opcional) */}
      {feedbacks.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold mb-4">Histórico completo</h2>
          <FeedbackTable feedbacks={feedbacks} />
        </section>
      )}
    </div>
  )
}
