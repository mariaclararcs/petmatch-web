import { getAnimals } from "@/app/api/animals/get-animals";
import { ISearchParamsRoot } from "@/interfaces/animals";
import { useQuery } from "@tanstack/react-query";

export const useGetAnimals = (params: ISearchParamsRoot) => {
    return useQuery({
        queryKey: ['get-animals', params],
        queryFn: () => getAnimals(params),
    });
};