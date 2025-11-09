"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"


interface User {
  name: string
  email: string
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    setUsers(storedUsers)
  }, [])

  const handleDelete = (email: string) => {
    const updated = users.filter((u) => u.email !== email)
    setUsers(updated)
    localStorage.setItem("users", JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Usuários</h1>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {users.length === 0 ? (
          <p className="text-muted-foreground">Nenhum usuário registrado ainda.</p>
        ) : (
          users.map((user, i) => (
            <Card key={i} className="shadow-sm">
              <CardHeader>
                <CardTitle>{user.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{user.email}</p>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(user.email)}>
                  Excluir
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
