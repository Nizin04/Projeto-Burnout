"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Message = { from: "user" | "bot"; text: string }

const cannedResponses: { [key: string]: string[] } = {
  "ansiedade": [
    "Respire fundo 4 vezes: inspire 4s, prenda 4s, expire 4s. Repita 3x.",
    "Tente uma pausa curta de 5 minutos: levante, caminhe um pouco e beba água."
  ],
  "procrastinação": [
    "Divida a tarefa em passos de 10 minutos e escolha só o primeiro.",
    "Experimente a técnica Pomodoro: 25 min focado + 5 min descanso."
  ],
  "cansaço": [
    "Seu corpo pede descanso. Faz um alongamento leve e considere reduzir a carga hoje.",
    "Se possível, cochile 20 minutos ou durma mais cedo esta noite."
  ],
  "motivação": [
    "Lembre-se do porquê você começou. Liste 3 motivos curtos agora.",
    "Defina uma recompensa pequena para quando terminar a tarefa."
  ],
  "default": [
    "Posso te dar dicas rápidas sobre ansiedade, procrastinação, cansaço e motivação. Sobre o que você quer ajuda?",
    "Se preferir, escolha um tema: ansiedade, procrastinação, cansaço, motivação."
  ]
}

function pickResponse(topic: string) {
  const arr = cannedResponses[topic] || cannedResponses["default"]
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { from: "bot", text: "Oi! Eu sou seu assistente de apoio — sobre o que você quer falar? (ansiedade / procrastinação / cansaço / motivação)" }
  ])
  const [input, setInput] = useState("")
  const messagesRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight })
  }, [messages, open])

  function sendUser(text: string) {
    if (!text.trim()) return
    const userMsg: Message = { from: "user", text }
    setMessages(prev => [...prev, userMsg])
    setInput("")

    // Simple rule-based parsing
    const low = text.toLowerCase()
    let topic = "default"
    for (const k of Object.keys(cannedResponses)) {
      if (k !== "default" && low.includes(k)) { topic = k; break }
    }

    // Simulate typing delay
    setTimeout(() => {
      const botText = pickResponse(topic)
      setMessages(prev => [...prev, { from: "bot", text: botText }])
    }, 700)
  }

  return (
    <>
      {/* floating button */}
      <div className="fixed right-6 bottom-6 z-[999]">
        <Button onClick={() => setOpen(o => !o)} className="rounded-full p-3 shadow-lg">
          {open ? "Fechar chat" : "Ajuda"}
        </Button>
      </div>

      {/* panel */}
      {open && (
        <div className="fixed right-6 bottom-20 z-[999] w-[360px] max-w-[92vw] bg-white dark:bg-slate-900 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-3 border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-indigo-50 to-white dark:from-transparent dark:to-transparent">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">Assistente</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Dicas rápidas e apoio</div>
              </div>
              <div>
                <Button size="sm" variant="ghost" onClick={() => { setMessages([{ from: "bot", text: "Oi! Eu sou seu assistente de apoio — sobre o que você quer falar? (ansiedade / procrastinação / cansaço / motivação)" }]); }}>
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <div ref={messagesRef} className="h-64 overflow-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={m.from === "user" ? "text-right" : "text-left"}>
                <div className={m.from === "user" ? "inline-block bg-indigo-600 text-white px-3 py-2 rounded-md" : "inline-block bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded-md"}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-gray-100 dark:border-gray-800 flex gap-2">
            <Input value={input} onChange={(e:any)=>setInput(e.target.value)} placeholder="Escreva sua mensagem ou uma palavra-chave..." onKeyDown={(e:any)=>{ if (e.key === "Enter") sendUser(input) }} />
            <Button onClick={()=>sendUser(input)}>Enviar</Button>
          </div>
        </div>
      )}
    </>
  )
}
