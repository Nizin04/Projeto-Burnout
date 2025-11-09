"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"
import AdminUsers from "@/components/admin-users"
import {AdminExportPDF} from "@/components/admin-export-pdf"
import { Button } from "@/components/ui/button"
import { LogOut, Shield } from "lucide-react"

export default function AdminPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [loading, setLoading] = useState(!user)
  const [activeTab, setActiveTab] = useState<"dashboard" | "users" | "reports">("dashboard")
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    if (!currentUser || currentUser.type !== "admin") {
      router.push("/")
      return
    }
    setUser(currentUser)
    setLoading(false)
  }, [router])

  const handleLogout = async () => {
    setLoading(true)
    await logout()
    setUser(null)
    router.push("/")
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">{user ? "Carregando dashboard..." : "Saindo..."}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Dashboard Administrativo</h1>
              <p className="text-sm text-muted-foreground">BurnoutCare - Monitoramento de Bem-estar</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Olá, {user.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" /> Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex gap-4 mb-8">
          <Button variant={activeTab === "dashboard" ? "default" : "outline"} onClick={() => setActiveTab("dashboard")}>Painel</Button>
          <Button variant={activeTab === "users" ? "default" : "outline"} onClick={() => setActiveTab("users")}>Usuários</Button>
          <Button variant={activeTab === "reports" ? "default" : "outline"} onClick={() => setActiveTab("reports")}>Relatórios (PDF)</Button>
        </div>

        {activeTab === "dashboard" && <section><AdminDashboard /></section>}
        {activeTab === "users" && <section><AdminUsers /></section>}
        {activeTab === "reports" && <section><AdminExportPDF /></section>}
      </main>
    </div>
  )
}
