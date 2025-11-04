import { updateONG, UpdateONGData } from "@/app/api/ongs/update-ong"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export const useUpdateOng = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateONGData }) => 
      updateONG(id, data),
    onSuccess: () => {
      // Invalida o cache para refetch a lista de ONGs
      queryClient.invalidateQueries({ queryKey: ["get-ongs"] })
    },
  })
}
