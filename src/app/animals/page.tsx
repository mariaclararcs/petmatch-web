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
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import Link from "next/link"
import { Dog, Cat, Bird } from 'lucide-react'

// Componente para o ícone do animal
function AnimalIcon({ type }: { type: string }) {
  const iconClass = "h-6 w-6";
  
  switch(type) {
    case 'dog': return <Dog className={iconClass} />;
    case 'cat': return <Cat className={iconClass} />;
    default: return <Bird className={iconClass} />;
  }
}

export default function Animals() {
  const searchParams = useSearchParams()

  // Definindo itens por página
  const itemsPerPage = 12
  const currentPage = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const [debouncedSearchTerm] = useState<string>(searchParams.get('search') || '')

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
          {/* Área de listagem de cards */}
          <div className="flex flex-col mt-4">
            <h2 className="text-2xl font-medium">
              Animais para adoção
            </h2>

            <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
              {animals.map((animal: IAnimal) => (
                      <div key={animal.id} className="group">
                        <Card className="flex flex-col items-center rounded-xl border-2 border-border w-fit h-fit gap-2 hover:cursor-pointer">
                          <CardHeader className="flex flex-col items-center w-full">
                            <Image
                              className="rounded-lg bg-primary object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                              alt={animal.name} 
                              src={animal.image || '/placeholder-animal.jpg'}
                              width={176}
                              height={176}
                              style={{
                                width: '176px',
                                height: '176px'
                              }}
                              unoptimized
                            />
                          </CardHeader>
                          
                          <CardContent className="w-full items-center">
                            <div className="flex items-center gap-2">
                              {/* Ícone condicional baseado no tipo */}
                              <AnimalIcon type={animal.type} />
                              <CardTitle className="text-lg">{animal.name}</CardTitle>
                            </div>
                            {animal.gender === 'female' && 
                              <span className="text-md text-muted-foreground">fêmea</span>}
                            {animal.gender === 'male' && 
                              <span className="text-md text-muted-foreground">macho</span>}
                          </CardContent>
                          
                          <CardFooter className="w-full">
                            <Link 
                              href="" 
                              className="font-bold text-secondary hover:underline text-md"
                            >
                              Mais informações
                            </Link>
                          </CardFooter>
                        </Card>
                      </div>
                
                /*<div key={animal.id} className="group relative">
                  <img
                    alt={animal.name}
                    src={animal.image || '/placeholder-animal.jpg'}
                    className="aspect-square w-full rounded-md bg-gray-200 object-cover group-hover:opacity-75 lg:aspect-auto lg:h-80"
                  />
                  <div className="mt-4 flex justify-between">
                    <div>
                      <h3 className="text-sm text-gray-700">
                        <a>
                          <span aria-hidden="true" className="absolute inset-0" />
                          {animal.name}
                        </a>
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {animal.description || 'No description available'}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      {animal.gender}
                    </p>
                  </div>
                </div>*/
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