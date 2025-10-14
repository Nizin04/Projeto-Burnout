"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts"
import type { FeedbackResponse } from "@/lib/feedback"

interface FeedbackChartsProps {
  feedbacks: FeedbackResponse[]
}

export function FeedbackCharts({ feedbacks }: FeedbackChartsProps) {
  if (feedbacks.length === 0) {
    return (
      <div className="grid gap-6 md:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader>
              <CardTitle>Gráfico {i}</CardTitle>
              <CardDescription>Dados aparecerão quando houver respostas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Aguardando dados...
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Process data for charts
  const stressData = [
    {
      name: "Muito Baixo",
      value: feedbacks.filter((f) => f.responses.stressLevel === "muito-baixo").length,
      color: "#22c55e",
    },
    { name: "Baixo", value: feedbacks.filter((f) => f.responses.stressLevel === "baixo").length, color: "#84cc16" },
    {
      name: "Moderado",
      value: feedbacks.filter((f) => f.responses.stressLevel === "moderado").length,
      color: "#eab308",
    },
    { name: "Alto", value: feedbacks.filter((f) => f.responses.stressLevel === "alto").length, color: "#f97316" },
    {
      name: "Muito Alto",
      value: feedbacks.filter((f) => f.responses.stressLevel === "muito-alto").length,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0)

  const satisfactionData = [
    {
      name: "Muito Satisfeito",
      value: feedbacks.filter((f) => f.responses.jobSatisfaction === "muito-satisfeito").length,
      color: "#22c55e",
    },
    {
      name: "Satisfeito",
      value: feedbacks.filter((f) => f.responses.jobSatisfaction === "satisfeito").length,
      color: "#84cc16",
    },
    {
      name: "Neutro",
      value: feedbacks.filter((f) => f.responses.jobSatisfaction === "neutro").length,
      color: "#eab308",
    },
    {
      name: "Insatisfeito",
      value: feedbacks.filter((f) => f.responses.jobSatisfaction === "insatisfeito").length,
      color: "#f97316",
    },
    {
      name: "Muito Insatisfeito",
      value: feedbacks.filter((f) => f.responses.jobSatisfaction === "muito-insatisfeito").length,
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0)

  const workLifeBalanceData = [
    { category: "Excelente", count: feedbacks.filter((f) => f.responses.workLifeBalance === "excelente").length },
    { category: "Bom", count: feedbacks.filter((f) => f.responses.workLifeBalance === "bom").length },
    { category: "Regular", count: feedbacks.filter((f) => f.responses.workLifeBalance === "regular").length },
    { category: "Ruim", count: feedbacks.filter((f) => f.responses.workLifeBalance === "ruim").length },
    { category: "Péssimo", count: feedbacks.filter((f) => f.responses.workLifeBalance === "pessimo").length },
  ].filter((item) => item.count > 0)

  const supportData = [
    { category: "Excelente", count: feedbacks.filter((f) => f.responses.supportFromManager === "excelente").length },
    { category: "Bom", count: feedbacks.filter((f) => f.responses.supportFromManager === "bom").length },
    { category: "Regular", count: feedbacks.filter((f) => f.responses.supportFromManager === "regular").length },
    { category: "Pouco", count: feedbacks.filter((f) => f.responses.supportFromManager === "pouco").length },
    { category: "Nenhum", count: feedbacks.filter((f) => f.responses.supportFromManager === "nenhum").length },
  ].filter((item) => item.count > 0)

  // Physical symptoms analysis
  const allSymptoms = feedbacks.flatMap((f) => f.responses.physicalSymptoms)
  const symptomCounts = allSymptoms.reduce(
    (acc, symptom) => {
      if (symptom !== "Nenhum sintoma") {
        acc[symptom] = (acc[symptom] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )

  const symptomsData = Object.entries(symptomCounts)
    .map(([symptom, count]) => ({ symptom, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6) // Top 6 symptoms

  // Mental wellbeing trend (simulated over time)
  const wellbeingTrendData = [
    { month: "Jan", score: 3.2 },
    { month: "Fev", score: 3.1 },
    { month: "Mar", score: 2.9 },
    { month: "Abr", score: 3.0 },
    { month: "Mai", score: 3.3 },
    { month: "Jun", score: 3.4 },
  ]

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-primary">{`${payload[0].dataKey}: ${payload[0].value}`}</p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      {/* Top Row - Main Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Níveis de Estresse</CardTitle>
            <CardDescription>Como os colaboradores avaliam seu estresse</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stressData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {stressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Satisfação no Trabalho</CardTitle>
            <CardDescription>Nível de satisfação dos colaboradores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={satisfactionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {satisfactionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Row - Work Environment */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Equilíbrio Vida-Trabalho</CardTitle>
            <CardDescription>Avaliação do equilíbrio pessoal-profissional</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workLifeBalanceData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="category" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suporte da Gestão</CardTitle>
            <CardDescription>Avaliação do suporte recebido dos gestores</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supportData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="category" className="text-muted-foreground" tick={{ fontSize: 12 }} />
                <YAxis className="text-muted-foreground" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" fill="hsl(var(--chart-2))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Third Row - Health & Trends */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Sintomas Físicos Mais Comuns</CardTitle>
            <CardDescription>Sintomas relacionados ao trabalho reportados</CardDescription>
          </CardHeader>
          <CardContent>
            {symptomsData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={symptomsData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" className="text-muted-foreground" />
                  <YAxis
                    dataKey="symptom"
                    type="category"
                    className="text-muted-foreground"
                    tick={{ fontSize: 10 }}
                    width={120}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Nenhum sintoma reportado
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tendência de Bem-estar Mental</CardTitle>
            <CardDescription>Evolução do bem-estar ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={wellbeingTrendData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis className="text-muted-foreground" domain={[1, 5]} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--chart-4))"
                  fill="hsl(var(--chart-4))"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Card */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo dos Insights</CardTitle>
          <CardDescription>Principais descobertas baseadas nos dados coletados</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Maior Preocupação</h4>
              <p className="text-sm text-muted-foreground">
                {stressData.length > 0 &&
                  stressData.reduce((prev, current) => (prev.value > current.value ? prev : current)).name}{" "}
                é o nível de estresse mais comum
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Sintoma Físico Principal</h4>
              <p className="text-sm text-muted-foreground">
                {symptomsData.length > 0 ? symptomsData[0].symptom : "Nenhum sintoma reportado"}
              </p>
            </div>

            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium text-sm mb-2">Satisfação Geral</h4>
              <p className="text-sm text-muted-foreground">
                {satisfactionData.length > 0 &&
                  satisfactionData.reduce((prev, current) => (prev.value > current.value ? prev : current)).name}{" "}
                é o nível mais comum
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
