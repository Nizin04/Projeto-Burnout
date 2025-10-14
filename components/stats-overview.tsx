import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, AlertTriangle, Heart } from "lucide-react"

interface StatsOverviewProps {
  stats: {
    totalResponses: number
    averageStress: number
    burnoutRisk: number
    satisfactionScore: number
  }
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const getStressColor = (level: number) => {
    if (level >= 4) return "text-red-500"
    if (level >= 3) return "text-orange-500"
    return "text-green-500"
  }

  const getRiskColor = (risk: number) => {
    if (risk >= 30) return "destructive"
    if (risk >= 15) return "secondary"
    return "default"
  }

  const getSatisfactionColor = (score: number) => {
    if (score >= 4) return "text-green-500"
    if (score >= 3) return "text-orange-500"
    return "text-red-500"
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Respostas</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalResponses}</div>
          <p className="text-xs text-muted-foreground">Colaboradores participaram</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nível de Estresse</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getStressColor(stats.averageStress)}`}>{stats.averageStress}/5</div>
          <p className="text-xs text-muted-foreground">Média geral da equipe</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Risco de Burnout</CardTitle>
          <AlertTriangle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <div className="text-2xl font-bold">{stats.burnoutRisk}%</div>
            <Badge variant={getRiskColor(stats.burnoutRisk)} className="text-xs">
              {stats.burnoutRisk >= 30 ? "Alto" : stats.burnoutRisk >= 15 ? "Médio" : "Baixo"}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">Colaboradores em risco</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Satisfação</CardTitle>
          <Heart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getSatisfactionColor(stats.satisfactionScore)}`}>
            {stats.satisfactionScore}/5
          </div>
          <p className="text-xs text-muted-foreground">Satisfação no trabalho</p>
        </CardContent>
      </Card>
    </div>
  )
}
