"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Garante que o tema só é renderizado no cliente
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="rounded-full border border-border hover:bg-accent transition-all duration-300"
      title="Alternar tema"
    >
      {theme === "light" ? (
        <Moon className="w-5 h-5 text-blue-500 transition-transform duration-500" />
      ) : (
        <Sun className="w-5 h-5 text-yellow-400 transition-transform duration-500" />
      )}
    </Button>
  )
}
