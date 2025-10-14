"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import {
  Sun, Moon, Smile, Meh, Frown, Users, Zap, Flame, Cloud, Heart,
  Brain, ThumbsUp, Star
} from "lucide-react"

export default function FocusMode({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState(0)
  const [dark, setDark] = useState(true)
  const [answers, setAnswers] = useState<any>({})
  const totalSteps = 9

  const next = () => setStep((s) => s + 1)
  const select = (key: string, value: any) => {
    setAnswers((prev: any) => ({ ...prev, [key]: value }))
    next()
  }

  const fade = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -30 },
    transition: { duration: 0.5 },
  }

  const bg = dark
    ? "from-slate-900 via-slate-800 to-sky-900 text-white"
    : "from-white via-blue-50 to-blue-100 text-slate-800"

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br ${bg} p-6 backdrop-blur-xl transition-colors`}
    >
      <div
        className={`w-full max-w-2xl text-center rounded-2xl shadow-2xl border ${
          dark ? "border-white/10 bg-white/10" : "border-slate-200 bg-white/70"
        } p-10 relative`}
      >
        {/* Botão modo claro/escuro */}
        <button
          onClick={() => setDark(!dark)}
          className={`absolute top-5 right-5 p-2 rounded-full transition ${
            dark ? "bg-white/10 hover:bg-white/20" : "bg-slate-200 hover:bg-slate-300"
          }`}
        >
          {dark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Barra de progresso */}
        <div className={`h-2 rounded-full mb-8 overflow-hidden ${dark ? "bg-white/20" : "bg-slate-200"}`}>
          <motion.div
            className="h-2 bg-sky-500"
            initial={{ width: 0 }}
            animate={{ width: `${(step / (totalSteps - 1)) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>

        <AnimatePresence mode="wait">
          {/* Passos */}

          {/* Introdução */}
          {step === 0 && (
            <motion.div key="intro" {...fade}>
              <h1 className="text-3xl font-bold mb-4">Momento de Preparação 💬</h1>
              <p className={`${dark ? "text-white/80" : "text-slate-600"} mb-8`}>
                Antes de avaliar sua experiência, vamos entender como você está e refletir sobre o ambiente de trabalho.
              </p>
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={next}>
                Começar
              </Button>
            </motion.div>
          )}

          {/* Humor */}
          {step === 1 && (
            <motion.div key="mood" {...fade}>
              <h2 className="text-2xl font-semibold mb-4">Como você se sente agora?</h2>
              <div className="flex justify-center gap-6">
                {[
                  { icon: Smile, label: "Bem" },
                  { icon: Meh, label: "Neutro" },
                  { icon: Frown, label: "Cansado" },
                ].map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    onClick={() => select("humor", label)}
                    className={`p-4 rounded-xl border ${
                      dark
                        ? "border-white/20 hover:bg-white/10"
                        : "border-slate-300 hover:bg-slate-200"
                    } transition w-28`}
                  >
                    <Icon size={36} className="mx-auto" />
                    <p className="mt-2">{label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Energia */}
          {step === 2 && (
            <motion.div key="energy" {...fade}>
              <h2 className="text-2xl font-semibold mb-4">O que mais exigiu sua energia hoje?</h2>
              <div className="flex flex-wrap justify-center gap-3">
                {["Reuniões", "Prazos", "Comunicação", "Imprevistos", "Tarefas repetitivas"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => select("energia", item)}
                      className={`px-5 py-2 rounded-full border ${
                        dark
                          ? "border-white/20 hover:bg-white/10"
                          : "border-slate-300 hover:bg-slate-200"
                      } transition`}
                    >
                      {item}
                    </button>
                  )
                )}
              </div>
            </motion.div>
          )}

          {/* Ambiente */}
          {step === 3 && (
            <motion.div key="environment" {...fade}>
              <h2 className="text-2xl font-semibold mb-4">Como está o ambiente de trabalho hoje?</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Tranquilo", icon: Cloud },
                  { label: "Corrido", icon: Zap },
                  { label: "Tenso", icon: Flame },
                  { label: "Colaborativo", icon: Users },
                ].map(({ label, icon: Icon }) => (
                  <button
                    key={label}
                    onClick={() => select("ambiente", label)}
                    className={`flex flex-col items-center gap-2 p-5 rounded-xl border ${
                      dark
                        ? "border-white/20 hover:bg-white/10"
                        : "border-slate-300 hover:bg-slate-200"
                    } transition`}
                  >
                    <Icon size={36} />
                    <p>{label}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Cargo */}
          {step === 4 && (
            <motion.div key="role" {...fade}>
              <h2 className="text-2xl font-semibold mb-4">Como você enxerga seu cargo atualmente?</h2>
              <div className="grid grid-cols-2 gap-4">
                {["Desafiador", "Confortável", "Sob pressão", "Em evolução"].map((item) => (
                  <button
                    key={item}
                    onClick={() => select("cargo", item)}
                    className={`p-4 rounded-xl border ${
                      dark
                        ? "border-white/20 hover:bg-white/10"
                        : "border-slate-300 hover:bg-slate-200"
                    } transition`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Conceitos de ambiente saudável */}
          {step === 5 && (
            <motion.div key="concepts" {...fade}>
              <h2 className="text-2xl font-semibold mb-4">Ambientes saudáveis são baseados em...</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                {[
                  { icon: Heart, label: "Empatia" },
                  { icon: Brain, label: "Autonomia" },
                  { icon: Users, label: "Colaboração" },
                  { icon: Star, label: "Reconhecimento" },
                  { icon: ThumbsUp, label: "Respeito mútuo" },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className={`flex items-center gap-3 p-3 rounded-xl ${
                      dark ? "bg-white/10" : "bg-slate-200/80"
                    }`}
                  >
                    <Icon size={22} />
                    <p>{label}</p>
                  </div>
                ))}
              </div>
              <p className={`${dark ? "text-white/70" : "text-slate-600"} mt-6 text-sm`}>
                Reflita: o seu ambiente atual promove esses valores?
              </p>
              <Button className="mt-4 bg-sky-600 hover:bg-sky-700" onClick={next}>
                Continuar
              </Button>
            </motion.div>
          )}

          {/* Cor do dia */}
          {step === 6 && (
            <motion.div key="color" {...fade}>
              <h2 className="text-2xl font-semibold mb-4">Se o seu dia tivesse uma cor, qual seria?</h2>
              <div className="flex justify-center gap-6">
                {[
  { colorClass: "bg-sky-500", label: "Tranquilo" },
  { colorClass: "bg-amber-400", label: "Agitado" },
  { colorClass: "bg-rose-500", label: "Estressante" },
  { colorClass: "bg-emerald-500", label: "Produtivo" },
].map(({ colorClass, label }) => (
 <button
  key={label}
  onClick={() => select("cor do dia", { label, colorClass })}
  className={`w-16 h-16 rounded-full ${colorClass} hover:scale-110 transition border-2 ${
    dark ? "border-white/50" : "border-black/20"
  } flex items-center justify-center`}
  title={label}
/>

))}

              </div>
            </motion.div>
          )}

          {/* Reflexão */}
          {step === 7 && (
            <motion.div key="reflection" {...fade}>
              <h2 className="text-2xl font-semibold mb-4">Reflexão rápida 💭</h2>
              <p className={`${dark ? "text-white/80" : "text-slate-700"} mb-6`}>
                O que faria o seu ambiente de trabalho ser 1% mais harmonioso amanhã?
              </p>
              <Button className="bg-sky-600 hover:bg-sky-700" onClick={next}>
                Ver resumo
              </Button>
            </motion.div>
          )}

          {/* Resumo final */}
          {step === 8 && (
            <motion.div key="done" {...fade}>
              <h2 className="text-3xl font-bold mb-4">Tudo pronto! ✅</h2>
              <p className={`${dark ? "text-white/70" : "text-slate-700"} mb-6`}>
                Aqui está um resumo do seu momento atual:
              </p>
              <div
                className={`text-left rounded-xl p-4 ${
                  dark ? "bg-white/10" : "bg-slate-200/60"
                } mb-6 space-y-2`}
              >
                {Object.entries(answers).map(([k, v]: [string, any]) => (
                  <div key={k} className="capitalize flex justify-between items-center gap-2">
                    <span className="opacity-70 font-medium">{k}</span>
                    {k === "cor do dia" && v ? (
  <div className="flex items-center gap-2">
    <span
      className={`w-6 h-6 rounded-full ${v.colorClass} border border-white/50`}
    ></span>
    <span className="font-semibold">{v.label}</span>
  </div>
) : (
  <span className="font-semibold">{v ?? "Não respondido"}</span>
)}

                  </div>
                ))}
              </div>
              <Button className="bg-emerald-600 hover:bg-emerald-700" onClick={onClose}>
                Começar Feedback
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
