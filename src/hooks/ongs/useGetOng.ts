import api from "@/app/services/api"
import { useQuery } from "@tanstack/react-query"

export const useGetOng = (id: string) => {
  return useQuery({
    queryKey: ["get-ong", id],
    queryFn: async () => {
      const response = await api.get(`http://localhost:8000/api/ongs/${id}`)
      return response.data
    },
    enabled: !!id,
  })
}