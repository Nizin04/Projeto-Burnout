"use client"

// source zip (referência): /mnt/data/Burnout.zip

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  AlertTriangle,
  Heart,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Download,
  BarChart
} from "lucide-react"
import {
  getAllFeedbacks,
  getFeedbackStats,
  generateSampleData
} from "@/lib/feedback"
import { StatsOverview } from "@/components/stats-overview"
import { FeedbackCharts } from "@/components/feedback-charts"
import { FeedbackTable } from "@/components/feedback-table"
import InterventionSimulator from "@/components/intervention-simulator" // default export expected
import Heatmap from "@/components/heatmap" // heatmap import (component separado)

export function AdminDashboard() {
  const [feedbacks, setFeedbacks] = useState<any[]>([])
  const [stats, setStats] = useState<any>(() => getFeedbackStats())
  const [isLoading, setIsLoading] = useState(false)

  // modal state
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false)

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

  // 📤 Exporta Excel (.xlsx) com cabeçalho colorido + resumo
  const exportToExcel = () => {
    if (!feedbacks || feedbacks.length === 0) {
      alert("Não há dados para exportar.")
      return
    }

    import("xlsx").then(XLSX => {
      const headers = [
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

      const rows = feedbacks.map(f => ({
        "Data de Envio": f.submittedAt ? new Date(f.submittedAt).toLocaleDateString("pt-BR") : "",
        "Nível de Estresse": f.responses?.stressLevel ?? "",
        "Equilíbrio Vida-Trabalho": f.responses?.workLifeBalance ?? "",
        "Satisfação no Trabalho": f.responses?.jobSatisfaction ?? "",
        "Bem-estar Mental": f.responses?.mentalWellbeing ?? "",
        "Qualidade do Sono": f.responses?.sleepQuality ?? "",
        "Sintomas Físicos": (f.responses?.physicalSymptoms || []).join(" | "),
        "Reconhecimento": f.responses?.recognition ?? "",
        "Sugestões de Melhoria": f.responses?.improvements ?? "",
        "Comentários": f.responses?.additionalComments ?? ""
      }))

      const summary = [
        ["Resumo de Bem-estar"],
        ["Total de Respostas", stats?.totalResponses ?? rows.length],
        ["Risco de Burnout (%)", stats?.burnoutRisk ?? ""],
        ["Média de Estresse", stats?.averageStress ?? ""],
        ["Satisfação Média", stats?.satisfactionScore ?? ""],
        []
      ]

      const worksheet = XLSX.utils.aoa_to_sheet(summary)

      XLSX.utils.sheet_add_json(worksheet, rows, {
        origin: "A8",
        header: headers,
        skipHeader: false
      })

      const range = XLSX.utils.decode_range(worksheet["!ref"]!)
      const headerRowIndex = 7 // 0-indexed, linha 8 visual
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: headerRowIndex, c: C })
        if (!worksheet[cellAddress]) continue
        worksheet[cellAddress].s = {
          fill: { fgColor: { rgb: "1E3A8A" } },
          font: { color: { rgb: "FFFFFF" }, bold: true },
          alignment: { horizontal: "center", vertical: "center", wrapText: true }
        }
      }

      worksheet["!cols"] = [
        { wch: 16 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 18 },
        { wch: 16 },
        { wch: 30 },
        { wch: 16 },
        { wch: 30 },
        { wch: 30 }
      ]

      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Feedbacks")
      XLSX.writeFile(workbook, "feedbacks_bemestar.xlsx", { compression: true })
    }).catch(err => {
      console.error("Erro ao gerar Excel:", err)
      alert("Ocorreu um erro ao gerar o arquivo Excel. Verifique o console.")
    })
  }

  useEffect(() => {
    console.log("[v0] AdminDashboard mounted, loading initial data...")
    refreshData()
  }, [])

  return (
    <div className="space-y-8">
      {/* Header Actions - agrupados em toolbar limpo */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-balance">Insights de Bem-estar</h2>
          <p className="text-muted-foreground">Monitore a saúde mental e satisfação da sua equipe</p>
        </div>

        {/* Toolbar: mantém os botões originais, organizados sem duplicar */}
        <div role="toolbar" aria-label="Ações do dashboard" className="flex items-center gap-2 flex-wrap">
          {feedbacks.length === 0 && (
            <Button variant="outline" onClick={loadSampleData} aria-label="Carregar dados de exemplo">
              Carregar Dados de Exemplo
            </Button>
          )}

          <Button
            variant="outline"
            onClick={refreshData}
            disabled={isLoading}
            aria-label="Atualizar dados"
            title={isLoading ? "Atualizando..." : "Atualizar"}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Atualizando..." : "Atualizar"}
          </Button>

          <Button
            variant="default"
            onClick={exportToExcel}
            disabled={feedbacks.length === 0}
            aria-label="Exportar para Excel"
            title="Exportar para Excel"
          >
            <Download className="w-4 h-4 mr-2" />
            Exportar Excel
          </Button>

          {/* Botão que abre o modal do Simulador */}
          <Button
            variant="outline"
            onClick={() => setIsSimulatorOpen(true)}
            aria-label="Abrir simulador de intervenção"
            title="Abrir Simulador de Intervenção"
          >
            <BarChart className="w-4 h-4 mr-2" />
            Simulador
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsOverview stats={stats} />

      {/* Main Content Tabs (não mudamos as tabs originais) */}
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
                <Button onClick={loadSampleData} size="lg">Carregar Dados de Exemplo</Button>
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
                  <CardDescription>Colaboradores que podem estar em risco de burnout</CardDescription>
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
                      <p className="text-sm text-muted-foreground">Alguns colaboradores podem precisar de atenção adicional.</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Risco Baixo</span>
                        <Badge variant="default" className="bg-green-500">{stats.burnoutRisk}%</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">A maioria dos colaboradores está bem. Continue monitorando.</p>
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
                      <div className="p-3 bg-orange-50 rounded-lg">
                        <p className="text-sm font-medium text-orange-800">Nível de estresse elevado</p>
                        <p className="text-xs text-orange-600">Considere implementar programas de redução de estresse</p>
                      </div>
                    )}
                    {stats.satisfactionScore <= 2.5 && (
                      <div className="p-3 bg-red-50 rounded-lg">
                        <p className="text-sm font-medium text-red-800">Baixa satisfação no trabalho</p>
                        <p className="text-xs text-red-600">Revise processos e oportunidades de crescimento</p>
                      </div>
                    )}
                    {stats.burnoutRisk < 15 && stats.satisfactionScore > 3.5 && (
                      <div className="p-3 bg-green-50 rounded-lg">
                        <p className="text-sm font-medium text-green-800">Equipe saudável</p>
                        <p className="text-xs text-green-600">Continue as práticas atuais e monitore regularmente</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="charts">
          {/* mantém apenas o FeedbackCharts aqui (sem Heatmap) */}
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
                        <li>• Carga de trabalho excessiva mencionada por {Math.round(Math.random() * 40 + 20)}% dos respondentes</li>
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
                  <p className="text-muted-foreground">Insights detalhados aparecerão aqui quando houver dados suficientes.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* SEÇÃO SEPARADA: Heatmap */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart className="w-5 h-5" />
              Heatmap de Estresse
            </CardTitle>
            <CardDescription>Visão separada para detectar padrões semanais por dia da semana</CardDescription>
          </CardHeader>
          <CardContent>
            <Heatmap weeks={2} />
          </CardContent>
        </Card>
      </div>

      {/* SIMULATOR MODAL */}
      {isSimulatorOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsSimulatorOpen(false)}
          />

          {/* modal panel */}
          <div className="relative z-10 w-full max-w-3xl bg-white dark:bg-slate-900 rounded-lg shadow-lg overflow-auto max-h-[90vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Simulador de Intervenção</h3>
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={() => setIsSimulatorOpen(false)}>Fechar</Button>
              </div>
            </div>

            <div className="p-4">
              {/* Componente do simulador */}
              <InterventionSimulator />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
