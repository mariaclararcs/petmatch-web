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
import { IOng } from "@/interfaces/ong"
import { queryClient } from "@/lib/react-query"
import { Trash2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

interface DeleteOngProps {
  ong: IOng
}

export function DeleteOng({ ong }: DeleteOngProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  async function handleDelete() {
    try {
      setIsDeleting(true)
      await api.delete(`http://localhost:8000/api/ongs/${ong.id}`)
      queryClient.invalidateQueries({ queryKey: ["get-ongs"] })
      toast.success("ONG excluída com sucesso!")
      setIsOpen(false)
    } catch (error) {
      toast.error("Erro ao excluir ONG")
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
          title="Deletar ONG"
          className="h-8 w-8 p-0 hover:bg-amuted hover:border-amuted hover:text-red-600"
        >
          <Trash2 className="h-3 w-3 text-red-600" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Excluir Cadastro da ONG</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir o cadastro da ONG <strong>{ong.name_institution}</strong>? 
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