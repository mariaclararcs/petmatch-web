import { getAdopters } from "@/app/api/adopter/get-adopters";
import { ISearchParamsRoot } from "@/interfaces/api";
import { useQuery } from "@tanstack/react-query";

export const useGetAdopters = ({ page, per_page, search }: ISearchParamsRoot) => {
  return useQuery({
    queryKey: ["get-adopters", page, per_page, search],
    queryFn: async () => {
      const response = await getAdopters({ page, per_page, search });
      return response;
    },
  });
};
