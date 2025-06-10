/* Página contendo:
- Seção de filtragem por:
    - Ordenação alfabética dos nomes (A-Z, Z-A)
    - Tipo (todos, cachorros, gatos, outros)
    - Tempo no abrigo (mais tempo, menos tempo)
    - Estado
    - Cidade
    - Sexo (fêmea, macho)
    - Idade (mais velhos, mais novos)
- Listagem de cards de animais
*/

'use client'

import Footer from "@/components/footer"
import Header from "@/components/header"
import { Pagination } from "@/components/pagination"
import { useGetAnimals } from "@/hooks/animals/use-get-animals"
import { IAnimal } from "@/interfaces/animals"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import CardM from "@/components/cards/card-m"

export default function Animals() {
  const searchParams = useSearchParams()

  // Definindo itens por página
  const itemsPerPage = 15
  const currentPage = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const [debouncedSearchTerm] = useState<string>(searchParams.get('search') || '')

  // Estados para os filtros
  const [nameOrder, setNameOrder] = useState<string>('')
  const [animalTypes, setAnimalTypes] = useState<Record<string, boolean>>({
    dog: false,
    cat: false,
    other: false
  })
  const [shelterTime, setShelterTime] = useState<string>('')
  const [ageOrder, setAgeOrder] = useState<string>('')
  const [genders, setGenders] = useState<Record<string, boolean>>({
    female: false,
    male: false
  })

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
  const animals = animalsResponse?.data?.data || []
  const totalItems = animalsResponse?.data?.total || 0
  const totalPages = Math.ceil(totalItems / itemsPerPage)

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
      <>
        <Header />
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
        <Footer />
      </>
    )
  }

  if (isError) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-red-500">Error loading animals</p>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 max-h-auto">
        <div className="flex flex-row justify-center gap-10">
          {/* Área de filtros */}
          <div className="flex flex-col gap-4 bg-secondary/40 h-fit w-1/4 rounded-xl px-4 py-4">
            <h2 className="text-xl font-medium">
              Filtros
            </h2>

            <div className="flex flex-col gap-2">
              <h3 className="text-md">
                Ordenação alfabética
              </h3>
              <Select onValueChange={(value) => setNameOrder(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">A-Z</SelectItem>
                  <SelectItem value="name-desc">Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-md">
                Tipo
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="dog" 
                    checked={animalTypes.dog}
                    onCheckedChange={() => handleTypeChange('dog')}
                  />
                  <Label htmlFor="dog">Cachorros</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="cat" 
                    checked={animalTypes.cat}
                    onCheckedChange={() => handleTypeChange('cat')}
                  />
                  <Label htmlFor="cat">Gatos</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="other" 
                    checked={animalTypes.other}
                    onCheckedChange={() => handleTypeChange('other')}
                  />
                  <Label htmlFor="other">Outros</Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-md">
                Tempo no abrigo
              </h3>
              <Select onValueChange={(value) => setShelterTime(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shelter-asc">Mais tempo</SelectItem>
                  <SelectItem value="shelter-desc">Menos tempo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-md">
                Idade
              </h3>
              <Select onValueChange={(value) => setAgeOrder(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="age-asc">Mais velhos</SelectItem>
                  <SelectItem value="age-desc">Mais novos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-md">
                Sexo
              </h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="female" 
                    checked={genders.female}
                    onCheckedChange={() => handleGenderChange('female')}
                  />
                  <Label htmlFor="female">Fêmea</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="male" 
                    checked={genders.male}
                    onCheckedChange={() => handleGenderChange('male')}
                  />
                  <Label htmlFor="male">Macho</Label>
                </div>
              </div>
            </div>
          </div>

          {/* Área de listagem de cards */}
          <div className="flex flex-col mt-4">
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

            {/* Componente de Paginação */}
            {totalPages > 1 && (
              <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                className="mt-12"
              />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}