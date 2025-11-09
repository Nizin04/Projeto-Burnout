"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAllFeedbacks } from "@/lib/feedback"
import { FeedbackForm } from "@/components/feedback-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Heart, ClipboardList } from "lucide-react"

export default function FeedbackPage() {
  const [user, setUser] = useState(getCurrentUser())
  const [viewMode, setViewMode] = useState<"view" | "form">("view")
  const [userFeedbacks, setUserFeedbacks] = useState<any[]>([])
  const router = useRouter()

  // 🔹 Verifica login e tipo de usuário
  useEffect(() => {
    const currentUser = getCurrentUser()
    console.log("[v0] Current user in feedback page:", currentUser)

    if (!currentUser || currentUser.type !== "employee") {
      router.push("/")
      return
    }
    setUser(currentUser)
  }, [router])

  // 🔹 Carrega feedbacks do usuário
  useEffect(() => {
    if (!user) return
    const all = getAllFeedbacks()
    const mine = all.filter((f) => f.userId === user.id)
    setUserFeedbacks(mine)
  }, [user])

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

  // 🔹 Função auxiliar para avaliar risco de burnout
  function getBurnoutLevel(feedback: any) {
    const stress = feedback.responses.stressLevel
    const workLife = feedback.responses.workLifeBalance
    const jobSat = feedback.responses.jobSatisfaction

    if (["muito-alto", "alto"].includes(stress) && ["ruim", "pessimo"].includes(workLife))
      return { text: "Alto risco de burnout 😟", color: "bg-red-100 text-red-700" }

    if (["moderado"].includes(stress) || ["neutro"].includes(jobSat))
      return { text: "Atenção: equilíbrio necessário ⚠️", color: "bg-yellow-100 text-yellow-800" }

    return { text: "Boa saúde emocional 😊", color: "bg-green-100 text-green-700" }
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

        {/* Troca entre modo visualização e formulário */}
        <div className="flex justify-center gap-3 mb-6">
          <Button
            variant={viewMode === "view" ? "default" : "outline"}
            onClick={() => setViewMode("view")}
          >
            <ClipboardList className="w-4 h-4 mr-2" />
            Meus Feedbacks
          </Button>
          <Button
            variant={viewMode === "form" ? "default" : "outline"}
            onClick={() => setViewMode("form")}
          >
            <Heart className="w-4 h-4 mr-2" />
            Novo Feedback
          </Button>
        </div>

        {viewMode === "view" ? (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Seus Feedbacks</CardTitle>
                <CardDescription>Veja como está seu bem-estar ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                {userFeedbacks.length === 0 ? (
                  <p className="text-muted-foreground text-center py-6">
                    Você ainda não enviou nenhum feedback.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userFeedbacks
                      .sort((a, b) => b.submittedAt - a.submittedAt)
                      .map((f) => {
                        const level = getBurnoutLevel(f)
                        return (
                          <Card key={f.id} className="p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-muted-foreground">
                                {new Date(f.submittedAt).toLocaleDateString("pt-BR")}
                              </span>
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${level.color}`}>
                                {level.text}
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              <strong>Estresse:</strong> {f.responses.stressLevel} |{" "}
                              <strong>Equilíbrio:</strong> {f.responses.workLifeBalance} |{" "}
                              <strong>Satisfação:</strong> {f.responses.jobSatisfaction}
                            </p>
                            {f.responses.additionalComments && (
                              <p className="mt-2 italic text-sm text-muted-foreground">
                                “{f.responses.additionalComments}”
                              </p>
                            )}
                          </Card>
                        )
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        ) : (
          <>
            {/* Welcome Card */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">Sua opinião é importante</CardTitle>
                <CardDescription className="text-base">
                  Este questionário nos ajuda a entender melhor o ambiente de trabalho e identificar oportunidades de
                  melhoria. Suas respostas são confidenciais.
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
          </>
        )}
      </div>
    </div>
  )
}
