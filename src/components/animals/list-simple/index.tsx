"use client"

import CardM from "@/components/cards/animal-card/card-m"
import { useGetAllAnimals } from "@/hooks/animal/useGetAllAnimals"
import { IAnimal } from "@/interfaces/animal"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { PaginationFull } from "../../pagination"
import LoadingComponent from "@/components/loading"

export default function AnimalsListSimple() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Definindo itens por página
  const itemsPerPage = 9
  const currentPage = z.coerce.number().parse(searchParams.get("page") ?? "1")

  const {
    data: animalsResponse,
    isLoading,
    isError,
  } = useGetAllAnimals({
    page: currentPage,
    per_page: itemsPerPage,
  })

  const animals = animalsResponse?.data?.data || []
  const paginationData = animalsResponse?.data

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  if (isLoading) return <LoadingComponent />

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Erro ao carregar animais</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 max-h-auto">
      <h2 className="text-2xl font-medium mb-6">Animais para adoção</h2>

      <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {animals.map((animal: IAnimal) => (
          <div key={animal.id} className="group">
            <CardM animal={animal} className="w-full" />
          </div>
        ))}
      </div>

      {paginationData && (
        <PaginationFull
          pageIndex={paginationData.current_page}
          totalCount={paginationData.total}
          perPage={paginationData.per_page}
          totalPages={paginationData.last_page}
          hasNextPage={!!paginationData.next_page_url}
          hasPreviousPage={!!paginationData.prev_page_url}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}
