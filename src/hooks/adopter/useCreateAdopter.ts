import { createAdopter, CreateAdopterData } from "@/app/api/adopter/create-adopter"
import { useMutation } from "@tanstack/react-query"

export const useCreateAdopter = () => {
  return useMutation({
    mutationFn: (data: CreateAdopterData) => createAdopter(data),
  })
}
