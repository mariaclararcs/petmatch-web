import { deleteUser } from "@/app/api/users/delete-user"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteUser(id),
    onSuccess: () => {
      // Invalida o cache para refetch a lista de usuários
      queryClient.invalidateQueries({ queryKey: ["get-users"] })
    },
  })
}
