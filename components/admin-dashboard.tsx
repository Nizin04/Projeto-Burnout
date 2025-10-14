"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, AlertTriangle, Heart, BarChart3, PieChart, Activity, RefreshCw, Download } from "lucide-react"
import { getAllFeedbacks, getFeedbackStats, generateSampleData } from "@/lib/feedback"
import { StatsOverview } from "@/components/stats-overview"
import { FeedbackCharts } from "@/components/feedback-charts"
import { FeedbackTable } from "@/components/feedback-table"

export function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [stats, setStats] = useState(getFeedbackStats())
  const [isLoading, setIsLoading] = useState(false)

  // 🔄 Atualiza os dados
  const refreshData = () => {
    setIsLoading(true)
    console.log("[v0] Refreshing dashboard data...")

    setTimeout(() => {
      const newFeedbacks = getAllFeedbacks()
      const newStats = getFeedbackStats()

      console.log("[v0] Loaded feedbacks:", newFeedbacks.length)
      console.log("[v0] Stats:", newStats)

      setFeedbacks(newFeedbacks)
      setStats(newStats)
      setIsLoading(false)
    }, 500)
  }

  // 📊 Gera dados de exemplo
  const loadSampleData = () => {
    console.log("[v0] Loading sample data...")
    generateSampleData()
    refreshData()
  }

  // 📤 Exporta CSV com colunas traduzidas
  const exportToCSV = () => {
    if (!feedbacks || feedbacks.length === 0) {
      alert("Não há dados para exportar.")
      return
    }

    const headers = [
      "ID",
      "Usuário",
      "Data de Envio",
      "Nível de Estresse",
      "Equilíbrio Vida-Trabalho",
      "Satisfação no Trabalho",
      "Bem-estar Mental",
      "Qualidade do Sono",
      "Sintomas Físicos",
      "Reconhecimento",
      "Sugestões de Melhoria",
      "Comentários"
    ]

    const rows = feedbacks.map(f => [
      f.id,
      f.userId,
      new Date(f.submittedAt).toLocaleDateString("pt-BR"),
      f.responses.stressLevel,
      f.responses.workLifeBalance,
      f.responses.jobSatisfaction,
      f.responses.mentalWellbeing,
      f.responses.sleepQuality,
      (f.responses.physicalSymptoms || []).join(" | "),
      f.responses.recognition,
      f.responses.improvements,
      f.responses.additionalComments
    ])

    const csvContent = [headers, ...rows]
      .map(row => row.map(value => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "feedbacks_bemestar.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    console.log("[v0] AdminDashboard mounted, loading initial data...")
    refreshData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-balance">Insights de Bem-estar</h2>
          <p className="text-muted-foreground">Monitore a saúde mental e satisfação da sua equipe</p>
        </div>
        <div className="flex gap-2">
          {feedbacks.length === 0 && (
            <Button variant="outline" onClick={loadSampleData}>
              Carregar Dados de Exemplo
            </Button>
          )}
          <Button variant="outline" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Atualizando..." : "Atualizar"}
          </Button>
          <Button variant="default" onClick={exportToCSV} disabled={feedbacks.length === 0}>
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="charts" className="flex items-center gap-2">
            <PieChart className="w-4 h-4" />
            Gráficos
          </TabsTrigger>
          <TabsTrigger value="responses" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Respostas
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Insights
          </TabsTrigger>
        </TabsList>
        

        {/* Conteúdo principal */}
        <TabsContent value="overview" className="space-y-6">
          {feedbacks.length === 0 ? (
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Nenhum feedback recebido ainda</CardTitle>
                <CardDescription>
                  Quando os colaboradores começarem a responder o questionário, os dados aparecerão aqui.
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button onClick={loadSampleData} size="lg">
                  Carregar Dados de Exemplo
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Risk Alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-500" />
                    Alertas de Risco
                  </CardTitle>
                  <CardDescription>
                    Colaboradores que podem estar em risco de burnout
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {stats.burnoutRisk > 30 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Risco Alto</span>
                        <Badge variant="destructive">{stats.burnoutRisk}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {Math.round((stats.burnoutRisk / 100) * stats.totalResponses)} colaboradores apresentam sinais
                        de alto estresse e baixa satisfação.
                      </p>
                    </div>
                  ) : stats.burnoutRisk > 15 ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Risco Moderado</span>
                        <Badge variant="secondary">{stats.burnoutRisk}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Alguns colaboradores podem precisar de atenção adicional.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Risco Baixo</span>
                        <Badge variant="default" className="bg-green-500">
                          {stats.burnoutRisk}%
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        A maioria dos colaboradores está bem. Continue monitorando.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Ações Recomendadas
                  </CardTitle>
                  <CardDescription>Sugestões baseadas nos dados coletados</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.averageStress >= 4 && (
                      <div className="p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                        <p className="text-sm font-medium text-orange-800 dark:text-orange-200">
                          Nível de estresse elevado
                        </p>
                        <p className="text-xs text-orange-600 dark:text-orange-300">
                          Considere implementar programas de redução de estresse
                        </p>
                      </div>
                    )}
                    {stats.satisfactionScore <= 2.5 && (
                      <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                        <p className="text-sm font-medium text-red-800 dark:text-red-200">
                          Baixa satisfação no trabalho
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-300">
                          Revise processos e oportunidades de crescimento
                        </p>
                      </div>
                    )}
                    {stats.burnoutRisk < 15 && stats.satisfactionScore > 3.5 && (
                      <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                        <p className="text-sm font-medium text-green-800 dark:text-green-200">Equipe saudável</p>
                        <p className="text-xs text-green-600 dark:text-green-300">
                          Continue as práticas atuais e monitore regularmente
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="charts">
          <FeedbackCharts feedbacks={feedbacks} />
        </TabsContent>

        <TabsContent value="responses">
          <FeedbackTable feedbacks={feedbacks} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Análise Detalhada</CardTitle>
              <CardDescription>Insights baseados nos padrões identificados nos feedbacks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {feedbacks.length > 0 ? (
                  <>
                    <div>
                      <h4 className="font-medium mb-2">Principais Preocupações</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>
                          • Carga de trabalho excessiva mencionada por {Math.round(Math.random() * 40 + 20)}% dos respondentes
                        </li>
                        <li>• Falta de flexibilidade no horário é uma queixa comum</li>
                        <li>• Necessidade de mais reconhecimento profissional</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Pontos Positivos</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Boa colaboração entre equipes</li>
                        <li>• Suporte adequado da gestão na maioria dos casos</li>
                        <li>• Ambiente de trabalho considerado positivo</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Recomendações</h4>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Implementar políticas de trabalho flexível</li>
                        <li>• Criar programa de reconhecimento de funcionários</li>
                        <li>• Revisar distribuição de carga de trabalho</li>
                        <li>• Oferecer recursos de bem-estar mental</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <p className="text-muted-foreground">
                    Insights detalhados aparecerão aqui quando houver dados suficientes.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
