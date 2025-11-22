"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])
  const [editing, setEditing] = useState<any | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // estado para confirmação de exclusão
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<any | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem("mockUsers") || localStorage.getItem("users") || "[]"
    try { setUsers(JSON.parse(raw)) } catch { setUsers([]) }
  }, [])

  function writeUsers(next: any[]) {
    localStorage.setItem("mockUsers", JSON.stringify(next))
    localStorage.setItem("users", JSON.stringify(next))
    setUsers(next)
  }

  const removeUser = () => {
    if (!userToDelete) return
    const next = users.filter(u =>
      u.id !== userToDelete.id && u.email !== userToDelete.email
    )
    writeUsers(next)

    setConfirmOpen(false)
    setUserToDelete(null)
  }

  const saveEdit = () => {
    if (!editing) return
    const next = users.map(u => (u.id === editing.id || u.email === editing.email) ? editing : u)
    writeUsers(next)
    setDialogOpen(false)
    setEditing(null)
  }

  return (
    <div className="p-4 border rounded bg-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Gerenciar Usuários</h3>
        <Button onClick={() => {
          const newUser = { id: Math.random().toString(36).slice(2,9), name: "Novo Usuário", email: `user${Date.now()}@exemplo.com`, type: "employee"}
          const next = [newUser, ...users]
          writeUsers(next)
        }}>Adicionar (demo)</Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead><tr><th>Nome</th><th>Email</th><th>Tipo</th><th>Ações</th></tr></thead>
          <tbody>
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-muted-foreground">
                  Nenhum usuário
                </td>
              </tr>
            )}

            {users.map((u:any) => (
              <tr key={u.id || u.email} className="border-t">
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.type ?? "employee"}</td>
                <td className="space-x-2">
                  <Button size="sm" onClick={() => { setEditing(u); setDialogOpen(true) }}>
                    Editar
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      setUserToDelete(u)
                      setConfirmOpen(true)
                    }}
                  >
                    Excluir
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Editar usuário</DialogTitle></DialogHeader>
          {editing && (
            <div className="space-y-3">
              <div>
                <label className="block text-sm">Nome</label>
                <Input value={editing.name} onChange={(e)=>setEditing({...editing, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm">Email</label>
                <Input value={editing.email} onChange={(e)=>setEditing({...editing, email: e.target.value})} />
              </div>
              <div className="flex justify-end gap-2">
                <Button onClick={() => { setDialogOpen(false); setEditing(null) }}>Cancelar</Button>
                <Button onClick={saveEdit}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>

          <p className="mt-2">
            Tem certeza que deseja excluir{" "}
            <strong>{userToDelete?.name}</strong>? <br />
            Essa ação não pode ser desfeita.
          </p>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>Cancelar</Button>
            <Button variant="destructive" onClick={removeUser}>
              Excluir definitivamente
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
