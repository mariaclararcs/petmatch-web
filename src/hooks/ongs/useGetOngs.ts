import { getOngs } from "@/app/api/ongs/get-ongs";
import { ISearchParamsRoot } from "@/interfaces/api";
import { useQuery } from "@tanstack/react-query";

export const useGetOngs = ({ page, per_page, search }: ISearchParamsRoot) => {
  return useQuery({
    queryKey: ["get-ongs", page, per_page, search],
    queryFn: async () => {
      const response = await getOngs({ page, per_page, search });
      console.log('API Response:', response);
      return response;
    },
  });
};
