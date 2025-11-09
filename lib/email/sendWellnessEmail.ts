import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY) // sua key vai no .env.local

interface WellbeingEmailProps {
  name: string
  email: string
  stressLevel?: string
  workLifeBalance?: string
  mentalWellbeing?: string
  jobSatisfaction?: string
}

export async function sendWellnessEmail({
  name,
  email,
  stressLevel = "não informado",
  workLifeBalance = "não informado",
  mentalWellbeing = "não informado",
  jobSatisfaction = "não informado"
}: WellbeingEmailProps) {
  try {
    await resend.emails.send({
      from: "Equipe BurnoutCare 💙 <noreply@burnoutcare.com>",
      to: email,
      subject: "Seu resultado da Autoavaliação de Bem-Estar 💙",
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f9fafb; padding: 24px; border-radius: 10px; color: #111;">
          <h2 style="color: #2563eb;">Olá, ${name}!</h2>
          <p>Obrigado por realizar nossa autoavaliação de bem-estar.</p>
          <p><strong>Seu resultado:</strong></p>
          <ul style="line-height: 1.6;">
            <li>Estresse: <b>${stressLevel}</b></li>
            <li>Equilíbrio vida/trabalho: <b>${workLifeBalance}</b></li>
            <li>Bem-estar mental: <b>${mentalWellbeing}</b></li>
            <li>Satisfação geral: <b>${jobSatisfaction}</b></li>
          </ul>
          <p>Esse resultado reflete como você tem se sentido recentemente.</p>
          <p style="color: #1d4ed8;">Lembre-se: procurar apoio é um ato de cuidado 💙</p>
          <h4>Canais de apoio:</h4>
          <ul>
            <li><strong>CVV – 188</strong> (24h, gratuito)</li>
            <li>Profissional de saúde mental</li>
            <li>Amigos e familiares de confiança</li>
          </ul>
          <p>Cuide-se!<br/>Equipe BurnoutCare 💙</p>
        </div>
      `
    })

    console.log(`[Resend] E-mail enviado para ${email}`)
  } catch (error) {
    console.error("[Resend] Erro ao enviar e-mail:", error)
  }
}
