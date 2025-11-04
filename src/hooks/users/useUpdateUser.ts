import { updateUser, UpdateUserData } from "@/app/api/users/update-user"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserData }) => 
      updateUser(id, data),
    onSuccess: () => {
      // Invalida o cache para refetch a lista de usuários
      queryClient.invalidateQueries({ queryKey: ["get-users"] })
    },
  })
}
