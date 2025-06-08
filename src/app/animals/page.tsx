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
import { useGetAnimals } from "@/hooks/animals/use-get-animals"
import { IAnimal } from "@/interfaces/animals"
import Image from "next/image"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
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
import { Dog, Cat, Bird, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

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
  const router = useRouter()
  const pathname = usePathname()

  // Definindo 15 itens por página
  const itemsPerPage = 10
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

  // Função para mudar de página
  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col bg-background">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
              {[...Array(itemsPerPage)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square w-full rounded-xl bg-gray-200 lg:h-68" />
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
      <div className="min-h-screen flex flex-col bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-medium tracking-tight text-gray-900">
            Animais para adoção
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
            {animals.map((animal: IAnimal) => (
                    <div key={animal.id} className="group relative">
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
                          />
                        </CardHeader>
                        
                        <CardContent className="w-full items-center">
                          <div className="flex items-center gap-2">
                            {/* Ícone condicional baseado no tipo */}
                            <AnimalIcon type={animal.type} />
                            {/*<span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                              {animal.type === 'dog' ? 'Cachorro' : 
                              animal.type === 'cat' ? 'Gato' : 'Outro'}
                            </span>*/}
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
          <div className="mt-12 flex items-center justify-between font-bold">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="flex items-center justify-center rounded-xl border-2 border-border h-10 w-10 hover:bg-border hover:text-background transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Lógica para mostrar páginas próximas à atual
                let pageNum
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }

                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    onClick={() => goToPage(pageNum)}
                    className={currentPage === pageNum ? `flex items-center rounded-xl border-2 border-secondary h-10 w-10 text-secondary font-bold` : "flex items-center rounded-xl border-2 border-border h-10 w-10 font-bold hover:bg-border hover:text-background transition-colors"}
                  >
                    {pageNum}
                  </Button>
                )
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <span className="mx-1">...</span>
              )}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <Button
                  variant="outline"
                  onClick={() => goToPage(totalPages)}
                  className="flex items-center rounded-xl border-2 border-border h-10 w-10 font-bold hover:bg-border hover:text-background transition-colors"
                >
                  {totalPages}
                </Button>
              )}
            </div>

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center rounded-xl border-2 border-border h-10 w-10 hover:bg-border hover:text-background transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </>
  )
}