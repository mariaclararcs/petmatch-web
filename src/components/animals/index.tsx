'use client'

import { useGetAnimals } from "@/hooks/animal/useGetAnimals"
import { IAnimal } from "@/interfaces/animal"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import CardM from "@/components/cards/card-m"
import { AnimalsFilter } from "@/components/filters/animals-filter"

export default function Animals() {
  const searchParams = useSearchParams()

  // Definindo itens por página
  const itemsPerPage = 15
  const currentPage = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const [debouncedSearchTerm] = useState<string>(searchParams.get('search') || '')

  // Estados para os filtros
  const [animalTypes, setAnimalTypes] = useState<Record<string, boolean>>({
    dog: false,
    cat: false,
    other: false
  })
  const [genders, setGenders] = useState<Record<string, boolean>>({
    female: false,
    male: false
  })
  const [nameOrder, setNameOrder] = useState<string>('')
  const [shelterTime, setShelterTime] = useState<string>('')
  const [ageOrder, setAgeOrder] = useState<string>('')
  const [ageRange, setAgeRange] = useState<number[]>([0, 15]) // Range filtro idade

  const { 
    data: animalsResponse, 
    isLoading, 
    isError 
  } = useGetAnimals({
    page: currentPage,
    per_page: itemsPerPage,
    search: debouncedSearchTerm,
  })

  // Acessando os dados de paginação
  const animals = animalsResponse?.data || []

  const handleTypeChange = (type: string) => {
    setAnimalTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleGenderChange = (gender: string) => {
    setGenders(prev => ({
      ...prev,
      [gender]: !prev[gender]
    }))
  }

  if (isLoading) {
    return (
      <div className="flex flex-col">
        <div className="mx-auto px-20 py-6 xl:py-8 max-h-auto">
          <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {[...Array(itemsPerPage)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square w-full rounded-xl bg-border lg:h-68 lg:w-52" />
                <div className="mt-4 space-y-2">
                </div>
              </div>
            ))}
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
      <div className="flex flex-row justify-center gap-10">
        {/* Área de filtros */}
        <AnimalsFilter
          animalTypes={animalTypes}
          genders={genders}
          onTypeChange={handleTypeChange}
          onGenderChange={handleGenderChange}
          onNameOrderChange={setNameOrder}
          onShelterTimeChange={setShelterTime}
          onAgeRangeChange={setAgeRange}
          ageRange={ageRange}
        />

        {/* Área de listagem de cards */}
        <div className="flex flex-col mt-4 w-3/4">
          <h2 className="text-2xl font-medium">
            Animais para adoção
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
            {animals.map((animal: IAnimal) => (
              <div key={animal.id} className="group">
                <CardM
                  key={animal.id} 
                  animal={animal}
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}