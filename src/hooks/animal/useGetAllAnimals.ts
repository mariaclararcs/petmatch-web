import { getAllAnimals } from "@/app/api/animal/get-all-animals";
import { IAnimalSearchParams } from "@/interfaces/api";
import { useQuery } from "@tanstack/react-query";

export const useGetAllAnimals = (params: IAnimalSearchParams) => {
  return useQuery({
    queryKey: ["get-all-animals", params],
    queryFn: () => getAllAnimals(params),
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
