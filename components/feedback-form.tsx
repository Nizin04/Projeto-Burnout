"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft } from "lucide-react"
import type { User } from "@/lib/auth"
import { saveFeedback } from "@/lib/feedback"
import { HelpModal } from "@/components/help-modal"

interface FeedbackFormProps {
  user: User
}

interface FormData {
  // Stress and Workload
  stressLevel: string
  workloadManageable: string
  workLifeBalance: string

  // Work Environment
  supportFromManager: string
  teamCollaboration: string
  workplaceFlexibility: string

  // Physical and Mental Health
  physicalSymptoms: string[]
  mentalWellbeing: string
  sleepQuality: string

  // Job Satisfaction
  jobSatisfaction: string
  careerDevelopment: string
  recognition: string

  // Open Feedback
  improvements: string
  additionalComments: string
}

const initialFormData: FormData = {
  stressLevel: "",
  workloadManageable: "",
  workLifeBalance: "",
  supportFromManager: "",
  teamCollaboration: "",
  workplaceFlexibility: "",
  physicalSymptoms: [],
  mentalWellbeing: "",
  sleepQuality: "",
  jobSatisfaction: "",
  careerDevelopment: "",
  recognition: "",
  improvements: "",
  additionalComments: "",
}

const sections = [
  {
    id: "stress",
    title: "Estresse e Carga de Trabalho",
    description: "Como você se sente em relação ao seu trabalho atual?",
  },
  {
    id: "environment",
    title: "Ambiente de Trabalho",
    description: "Avalie o suporte e colaboração em sua equipe",
  },
  {
    id: "health",
    title: "Saúde Física e Mental",
    description: "Como o trabalho tem afetado seu bem-estar?",
  },
  {
    id: "satisfaction",
    title: "Satisfação Profissional",
    description: "Sua percepção sobre crescimento e reconhecimento",
  },
  {
    id: "feedback",
    title: "Sugestões e Comentários",
    description: "Compartilhe suas ideias para melhorias",
  },
]

export function FeedbackForm({ user }: FeedbackFormProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const progress = ((currentSection + 1) / sections.length) * 100

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1)
    }
  }

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      saveFeedback(user.id, formData)
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const handlePhysicalSymptomChange = (symptom: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        physicalSymptoms: [...formData.physicalSymptoms, symptom],
      })
    } else {
      setFormData({
        ...formData,
        physicalSymptoms: formData.physicalSymptoms.filter((s) => s !== symptom),
      })
    }
  }

  if (isSubmitted) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Obrigado pelo seu feedback!</CardTitle>
        <CardDescription className="text-base">
          Suas respostas foram registradas com sucesso. Elas nos ajudarão a criar um ambiente de trabalho mais
          saudável e produtivo para todos.
        </CardDescription>
      </CardHeader>

      <CardContent className="text-center space-y-4">
        <p className="text-sm text-muted-foreground mb-2">
          Se você estiver se sentindo sobrecarregado ou inseguro quanto ao seu bem-estar, temos recursos e contatos que podem ajudar.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* Botão voltar */}
          <Button onClick={() => (window.location.href = "/")} size="lg" className="min-w-[180px]">
            Voltar ao Início
          </Button>

          {/* Botão "Preciso de ajuda" que abre o modal (HelpModal já contém contatos e frases) */}
          <HelpModal />
        </div>

        <p className="text-xs text-muted-foreground mt-4">
          Importante: se estiver em situação de emergência, procure os serviços de emergência locais imediatamente.
        </p>
      </CardContent>
    </Card>
  )
}

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Progresso</span>
          <span className="text-sm text-muted-foreground">
            {currentSection + 1} de {sections.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{sections[currentSection].title}</CardTitle>
          <CardDescription>{sections[currentSection].description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Section 1: Stress and Workload */}
          {currentSection === 0 && (
            <>
              <div className="space-y-3">
                <Label className="text-base font-medium">Como você avalia seu nível de estresse no trabalho?</Label>
                <RadioGroup
                  value={formData.stressLevel}
                  onValueChange={(value) => setFormData({ ...formData, stressLevel: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muito-baixo" id="stress-1" />
                    <Label htmlFor="stress-1">Muito baixo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="baixo" id="stress-2" />
                    <Label htmlFor="stress-2">Baixo</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="moderado" id="stress-3" />
                    <Label htmlFor="stress-3">Moderado</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alto" id="stress-4" />
                    <Label htmlFor="stress-4">Alto</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muito-alto" id="stress-5" />
                    <Label htmlFor="stress-5">Muito alto</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Sua carga de trabalho atual é gerenciável?</Label>
                <RadioGroup
                  value={formData.workloadManageable}
                  onValueChange={(value) => setFormData({ ...formData, workloadManageable: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sempre" id="workload-1" />
                    <Label htmlFor="workload-1">Sempre gerenciável</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="geralmente" id="workload-2" />
                    <Label htmlFor="workload-2">Geralmente gerenciável</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="as-vezes" id="workload-3" />
                    <Label htmlFor="workload-3">Às vezes difícil de gerenciar</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dificil" id="workload-4" />
                    <Label htmlFor="workload-4">Frequentemente difícil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="impossivel" id="workload-5" />
                    <Label htmlFor="workload-5">Impossível de gerenciar</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Como está seu equilíbrio entre vida pessoal e profissional?
                </Label>
                <RadioGroup
                  value={formData.workLifeBalance}
                  onValueChange={(value) => setFormData({ ...formData, workLifeBalance: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excelente" id="balance-1" />
                    <Label htmlFor="balance-1">Excelente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bom" id="balance-2" />
                    <Label htmlFor="balance-2">Bom</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="balance-3" />
                    <Label htmlFor="balance-3">Regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ruim" id="balance-4" />
                    <Label htmlFor="balance-4">Ruim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pessimo" id="balance-5" />
                    <Label htmlFor="balance-5">Péssimo</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {/* Section 2: Work Environment */}
          {currentSection === 1 && (
            <>
              <div className="space-y-3">
                <Label className="text-base font-medium">Como você avalia o suporte do seu gestor direto?</Label>
                <RadioGroup
                  value={formData.supportFromManager}
                  onValueChange={(value) => setFormData({ ...formData, supportFromManager: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excelente" id="support-1" />
                    <Label htmlFor="support-1">Excelente suporte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bom" id="support-2" />
                    <Label htmlFor="support-2">Bom suporte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="support-3" />
                    <Label htmlFor="support-3">Suporte regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pouco" id="support-4" />
                    <Label htmlFor="support-4">Pouco suporte</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nenhum" id="support-5" />
                    <Label htmlFor="support-5">Nenhum suporte</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Como é a colaboração com sua equipe?</Label>
                <RadioGroup
                  value={formData.teamCollaboration}
                  onValueChange={(value) => setFormData({ ...formData, teamCollaboration: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excelente" id="team-1" />
                    <Label htmlFor="team-1">Excelente colaboração</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boa" id="team-2" />
                    <Label htmlFor="team-2">Boa colaboração</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="team-3" />
                    <Label htmlFor="team-3">Colaboração regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="dificil" id="team-4" />
                    <Label htmlFor="team-4">Colaboração difícil</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muito-dificil" id="team-5" />
                    <Label htmlFor="team-5">Muito difícil</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Você tem flexibilidade no seu trabalho (horários, local, etc.)?
                </Label>
                <RadioGroup
                  value={formData.workplaceFlexibility}
                  onValueChange={(value) => setFormData({ ...formData, workplaceFlexibility: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muita" id="flex-1" />
                    <Label htmlFor="flex-1">Muita flexibilidade</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boa" id="flex-2" />
                    <Label htmlFor="flex-2">Boa flexibilidade</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="alguma" id="flex-3" />
                    <Label htmlFor="flex-3">Alguma flexibilidade</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pouca" id="flex-4" />
                    <Label htmlFor="flex-4">Pouca flexibilidade</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nenhuma" id="flex-5" />
                    <Label htmlFor="flex-5">Nenhuma flexibilidade</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {/* Section 3: Physical and Mental Health */}
          {currentSection === 2 && (
            <>
              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Você tem experimentado algum destes sintomas físicos relacionados ao trabalho? (Selecione todos que se
                  aplicam)
                </Label>
                <div className="space-y-2">
                  {[
                    "Dores de cabeça frequentes",
                    "Tensão muscular ou dores nas costas",
                    "Problemas digestivos",
                    "Fadiga constante",
                    "Problemas de sono",
                    "Mudanças no apetite",
                    "Nenhum sintoma",
                  ].map((symptom) => (
                    <div key={symptom} className="flex items-center space-x-2">
                      <Checkbox
                        id={symptom}
                        checked={formData.physicalSymptoms.includes(symptom)}
                        onCheckedChange={(checked) => handlePhysicalSymptomChange(symptom, checked as boolean)}
                      />
                      <Label htmlFor={symptom}>{symptom}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Como você avalia seu bem-estar mental atualmente?</Label>
                <RadioGroup
                  value={formData.mentalWellbeing}
                  onValueChange={(value) => setFormData({ ...formData, mentalWellbeing: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excelente" id="mental-1" />
                    <Label htmlFor="mental-1">Excelente</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="bom" id="mental-2" />
                    <Label htmlFor="mental-2">Bom</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="mental-3" />
                    <Label htmlFor="mental-3">Regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ruim" id="mental-4" />
                    <Label htmlFor="mental-4">Ruim</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muito-ruim" id="mental-5" />
                    <Label htmlFor="mental-5">Muito ruim</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Como está a qualidade do seu sono?</Label>
                <RadioGroup
                  value={formData.sleepQuality}
                  onValueChange={(value) => setFormData({ ...formData, sleepQuality: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="excelente" id="sleep-1" />
                    <Label htmlFor="sleep-1">Durmo muito bem</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="boa" id="sleep-2" />
                    <Label htmlFor="sleep-2">Durmo bem</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="regular" id="sleep-3" />
                    <Label htmlFor="sleep-3">Sono regular</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="ruim" id="sleep-4" />
                    <Label htmlFor="sleep-4">Durmo mal</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muito-ruim" id="sleep-5" />
                    <Label htmlFor="sleep-5">Tenho insônia</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {/* Section 4: Job Satisfaction */}
          {currentSection === 3 && (
            <>
              <div className="space-y-3">
                <Label className="text-base font-medium">Qual seu nível de satisfação com seu trabalho atual?</Label>
                <RadioGroup
                  value={formData.jobSatisfaction}
                  onValueChange={(value) => setFormData({ ...formData, jobSatisfaction: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muito-satisfeito" id="satisfaction-1" />
                    <Label htmlFor="satisfaction-1">Muito satisfeito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="satisfeito" id="satisfaction-2" />
                    <Label htmlFor="satisfaction-2">Satisfeito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="neutro" id="satisfaction-3" />
                    <Label htmlFor="satisfaction-3">Neutro</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="insatisfeito" id="satisfaction-4" />
                    <Label htmlFor="satisfaction-4">Insatisfeito</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muito-insatisfeito" id="satisfaction-5" />
                    <Label htmlFor="satisfaction-5">Muito insatisfeito</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">
                  Você sente que tem oportunidades de crescimento e desenvolvimento?
                </Label>
                <RadioGroup
                  value={formData.careerDevelopment}
                  onValueChange={(value) => setFormData({ ...formData, careerDevelopment: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="muitas" id="career-1" />
                    <Label htmlFor="career-1">Muitas oportunidades</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="algumas" id="career-2" />
                    <Label htmlFor="career-2">Algumas oportunidades</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="poucas" id="career-3" />
                    <Label htmlFor="career-3">Poucas oportunidades</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nenhuma" id="career-4" />
                    <Label htmlFor="career-4">Nenhuma oportunidade</Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-3">
                <Label className="text-base font-medium">Você se sente reconhecido pelo seu trabalho?</Label>
                <RadioGroup
                  value={formData.recognition}
                  onValueChange={(value) => setFormData({ ...formData, recognition: value })}
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="sempre" id="recognition-1" />
                    <Label htmlFor="recognition-1">Sempre reconhecido</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="frequentemente" id="recognition-2" />
                    <Label htmlFor="recognition-2">Frequentemente reconhecido</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="as-vezes" id="recognition-3" />
                    <Label htmlFor="recognition-3">Às vezes reconhecido</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="raramente" id="recognition-4" />
                    <Label htmlFor="recognition-4">Raramente reconhecido</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="nunca" id="recognition-5" />
                    <Label htmlFor="recognition-5">Nunca reconhecido</Label>
                  </div>
                </RadioGroup>
              </div>
            </>
          )}

          {/* Section 5: Open Feedback */}
          {currentSection === 4 && (
            <>
              <div className="space-y-3">
                <Label htmlFor="improvements" className="text-base font-medium">
                  Que melhorias você sugere para o ambiente de trabalho?
                </Label>
                <Textarea
                  id="improvements"
                  placeholder="Compartilhe suas ideias e sugestões..."
                  value={formData.improvements}
                  onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
                  rows={4}
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="comments" className="text-base font-medium">
                  Comentários adicionais (opcional)
                </Label>
                <Textarea
                  id="comments"
                  placeholder="Alguma coisa que gostaria de acrescentar?"
                  value={formData.additionalComments}
                  onChange={(e) => setFormData({ ...formData, additionalComments: e.target.value })}
                  rows={4}
                />
              </div>
            </>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6">
            <Button variant="outline" onClick={handlePrevious} disabled={currentSection === 0}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {currentSection === sections.length - 1 ? (
              <Button onClick={handleSubmit} disabled={isSubmitting} size="lg">
                {isSubmitting ? "Enviando..." : "Enviar Feedback"}
              </Button>
            ) : (
              
              <Button onClick={handleNext}>
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
