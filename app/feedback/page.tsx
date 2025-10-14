"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { FeedbackForm } from "@/components/feedback-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart } from "lucide-react"

export default function FeedbackPage() {
  const [user, setUser] = useState(getCurrentUser())
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()
    console.log("[v0] Current user in feedback page:", currentUser)

    if (!currentUser || currentUser.type !== "employee") {
      console.log("[v0] User not authorized for feedback page, redirecting to home")
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Pesquisa de Bem-estar</h1>
              <p className="text-sm text-muted-foreground">Olá, {user.name}</p>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">Sua opinião é importante</CardTitle>
            <CardDescription className="text-base">
              Este questionário nos ajuda a entender melhor o ambiente de trabalho e identificar oportunidades de
              melhoria. Suas respostas são confidenciais e serão usadas apenas para análises agregadas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Tempo estimado: 5-7 minutos</span>
            </div>
          </CardContent>
        </Card>

        {/* Feedback Form */}
        <FeedbackForm user={user} />
      </div>
    </div>
  )
}
