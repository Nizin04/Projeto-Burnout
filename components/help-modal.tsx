"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, Phone, Globe, MessageCircle } from "lucide-react"

export function HelpModal() {
  const [open, setOpen] = useState(false)

  const motivationalQuotes = [
    "Você é mais forte do que imagina. 💪",
    "Cada pequeno passo é uma grande vitória.",
    "Tudo bem não estar bem todos os dias.",
    "Sua saúde mental importa. 💙",
    "Procure ajuda — você não está sozinho(a).",
  ]

  const clinics = [
    {
      name: "CVV - Centro de Valorização da Vida",
      phone: "188",
      site: "https://cvv.org.br/",
      desc: "Atendimento gratuito e confidencial 24h por dia.",
    },
    {
      name: "Clínica Bem-Estar",
      phone: "(24) 3354-9020",
      site: "https://clinicaresende.com.br/",
      desc: "Apoio psicológico e psiquiátrico em Resende-RJ.",
    },
    {
      name: "PsicoSaúde Integrada",
      phone: "(24) 3381-4410",
      site: "https://clinicacorpofala.com.br/",
      desc: "Terapias e atendimentos especializados em saúde mental.",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Botão do modal */}
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className="flex items-center justify-center gap-2 px-5 py-2 font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all rounded-xl shadow-md hover:shadow-blue-500/20"
        >
          💬 Preciso de Ajuda
        </Button>
      </DialogTrigger>

      {/* Conteúdo do modal */}
      <DialogContent
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg w-[90%] bg-background/95 border border-border shadow-2xl rounded-2xl p-6 sm:p-8 text-center z-[9999] backdrop-blur-md"
      >
        {/* Fundo escurecido atrás do modal */}
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm -z-10" />

        <DialogHeader>
          <DialogTitle className="flex items-center justify-center gap-2 text-lg font-bold">
            <Heart className="w-5 h-5 text-pink-500" />
            Apoio à Sua Saúde Mental
          </DialogTitle>
        </DialogHeader>

        {/* Frases motivacionais */}
        <Card className="border-none shadow-none mt-4 bg-transparent">
          <CardHeader>
            <CardTitle className="text-base flex justify-center items-center gap-1 text-green-400">
              🌱 Frases de Motivação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {motivationalQuotes.map((quote, idx) => (
              <p
                key={idx}
                className="text-sm italic text-muted-foreground leading-relaxed"
              >
                “{quote}”
              </p>
            ))}
          </CardContent>
        </Card>

        {/* Clínicas recomendadas */}
        <Card className="border-none shadow-none mt-4 bg-transparent">
          <CardHeader>
            <CardTitle className="text-base flex justify-center items-center gap-1 text-blue-400">
              🏥 Clínicas Recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {clinics.map((c, i) => (
              <div
                key={i}
                className="border border-border/50 p-3 rounded-lg bg-background/70 backdrop-blur-sm transition-all hover:bg-accent/40"
              >
                <h4 className="font-semibold text-sm">{c.name}</h4>
                <p className="text-xs text-muted-foreground mb-2">{c.desc}</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`tel:${c.phone}`, "_blank")}
                  >
                    <Phone className="w-4 h-4 mr-1" /> Ligar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(c.site, "_blank")}
                  >
                    <Globe className="w-4 h-4 mr-1" /> Site
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      window.open(
                        `https://wa.me/${c.phone.replace(/\D/g, "")}`,
                        "_blank"
                      )
                    }
                  >
                    <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-6">
          Se estiver em situação de emergência, procure ajuda médica imediata
          ou entre em contato com os serviços de emergência locais.
        </p>

        {/* Animação de entrada suave */}
        <style jsx global>{`
          [data-state="open"] .fixed.left-1/2 {
            animation: zoomIn 0.25s ease;
          }
          @keyframes zoomIn {
            from {
              opacity: 0;
              transform: scale(0.9) translate(-50%, -50%);
            }
            to {
              opacity: 1;
              transform: scale(1) translate(-50%, -50%);
            }
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
