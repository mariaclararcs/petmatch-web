import { getAnimals } from "@/app/api/animal/get-animals"
import { IAnimalSearchParams } from "@/interfaces/api"
import { useQuery } from "@tanstack/react-query"

export const useGetAnimals = (params: IAnimalSearchParams) => {
  return useQuery({
    queryKey: ["get-animals", params],
    queryFn: () => getAnimals(params),
    select: (data) => {
      return {
        ...data,
        data: {
          ...data.data,
          data: Array.isArray(data.data?.data) ? data.data.data : []
        }
      }
    }
  })
}