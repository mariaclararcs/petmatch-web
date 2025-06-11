import { getUsers } from "@/app/api/users/get-users";
import { ISearchParamsRoot } from "@/interfaces/api";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = ({ page, per_page, search }: ISearchParamsRoot) => {
  return useQuery({
    queryKey: ["get-users", page, per_page, search],
    queryFn: () => getUsers({ page, per_page, search }),
  });
};
