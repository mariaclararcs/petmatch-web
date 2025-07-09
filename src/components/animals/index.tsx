"use client"

import CardM from "@/components/cards/animal-card/card-m"
import { AnimalsFilter } from "@/components/filters/animals-filter"
import { useGetAnimals } from "@/hooks/animal/useGetAnimals"
import { IAnimal } from "@/interfaces/animal"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { PaginationFull } from "../pagination"

export default function Animals() {
  const searchParams = useSearchParams()
  const router = useRouter()

  // Definindo itens por página
  const itemsPerPage = 9
  const currentPage = z.coerce.number().parse(searchParams.get("page") ?? "1")
  const [debouncedSearchTerm] = useState<string>(searchParams.get("search") || "")

  // Estados para os filtros (agora usando string | null)
  const [animalType, setAnimalType] = useState<string | null>(null)
  const [gender, setGender] = useState<string | null>(null)
  const [nameOrder, setNameOrder] = useState<string>("")
  const [shelterTime, setShelterTime] = useState<string>("")
  const [ageRange, setAgeRange] = useState<number[]>([0, 15])

  // Determine sort parameters
  const getSortParams = () => {
    if (nameOrder) {
      const [field, order] = nameOrder.split("-")
      return { sort_by: field as "name", sort_order: order as "asc" | "desc" }
    }
    if (shelterTime) {
      const [field, order] = shelterTime.split("-")
      return { sort_by: field as "shelter_date", sort_order: order as "asc" | "desc" }
    }
    return {}
  }

  const {
    data: animalsResponse,
    isLoading,
    isError,
  } = useGetAnimals({
    page: currentPage,
    per_page: itemsPerPage,
    search: debouncedSearchTerm,
    type: animalType as "dog" | "cat" | "other" | undefined,
    gender: gender as "male" | "female" | undefined,
    min_age: ageRange[0],
    max_age: ageRange[1],
    ...getSortParams(),
  })

  const animals = animalsResponse?.data?.data || []
  const paginationData = animalsResponse?.data

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  // Função simplificada para lidar com mudança de tipo
  const handleTypeChange = (type: string | null) => {
    setAnimalType(type)
  }

  // Função simplificada para lidar com mudança de sexo
  const handleGenderChange = (gender: string | null) => {
    setGender(gender)
  }

  if (isLoading) {
    return (
      <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 max-h-auto">
        <div className="flex flex-row justify-center gap-10 mb-8">
          {/* Área de filtros */}
          <AnimalsFilter
            animalTypes={null}
            genders={null}
            onTypeChange={handleTypeChange}
            onGenderChange={handleGenderChange}
            onNameOrderChange={setNameOrder}
            onShelterTimeChange={setShelterTime}
            onAgeRangeChange={setAgeRange}
            ageRange={ageRange}
          />

          {/* Área de listagem de cards */}
          <div className="flex flex-col mt-4 w-3/4">
            <h2 className="text-2xl font-medium">Animais para adoção</h2>

            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square w-full rounded-xl bg-border lg:h-96 lg:w-62" />
                  <div className="mt-4 space-y-2"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading animals</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 max-h-auto">
      <div className="flex flex-row justify-center gap-10 mb-8">
        {/* Área de filtros */}
        <AnimalsFilter
          animalTypes={animalType}
          genders={gender}
          onTypeChange={handleTypeChange}
          onGenderChange={handleGenderChange}
          onNameOrderChange={setNameOrder}
          onShelterTimeChange={setShelterTime}
          onAgeRangeChange={setAgeRange}
          ageRange={ageRange}
        />

        {/* Área de listagem de cards */}
        <div className="flex flex-col mt-4 w-3/4">
          <h2 className="text-2xl font-medium">Animais para adoção</h2>

          <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {animals.map((animal: IAnimal) => (
              <div key={animal.id} className="group">
                <CardM key={animal.id} animal={animal} className="w-full" />
              </div>
            ))}
          </div>
        </div>
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