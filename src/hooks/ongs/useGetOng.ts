import { useQuery } from "@tanstack/react-query"
import api from "@/app/services/api"
import { IOng } from "@/interfaces/ong"

export function useGetOng(id: string) {
  return useQuery({
    queryKey: ["get-ong", id],
    queryFn: async () => {
      const response = await api.get(`http://localhost:8000/api/ongs/${id}`)
      return response.data as IOng
    },
    enabled: !!id, // Só executa se o ID existir
  })
}