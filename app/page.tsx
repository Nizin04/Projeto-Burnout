"use client"

import { useState } from "react"
import { LoginSelection } from "@/components/login-selection"
import FocusMode from "@/components/focus-mode"
import { Button } from "@/components/ui/button"

export default function HomePage() {
  const [focusMode, setFocusMode] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-card relative">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-balance">BurnoutCare</h1>
          </div>

          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-6">
            Cuidando do bem-estar da sua equipe através de feedback contínuo e insights inteligentes
          </p>

          {/* 🔘 Botão modo foco */}
          <Button
            onClick={() => setFocusMode(true)}
            className="bg-indigo-600 text-white hover:bg-indigo-700 transition-all duration-300"
          >
            🧘 Entrar no modo foco
          </Button>
        </div>

        <LoginSelection />
      </div>

      {/* 🌙 Tela modo foco */}
      {focusMode && <FocusMode onClose={() => setFocusMode(false)} />}
    </div>
  )
}
