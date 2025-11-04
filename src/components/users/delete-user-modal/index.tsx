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
import { IUser } from "@/interfaces/user"
import { useDeleteUser } from "@/hooks/users/useDeleteUser"

interface DeleteUserModalProps {
  isOpen: boolean
  onClose: () => void
  user: IUser | null
}

export default function DeleteUserModal({ isOpen, onClose, user }: DeleteUserModalProps) {
  const deleteUserMutation = useDeleteUser()

  const handleDelete = async () => {
    if (!user) return

    try {
      await deleteUserMutation.mutateAsync(user.id)
      onClose()
    } catch (error) {
      console.error('Erro ao deletar usuário:', error)
      // Você pode adicionar um toast de erro aqui se quiser
    }
  }

  const formatTypeUser = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'admin': return 'Administrador'
      case 'ong': return 'ONG'
      case 'adopter': return 'Adotante'
      default: return type
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deletar Usuário</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja deletar o usuário <strong>"{user?.name}"</strong> ({user?.email})?
            <br />
            <br />
            <strong>Tipo:</strong> {formatTypeUser(user?.type_user || '')}
            <br />
            <br />
            Esta ação não pode ser desfeita. Todos os dados relacionados a este usuário serão permanentemente removidos.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteUserMutation.isPending}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteUserMutation.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            {deleteUserMutation.isPending ? 'Deletando...' : 'Deletar'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
