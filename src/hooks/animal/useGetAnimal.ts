import { getAnimal } from "@/app/api/animal/get-animal";
import { useQuery } from "@tanstack/react-query";

export const useGetAnimal = (id: string) => {
  return useQuery({
    queryKey: ["get-animal", id],
    queryFn: () => getAnimal(id),
    enabled: !!id,
  });
}; 