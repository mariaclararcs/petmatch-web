"use client"

import api from "@/app/services/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { IUser } from "@/interfaces/user"
import { queryClient } from "@/lib/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteUserProps {
  user: IUser
}

export function DeleteUser({ user }: DeleteUserProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatTypeUser = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'admin': return 'Administrador'
      case 'ong': return 'ONG'
      case 'adopter': return 'Adotante'
      default: return type
    }
  }

  async function handleDelete() {
    try {
      setIsDeleting(true)
      await api.delete(`http://localhost:8000/api/users/${user.id}`)
      queryClient.invalidateQueries({ queryKey: ["get-users"] })
      toast.success("Usuário excluído com sucesso!")
      setIsOpen(false)
    } catch (error) {
      toast.error("Erro ao excluir usuário")
      console.error(error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          title="Deletar Usuário"
          className="h-8 w-8 p-0 hover:bg-amuted hover:border-amuted hover:text-red-600"
        >
          <Trash2 className="h-3 w-3 text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Cadastro do Usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cadastro do usuário <strong>{user.name}</strong> ({user.email})?
            <br />
            <br />
            <strong>Tipo:</strong> {formatTypeUser(user.type_user)}
            <br />
            <br />
            Esta ação não pode ser desfeita e todos os dados relacionados serão permanentemente removidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete} 
            disabled={isDeleting}
          >
            {isDeleting ? "Excluindo..." : "Excluir"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}