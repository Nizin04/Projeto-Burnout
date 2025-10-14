"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Shield, ArrowRight, Mail, User, AlertCircle } from "lucide-react"
import { createEmployeeUser, createEmployeeSession, verifyAdminCode, setCurrentUser, isValidEmail } from "@/lib/auth"

export function LoginSelection() {
  const [selectedType, setSelectedType] = useState<"employee" | "admin" | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    adminCode: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleEmployeeLogin = async () => {
    setError("")

    if (!formData.name.trim()) {
      setError("Por favor, digite seu nome completo")
      return
    }

    if (!formData.email.trim()) {
      setError("Por favor, digite seu email")
      return
    }

    if (!isValidEmail(formData.email)) {
      setError("Por favor, digite um email válido")
      return
    }

    setIsLoading(true)

    try {
      // Create user and session
      const user = createEmployeeUser(formData.name, formData.email)

      if (!user) {
        setError("Erro ao criar usuário. Tente novamente.")
        setIsLoading(false)
        return
      }

      const session = createEmployeeSession(user)

      setTimeout(() => {
        setIsLoading(false)
        console.log("[v0] Redirecting to verify page with token:", session.verificationToken)
        window.location.href = `/verify?token=${session.verificationToken}`
      }, 1500)
    } catch (err) {
      setError("Erro interno. Tente novamente.")
      setIsLoading(false)
    }
  }

  const handleAdminLogin = () => {
    setError("")

    if (!formData.adminCode.trim()) {
      setError("Por favor, digite o código administrativo")
      return
    }

    if (verifyAdminCode(formData.adminCode)) {
      const adminUser = {
        id: "admin",
        name: "Administrador",
        email: "admin@empresa.com",
        type: "admin" as const,
      }
      setCurrentUser(adminUser)
      window.location.href = "/admin"
    } else {
      setError("Código administrativo inválido. Tente: admin123")
    }
  }

  if (!selectedType) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <Card
            className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50"
            onClick={() => setSelectedType("employee")}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-500" />
              </div>
              <CardTitle className="text-2xl">Colaborador</CardTitle>
              <CardDescription className="text-base">
                Compartilhe seu feedback sobre bem-estar no trabalho
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Login simples com nome e email. Suas respostas são confidenciais e ajudam a melhorar o ambiente de
                trabalho.
              </p>
              <Button className="w-full" size="lg">
                Acessar como Colaborador
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          <Card
            className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg border-2 hover:border-primary/50"
            onClick={() => setSelectedType("admin")}
          >
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Administrador</CardTitle>
              <CardDescription className="text-base">Acesse insights e relatórios detalhados</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-sm text-muted-foreground mb-4">
                Dashboard completo com gráficos, análises e insights sobre o bem-estar da equipe.
              </p>
              <Button variant="outline" className="w-full bg-transparent" size="lg">
                Acessar Painel Admin
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {selectedType === "employee" ? (
              <Users className="w-6 h-6 text-primary" />
            ) : (
              <Shield className="w-6 h-6 text-primary" />
            )}
          </div>
          <CardTitle>{selectedType === "employee" ? "Login Colaborador" : "Login Administrador"}</CardTitle>
          <CardDescription>
            {selectedType === "employee"
              ? "Digite seus dados para acessar o formulário de feedback"
              : "Digite o código administrativo para acessar o dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-destructive bg-destructive/10 rounded-md">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          {selectedType === "employee" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    placeholder="Seu nome completo"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value })
                      setError("")
                    }}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email corporativo</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@empresa.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value })
                      setError("")
                    }}
                    className="pl-10"
                    disabled={isLoading}
                  />
                </div>
              </div>
              <Button
                onClick={handleEmployeeLogin}
                className="w-full"
                size="lg"
                disabled={!formData.name.trim() || !formData.email.trim() || isLoading}
              >
                {isLoading ? "Processando..." : "Enviar Link de Verificação"}
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="adminCode">Código Administrativo</Label>
                <Input
                  id="adminCode"
                  type="password"
                  placeholder="Digite o código admin"
                  value={formData.adminCode}
                  onChange={(e) => {
                    setFormData({ ...formData, adminCode: e.target.value })
                    setError("")
                  }}
                />
              </div>
              <Button onClick={handleAdminLogin} className="w-full" size="lg" disabled={!formData.adminCode.trim()}>
                Acessar Dashboard
              </Button>
            </>
          )}

          <Button
            variant="ghost"
            onClick={() => {
              setSelectedType(null)
              setError("")
              setFormData({ name: "", email: "", adminCode: "" })
            }}
            className="w-full"
          >
            Voltar
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
