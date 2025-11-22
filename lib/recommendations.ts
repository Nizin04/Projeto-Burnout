// src/lib/recommendations.ts
import type { FeedbackResponse } from "./feedback";

/**
 * getDailyRecommendation(lastFeedback)
 * Recebe o último feedback (ou undefined) e retorna:
 * {
 *   id: string, // id da recomendação (estática por regra)
 *   title: string,
 *   text: string,
 *   category?: "stress" | "sleep" | "satisfaction" | "general"
 * }
 */
export function getDailyRecommendation(lastFeedback?: FeedbackResponse) {
  if (!lastFeedback) {
    return {
      id: "no-feedback",
      title: "Complete o questionário",
      text: "Responda o questionário para receber recomendações personalizadas.",
      category: "general"
    };
  }

  const r = lastFeedback.responses ?? {};

  // Normaliza alguns valores pra evitar erros
  const stress = (r.stressLevel || "").toString().toLowerCase();
  const sleep = (typeof r.sleepQuality === "number") ? r.sleepQuality : null;
  const satisfaction = (typeof r.jobSatisfaction === "number") ? r.jobSatisfaction : null;
  const recognition = (r.recognition || "").toString().toLowerCase();

  // Regras (simple, explicáveis)
  if (stress === "muito-alto" || stress === "alto") {
    return {
      id: "breath-60",
      title: "Pausa rápida: respiração 2 minutos",
      text: "Seu nível de estresse está alto. Faça 2 minutos de respiração profunda: inspire 4s, segure 4s, expire 6s. Repita 6 vezes.",
      category: "stress"
    };
  }

  if (sleep !== null && sleep <= 2) {
    return {
      id: "sleep-routine",
      title: "Melhore o sono hoje",
      text: "Seu sono está baixo. Tente reduzir telas 30 min antes de dormir e faça uma rotina relaxante de 10 minutos.",
      category: "sleep"
    };
  }

  if (satisfaction !== null && satisfaction <= 2) {
    return {
      id: "micro-goal",
      title: "Defina um micro-objetivo",
      text: "Satisfação baixa. Defina 1 micro-objetivo simples pro dia — concluir uma tarefa traz sensação de progresso.",
      category: "satisfaction"
    };
  }

  if (recognition.includes("pouco") || recognition.includes("não") ) {
    return {
      id: "say-thanks",
      title: "Experimente dar reconhecimento",
      text: "Peça que reconheça um colega hoje — dar ou receber feedback positivo melhora bem-estar.",
      category: "general"
    };
  }

  // Default positivo
  return {
    id: "keep-going",
    title: "Bom trabalho — mantenha o ritmo",
    text: "Parece que está indo bem. Pequenas pausas e um descanso de qualidade podem manter esse equilíbrio.",
    category: "general"
  };
}
