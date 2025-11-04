import { getAdoptions } from "@/app/api/adoption/get-adoptions";
import { ISearchParamsRoot } from "@/interfaces/api";
import { useQuery } from "@tanstack/react-query";

export const useGetAdoptions = (params: ISearchParamsRoot) => {
  return useQuery({
    queryKey: ["get-adoptions", params],
    queryFn: () => getAdoptions(params),
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

