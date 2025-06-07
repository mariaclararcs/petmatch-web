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
  const page = z.coerce.number().parse(searchParams.get('page') ?? '1')
  const per_page = z.coerce.number().parse(searchParams.get('per_page') ?? '10')
  const [debouncedSearchTerm] = useState<string>(searchParams.get('search') || '')

  const { 
    data: animalsResponse, 
    isLoading, 
    isError 
  } = useGetAnimals({
    page,
    per_page,
    search: debouncedSearchTerm,
  })

  // Access the nested data structure safely
  const animals = animalsResponse?.data?.data || []

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col bg-background">
          <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
              {[...Array(per_page)].map((_, i) => (
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
            Adote um amigo <span className="font-bold">agora!</span>
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-5 xl:gap-x-8">
            {animals.map((animal: IAnimal) => (
                    <div key={animal.id} className="group relative">
                      <Card className="flex flex-col items-center rounded-xl border-2 border-border w-fit h-fit gap-2">
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
        </div>
      </div>
      <Footer />
    </>
  )
}