// Feedback data management
export interface FeedbackResponse {
  id: string
  userId: string
  submittedAt: Date
  responses: {
    stressLevel: string
    workloadManageable: string
    workLifeBalance: string
    supportFromManager: string
    teamCollaboration: string
    workplaceFlexibility: string
    physicalSymptoms: string[]
    mentalWellbeing: string
    sleepQuality: string
    jobSatisfaction: string
    careerDevelopment: string
    recognition: string
    improvements: string
    additionalComments: string
  }
}

// Mock database for demo purposes
const STORAGE_KEY = "burnout-feedbacks"

// Load feedbacks from localStorage
function loadFeedbacksFromStorage(): FeedbackResponse[] {
  if (typeof window === "undefined") return []

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      // Convert date strings back to Date objects
      return parsed.map((feedback: any) => ({
        ...feedback,
        submittedAt: new Date(feedback.submittedAt),
      }))
    }
  } catch (error) {
    console.error("Error loading feedbacks from storage:", error)
  }
  return []
}

// Save feedbacks to localStorage
function saveFeedbacksToStorage(feedbacks: FeedbackResponse[]) {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks))
  } catch (error) {
    console.error("Error saving feedbacks to storage:", error)
  }
}

// Initialize with stored data
let mockFeedbacks: FeedbackResponse[] = loadFeedbacksFromStorage()

export function saveFeedback(userId: string, responses: any): FeedbackResponse {
  const feedback: FeedbackResponse = {
    id: Math.random().toString(36).substring(2, 15),
    userId,
    submittedAt: new Date(),
    responses,
  }

  mockFeedbacks.push(feedback)
  saveFeedbacksToStorage(mockFeedbacks)

  console.log("[v0] Feedback saved:", feedback)
  console.log("[v0] Total feedbacks:", mockFeedbacks.length)

  return feedback
}

export function getAllFeedbacks(): FeedbackResponse[] {
  mockFeedbacks = loadFeedbacksFromStorage()
  return mockFeedbacks
}

export function getFeedbackStats() {
  const feedbacks = getAllFeedbacks()

  if (feedbacks.length === 0) {
    return {
      totalResponses: 0,
      averageStress: 0,
      burnoutRisk: 0,
      satisfactionScore: 0,
    }
  }

  // Calculate stress levels (1-5 scale)
  const stressMapping = {
    "muito-baixo": 1,
    baixo: 2,
    moderado: 3,
    alto: 4,
    "muito-alto": 5,
  }

  const satisfactionMapping = {
    "muito-satisfeito": 5,
    satisfeito: 4,
    neutro: 3,
    insatisfeito: 2,
    "muito-insatisfeito": 1,
  }

  const stressLevels = feedbacks.map(
    (f) => stressMapping[f.responses.stressLevel as keyof typeof stressMapping] || 3
  )
  const satisfactionLevels = feedbacks.map(
    (f) =>
      satisfactionMapping[f.responses.jobSatisfaction as keyof typeof satisfactionMapping] ||
      3
  )

  const averageStress =
    stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length
  const averageSatisfaction =
    satisfactionLevels.reduce((a, b) => a + b, 0) / satisfactionLevels.length

  // Calculate burnout risk based on multiple factors
  const burnoutRisk = feedbacks.filter((f) => {
    const highStress =
      (stressMapping[f.responses.stressLevel as keyof typeof stressMapping] ||
        3) >= 4
    const lowSatisfaction =
      (satisfactionMapping[
        f.responses.jobSatisfaction as keyof typeof satisfactionMapping
      ] || 3) <= 2
    const poorWorkLife = ["ruim", "pessimo"].includes(
      f.responses.workLifeBalance
    )

    return highStress && (lowSatisfaction || poorWorkLife)
  }).length

  return {
    totalResponses: feedbacks.length,
    averageStress: Math.round(averageStress * 10) / 10,
    burnoutRisk: Math.round((burnoutRisk / feedbacks.length) * 100),
    satisfactionScore: Math.round(averageSatisfaction * 10) / 10,
  }
}

// ✅ NOVO TRECHO — Exportar feedbacks para CSV
export function exportFeedbacksToCSV(): string {
  const feedbacks = getAllFeedbacks()
  if (!feedbacks || feedbacks.length === 0) return ""

  const headers = [
    "id",
    "userId",
    "submittedAt",
    "stressLevel",
    "workloadManageable",
    "workLifeBalance",
    "supportFromManager",
    "teamCollaboration",
    "workplaceFlexibility",
    "physicalSymptoms",
    "mentalWellbeing",
    "sleepQuality",
    "jobSatisfaction",
    "careerDevelopment",
    "recognition",
    "improvements",
    "additionalComments",
  ]

  const escapeCell = (v: any) => {
    if (v === null || v === undefined) return ""
    const s = String(v)
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`
    return s
  }

  const rows = feedbacks.map((f) => {
    const r = f.responses || {}
    const physical = Array.isArray(r.physicalSymptoms)
      ? r.physicalSymptoms.join(" | ")
      : r.physicalSymptoms || ""

    const cells = [
      f.id ?? "",
      f.userId ?? "",
      f.submittedAt ? new Date(f.submittedAt).toISOString() : "",
      r.stressLevel ?? "",
      r.workloadManageable ?? "",
      r.workLifeBalance ?? "",
      r.supportFromManager ?? "",
      r.teamCollaboration ?? "",
      r.workplaceFlexibility ?? "",
      physical,
      r.mentalWellbeing ?? "",
      r.sleepQuality ?? "",
      r.jobSatisfaction ?? "",
      r.careerDevelopment ?? "",
      r.recognition ?? "",
      r.improvements ?? "",
      r.additionalComments ?? "",
    ]
    return cells.map(escapeCell).join(",")
  })

  return `${headers.join(",")}\n${rows.join("\n")}`
}

// Generate sample data for demo
export function generateSampleData() {
  // Clear existing data first
  mockFeedbacks = []

  const sampleResponses = [
    {
      stressLevel: "alto",
      workloadManageable: "dificil",
      workLifeBalance: "ruim",
      supportFromManager: "regular",
      teamCollaboration: "boa",
      workplaceFlexibility: "pouca",
      physicalSymptoms: ["Dores de cabeça frequentes", "Fadiga constante"],
      mentalWellbeing: "regular",
      sleepQuality: "ruim",
      jobSatisfaction: "insatisfeito",
      careerDevelopment: "poucas",
      recognition: "raramente",
      improvements:
        "Melhor distribuição de tarefas e mais flexibilidade de horários",
      additionalComments:
        "O ambiente é bom, mas a carga de trabalho está muito pesada",
    },
    {
      stressLevel: "moderado",
      workloadManageable: "geralmente",
      workLifeBalance: "bom",
      supportFromManager: "bom",
      teamCollaboration: "excelente",
      workplaceFlexibility: "boa",
      physicalSymptoms: ["Nenhum sintoma"],
      mentalWellbeing: "bom",
      sleepQuality: "boa",
      jobSatisfaction: "satisfeito",
      careerDevelopment: "algumas",
      recognition: "frequentemente",
      improvements: "Mais oportunidades de treinamento",
      additionalComments: "Estou satisfeito no geral",
    },
    {
      stressLevel: "muito-alto",
      workloadManageable: "impossivel",
      workLifeBalance: "pessimo",
      supportFromManager: "pouco",
      teamCollaboration: "dificil",
      workplaceFlexibility: "nenhuma",
      physicalSymptoms: [
        "Dores de cabeça frequentes",
        "Tensão muscular ou dores nas costas",
        "Problemas de sono",
      ],
      mentalWellbeing: "muito-ruim",
      sleepQuality: "muito-ruim",
      jobSatisfaction: "muito-insatisfeito",
      careerDevelopment: "nenhuma",
      recognition: "nunca",
      improvements:
        "Redução urgente da carga de trabalho e melhor suporte psicológico",
      additionalComments:
        "Estou considerando sair da empresa devido ao estresse",
    },
    {
      stressLevel: "baixo",
      workloadManageable: "sempre",
      workLifeBalance: "excelente",
      supportFromManager: "excelente",
      teamCollaboration: "excelente",
      workplaceFlexibility: "muita",
      physicalSymptoms: ["Nenhum sintoma"],
      mentalWellbeing: "excelente",
      sleepQuality: "excelente",
      jobSatisfaction: "muito-satisfeito",
      careerDevelopment: "muitas",
      recognition: "sempre",
      improvements: "Continuar com as práticas atuais",
      additionalComments: "Muito satisfeito com o ambiente de trabalho",
    },
  ]

  sampleResponses.forEach((responses, index) => {
    saveFeedback(`sample-user-${index + 1}`, responses)
  })

  console.log("[v0] Sample data generated:", mockFeedbacks.length, "feedbacks")
}
