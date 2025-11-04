'use client'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { IOng } from "@/interfaces/ong"
import { useDeleteOng } from "@/hooks/ongs/useDeleteOng"

interface DeleteONGModalProps {
  isOpen: boolean
  onClose: () => void
  ong: IOng | null
}

export default function DeleteONGModal({ isOpen, onClose, ong }: DeleteONGModalProps) {
  const deleteOngMutation = useDeleteOng()

  const handleDelete = async () => {
    if (!ong) return

    try {
      await deleteOngMutation.mutateAsync(ong.id)
      onClose()
    } catch (error) {
      console.error('Erro ao deletar ONG:', error)
      // Você pode adicionar um toast de erro aqui se quiser
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar ONG</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar a ONG <strong>"{ong?.name_institution}"</strong>?
            <br />
            <br />
            Esta ação não pode ser desfeita. Todos os dados relacionados a esta ONG serão permanentemente removidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteOngMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteOngMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteOngMutation.isPending ? 'Deletando...' : 'Deletar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
