"use client"

import React, { useMemo, useState } from "react"
import { getAllFeedbacks } from "@/lib/feedback"

const DAYS = ["Seg", "Ter", "Qua", "Qui", "Sex", "Sab", "Dom"]

function mapStressToNumber(val: any) {
  if (typeof val === "number") return val
  if (!val) return NaN
  const v = String(val).toLowerCase()
  const map: Record<string, number> = {
    "muito-baixo": 1,
    "baixo": 2,
    "moderado": 3,
    "alto": 4,
    "muito-alto": 5,
    "1": 1, "2": 2, "3": 3, "4": 4, "5": 5
  }
  return map[v] ?? Number(v) ?? NaN
}

function colorForValue(v: number | null) {
  if (v === null || Number.isNaN(v)) return "bg-transparent border border-slate-200/30"
  if (v <= 1.8) return "bg-emerald-500/90"
  if (v <= 2.6) return "bg-lime-400/90"
  if (v <= 3.4) return "bg-amber-400/90"
  if (v <= 4.2) return "bg-orange-500/90"
  return "bg-red-600/90"
}

export default function Heatmap({ weeks = 8, showEmptyRows = false }: { weeks?: number, showEmptyRows?: boolean }) {
  const all = useMemo(() => getAllFeedbacks() || [], [])
  const [hover, setHover] = useState<{ r: number; c: number; value: number | null } | null>(null)

  const { weekStarts, matrixVals } = useMemo(() => {
    const now = new Date()

    const getMonday = (d: Date) => {
      const dd = new Date(d)
      const day = dd.getDay() || 7 // sunday -> 7
      dd.setDate(dd.getDate() - (day - 1))
      dd.setHours(0, 0, 0, 0)
      return dd
    }

    const monday = getMonday(now)
    // build a larger list (safety) then we'll filter down
    const candidateWeeks: Date[] = []
    const scan = Math.max(weeks * 3, weeks + 6) // scan more in case there are many empty weeks historically
    for (let i = 0; i < scan; i++) {
      const d = new Date(monday)
      d.setDate(monday.getDate() - i * 7)
      candidateWeeks.push(d)
    }

    const vals = candidateWeeks.map(ws => {
      const row: (number | null)[] = []
      for (let dow = 0; dow < 7; dow++) {
        const dayStart = new Date(ws)
        dayStart.setDate(ws.getDate() + dow)
        dayStart.setHours(0, 0, 0, 0)
        const dayEnd = new Date(dayStart)
        dayEnd.setHours(23, 59, 59, 999)

        const items = all.filter(f => {
          const t = f?.submittedAt ? new Date(f.submittedAt).getTime() : NaN
          if (Number.isNaN(t)) return false
          return t >= dayStart.getTime() && t <= dayEnd.getTime()
        })
        const nums = items.map(it => mapStressToNumber(it?.responses?.stressLevel)).filter(n => !Number.isNaN(n))
        if (nums.length === 0) row.push(null)
        else {
          const avg = nums.reduce((s, x) => s + x, 0) / nums.length
          row.push(avg)
        }
      }
      return row
    })

    // If showEmptyRows true, just take the top `weeks` rows (most recent)
    if (showEmptyRows) {
      return {
        weekStarts: candidateWeeks.slice(0, weeks),
        matrixVals: vals.slice(0, weeks)
      }
    }

    // Otherwise filter out trailing empty rows and pick the last `weeks` non-empty ones
    const nonEmptyIndices: number[] = []
    for (let i = 0; i < vals.length; i++) {
      const row = vals[i]
      const hasData = row.some(v => v !== null && !Number.isNaN(v))
      if (hasData) nonEmptyIndices.push(i)
    }

    // if no non-empty found, just return the most recent `weeks`
    if (nonEmptyIndices.length === 0) {
      return {
        weekStarts: candidateWeeks.slice(0, weeks),
        matrixVals: vals.slice(0, weeks)
      }
    }

    // take the last `weeks` indices from nonEmptyIndices
    const take = nonEmptyIndices.slice(0).slice(0, weeks) // already in descending order
    const pickedIndices = nonEmptyIndices.slice(0, weeks)
    // ensure we pick most recent non-empty weeks
    const selected = nonEmptyIndices.slice(0, weeks)

    // build final arrays in same order (most recent first)
    const finalWeekStarts: Date[] = selected.map(i => candidateWeeks[i])
    const finalVals: (number | null)[][] = selected.map(i => vals[i])

    return { weekStarts: finalWeekStarts, matrixVals: finalVals }
  }, [all, weeks, showEmptyRows])

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Heatmap de Estresse (últimas {weeks} semanas)</h3>
          <p className="text-sm text-muted-foreground">Média de nível de estresse por dia da semana. Verde = baixo, vermelho = alto.</p>
        </div>

        <div className="flex items-center gap-3">
  <div className="flex items-center gap-1 text-xs text-muted-foreground">
    <span className="w-4 h-4 rounded-sm bg-emerald-500" /> Baixo
  </div>
  <div className="flex items-center gap-1 text-xs text-muted-foreground">
    <span className="w-4 h-4 rounded-sm bg-red-600" /> Alto
  </div>
  {/* link removido */}
</div>

      </div>

      <div className="overflow-x-auto">
        <div className="inline-block min-w-[560px]">
          <div className="grid grid-cols-7 gap-2 mb-2 text-xs text-muted-foreground">
            {DAYS.map(d => <div key={d} className="text-center">{d}</div>)}
          </div>

          <div className="space-y-2">
            {matrixVals.length === 0 && (
              <div className="text-sm text-muted-foreground">Sem dados disponíveis nas últimas semanas.</div>
            )}
            {matrixVals.map((row, rIdx) => {
              const ws = weekStarts[rIdx]
              const label = ws ? `${ws.getDate().toString().padStart(2, "0")}/${(ws.getMonth()+1).toString().padStart(2,"0")}` : ""
              return (
                <div key={rIdx} className="flex items-center gap-3">
                  <div className="w-16 text-xs text-muted-foreground">{label}</div>
                  <div className="flex gap-2 flex-1">
                    {row.map((v, cIdx) => {
                      const cls = colorForValue(v ?? null)
                      const title = v === null ? "Sem dados" : `Média: ${v.toFixed(2)}`
                      return (
                        <div
                          key={cIdx}
                          title={title}
                          onMouseEnter={() => setHover({ r: rIdx, c: cIdx, value: v })}
                          onMouseLeave={() => setHover(null)}
                          className={`w-12 h-8 rounded-md border border-transparent flex items-center justify-center text-xs ${cls} text-white`}
                          style={{ minWidth: 48 }}
                        >
                          {v === null ? "—" : Math.round(v*10)/10}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {hover && (
        <div className="mt-2 text-sm text-muted-foreground">
          <strong>Semana:</strong> {weekStarts[hover.r].toLocaleDateString("pt-BR")} • <strong>{DAYS[hover.c]}</strong> — {hover.value === null ? "Sem dados" : `Média ${hover.value.toFixed(2)}`}
        </div>
      )}
    </div>
  )
}
