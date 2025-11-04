import { deleteONG } from "@/app/api/ongs/delete-ong"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useDeleteOng = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteONG(id),
    onSuccess: () => {
      // Invalida o cache para refetch a lista de ONGs
      queryClient.invalidateQueries({ queryKey: ["get-ongs"] })
    },
  })
}
