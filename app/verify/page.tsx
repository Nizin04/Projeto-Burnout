"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { verifyEmployeeToken, setCurrentUser } from "@/lib/auth"

export default function VerifyPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setMessage("Token de verificação não encontrado")
      return
    }

    console.log("[v0] Verifying token:", token)

    // Simulate verification process
    setTimeout(() => {
      const user = verifyEmployeeToken(token)
      if (user) {
        console.log("[v0] User verified successfully:", user.name)
        setCurrentUser(user)
        setStatus("success")
        setMessage(`Bem-vindo(a), ${user.name}! Sua identidade foi verificada com sucesso.`)
      } else {
        console.log("[v0] Token verification failed")
        setStatus("error")
        setMessage("Token inválido ou expirado. Solicite um novo link de verificação.")
      }
    }, 2000)
  }, [token])

  const handleContinue = () => {
    if (status === "success") {
      console.log("[v0] Redirecting to feedback page")
      router.push("/feedback")
    } else {
      console.log("[v0] Redirecting to home page")
      router.push("/")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
            {status === "loading" && (
              <div className="bg-primary/10 w-full h-full rounded-full flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="bg-green-500/10 w-full h-full rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            )}
            {status === "error" && (
              <div className="bg-destructive/10 w-full h-full rounded-full flex items-center justify-center">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
            )}
          </div>
          <CardTitle>
            {status === "loading" && "Verificando..."}
            {status === "success" && "Verificação Concluída!"}
            {status === "error" && "Erro na Verificação"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Aguarde enquanto verificamos sua identidade"}
            {status === "success" && "Você pode prosseguir para o formulário de feedback"}
            {status === "error" && "Não foi possível verificar sua identidade"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-sm text-muted-foreground">{message}</p>
          {status !== "loading" && (
            <Button onClick={handleContinue} className="w-full" size="lg">
              {status === "success" ? "Continuar para Feedback" : "Voltar ao Início"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
