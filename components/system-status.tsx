"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { CheckCircle, AlertCircle, RefreshCw } from "lucide-react"

export default function SystemStatus() {
  const [lastSync, setLastSync] = useState<string>("—")
  const [status, setStatus] = useState<"ok" | "warning" | "error">("ok")

  useEffect(() => {
    // Simula um check do sistema
    const timeout = setTimeout(() => {
      const now = new Date().toLocaleTimeString("pt-BR")
      setLastSync(now)

      // status fake (pode mudar a cada refresh)
      const rnd = Math.random()
      if (rnd > 0.9) setStatus("error")
      else if (rnd > 0.7) setStatus("warning")
      else setStatus("ok")
    }, 600)

    return () => clearTimeout(timeout)
  }, [])

  const icon = {
    ok: <CheckCircle className="w-4 h-4 text-green-500" />,
    warning: <AlertCircle className="w-4 h-4 text-yellow-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
  }[status]

  const label = {
    ok: "Operacional",
    warning: "Atenção",
    error: "Instável",
  }[status]

  return (
    <Card className="p-4 flex items-center justify-between bg-card border border-border shadow-sm">
      <div className="flex flex-col">
        <span className="text-sm font-medium">Status do Sistema</span>
        <span className="text-xs text-muted-foreground">Última verificação: {lastSync}</span>
      </div>

      <div className="flex items-center gap-2">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
    </Card>
  )
}
