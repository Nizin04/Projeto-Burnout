// app/layout.tsx
import type React from "react"
import type { Metadata } from "next"
import "./globals.css"

// importe o ThemeProvider e o ThemeToggle
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeToggle } from "@/components/themeToggle"

export const metadata: Metadata = {
  title: "BurnoutCare - Monitoramento de Bem-estar Corporativo",
  description: "Sistema de monitoramento e prevenção de burnout para empresas",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Remova a classe "dark" fixa do html
    <html lang="pt-BR">
      <body className="font-sans antialiased min-h-screen bg-background text-foreground">
        {/* ThemeProvider do next-themes: ele vai aplicar a class "dark" no <html> quando necessário */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* Cabeçalho simples com o botão de alternar tema */}
          <header className="w-full border-b border-border px-4 py-3 flex items-center justify-between">
            <div className="text-lg font-semibold">BurnoutCare</div>
            <div className="flex items-center gap-2">
              <ThemeToggle />
            </div>
          </header>

          <main className="p-4">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  )
}
