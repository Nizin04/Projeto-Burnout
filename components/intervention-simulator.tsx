"use client"
import React, { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getFeedbackStats } from "@/lib/feedback"

type InterventionOption = {
  id: string
  title: string
  weeklyStressReduction: number
  weeklyRiskReduction: number
  description?: string
}

const OPTIONS: InterventionOption[] = [
  { id: "workshop", title: "Workshop 30min semanal", weeklyStressReduction: 0.2, weeklyRiskReduction: 0.8 },
  { id: "micro-pauses", title: "Pausas 15min diárias", weeklyStressReduction: 0.15, weeklyRiskReduction: 0.5 },
  { id: "coaching", title: "Coaching 1:1 (10% do time)", weeklyStressReduction: 0.25, weeklyRiskReduction: 1.2 },
]

export function InterventionSimulator() {
  const stats = getFeedbackStats()
  const [selectedId, setSelectedId] = useState<string>(OPTIONS[0].id)
  const [weeks, setWeeks] = useState<number>(4)
  const [intensity, setIntensity] = useState<number>(1) // 0.5, 1, 1.5

  const option = OPTIONS.find(o => o.id === selectedId)!

  const simulate = () => {
    const baseStress = typeof stats?.averageStress === "number" ? stats.averageStress : 3
    const baseRisk = typeof stats?.burnoutRisk === "number" ? stats.burnoutRisk : 20

    const totalStressReduction = option.weeklyStressReduction * intensity * weeks
    const totalRiskReduction = option.weeklyRiskReduction * intensity * weeks

    const newStress = Math.max(0, baseStress - totalStressReduction)
    const newRisk = Math.max(0, baseRisk - totalRiskReduction)

    return {
      baseStress, baseRisk, newStress, newRisk,
      stressDelta: baseStress - newStress,
      riskDeltaPercent: baseRisk > 0 ? ((baseRisk - newRisk) / baseRisk) * 100 : 0
    }
  }

  const result = simulate()

  return (
    <div className="space-y-4 text-slate-900 dark:text-slate-100">
      {/* header card */}
      <Card className="bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-base">Simulador de Intervenção</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Teste cenários rápidos para estimar o impacto de ações no estresse médio e risco de burnout.
          </p>
        </CardContent>
      </Card>

      {/* options */}
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map(o => (
          <button
            key={o.id}
            onClick={() => setSelectedId(o.id)}
            className={`px-3 py-1.5 rounded-full border text-sm
              ${o.id === selectedId
                ? "bg-slate-900 text-white dark:bg-slate-200 dark:text-slate-900 border-transparent"
                : "bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-600"
              }`}
          >
            {o.title}
          </button>
        ))}
      </div>

      {/* controls card */}
      <div className="bg-slate-50 dark:bg-slate-850/90 dark:bg-[color:var(--slate-800)] border border-slate-200 dark:border-slate-700 p-4 rounded-lg">
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm w-auto">Duração (semanas)</label>
          <input
            type="number"
            value={weeks}
            onChange={e => setWeeks(Math.max(1, Number(e.target.value || 1)))}
            min={1}
            max={52}
            className="w-20 p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          />

          <label className="text-sm">Intensidade</label>
          <select
            value={String(intensity)}
            onChange={e => setIntensity(Number(e.target.value))}
            className="p-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
          >
            <option value={0.5}>Baixa (0.5x)</option>
            <option value={1}>Média (1x)</option>
            <option value={1.5}>Alta (1.5x)</option>
          </select>
        </div>

        <div className="mt-4 text-sm text-slate-700 dark:text-slate-300">
          Métrica atual — Estresse médio: <strong className="text-slate-900 dark:text-slate-100">{result.baseStress.toFixed(2)}</strong> • Risco de burnout: <strong className="text-slate-900 dark:text-slate-100">{Math.round(result.baseRisk)}%</strong>
        </div>

        <div className="mt-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-3 rounded text-slate-900 dark:text-slate-100">
          <div className="text-sm text-slate-600 dark:text-slate-300">Metria projetada após {weeks} semana(s) com <strong>{option.title}</strong>:</div>
          <ul className="mt-2 text-sm">
            <li>Estresse médio projetado: <strong>{result.newStress.toFixed(2)}</strong> (↓ {result.stressDelta.toFixed(2)})</li>
            <li>Risco de burnout projetado: <strong>{Math.round(result.newRisk)}%</strong> (redução aproximada {Math.round(result.riskDeltaPercent)}%)</li>
          </ul>
        </div>

        {/* Removed "Salvar cenário" and "Gerar recomendação" buttons as requested */}
      </div>
    </div>
  )
}

export default InterventionSimulator
