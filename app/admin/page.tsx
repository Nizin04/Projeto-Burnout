"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser, logout } from "@/lib/auth"
import { AdminDashboard } from "@/components/admin-dashboard"
import { Button } from "@/components/ui/button"
import { LogOut, Shield } from "lucide-react"

export default function AdminPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [loading, setLoading] = useState(!user) // true se não tiver user
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    console.log("[v0] Current user in admin page:", currentUser)

    if (!currentUser || currentUser.type !== "admin") {
      console.log("[v0] User not authorized for admin page, redirecting to home")
      router.push("/")
      return
    }

    setUser(currentUser)
    setLoading(false)
  }, [router])

  const handleLogout = async () => {
    setLoading(true)   // mostra carregamento
    await logout()     // limpa sessão/token
    setUser(null)
    router.push("/")   // redireciona
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {user ? "Carregando dashboard..." : "Saindo..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
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
                <LogOut className="w-4 h-4 mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-8">
        <AdminDashboard />
      </main>
    </div>
  )
}
