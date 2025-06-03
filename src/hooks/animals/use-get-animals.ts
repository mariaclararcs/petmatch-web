import { getAnimals } from "@/app/api/animals/get-animals";
import { ISearchParamsRoot } from "@/interfaces/api";
import { useQuery } from "@tanstack/react-query";

export const useGetAnimals = ({
    page,
    per_page,
    search,
}: ISearchParamsRoot) => {
    return useQuery({
        queryKey: ['get-animals', page, per_page, search],
        queryFn: () => getAnimals({ page, per_page, search }),
    });
};