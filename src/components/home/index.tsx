'use client'

import CardS from "@/components/cards/card-s"
import BannerSlider from "@/components/banner-slider"
import { CalendarCheck2, CalendarHeart } from 'lucide-react'
import Link from "next/link"
import { useGetAnimals } from "@/hooks/animal/useGetAnimals"
import { IAnimal } from "@/interfaces/animal"
import { useEffect, useState } from "react"

interface AnimalWithFormattedDate extends Omit<IAnimal, 'shelter_date'> {
  formatted_date?: string;
  shelter_date: Date;
}

type CardAnimal = Omit<IAnimal, 'shelter_date'> & { shelter_date?: string }

export default function Home() {
  const [longestStayAnimals, setLongestStayAnimals] = useState<AnimalWithFormattedDate[]>([])
  const [newestAnimals, setNewestAnimals] = useState<AnimalWithFormattedDate[]>([])
  
  // Busca TODOS os animais (sem ordenação inicial)
  const { 
    data: animalsResponse, 
    isLoading, 
    isError 
  } = useGetAnimals({
    page: 1,
    per_page: 100 // Número grande para pegar todos
  })

  useEffect(() => {
    if (animalsResponse?.data?.data) {
      const animalsWithDates = animalsResponse.data.data
        .map((animal: IAnimal) => ({
          ...animal,
          shelter_date: new Date(animal.shelter_date),
          formatted_date: formatDate(animal.shelter_date.toString())
        }))
        .filter((animal: AnimalWithFormattedDate) => !isNaN(animal.shelter_date.getTime())) // Filtra datas inválidas

      // Ordena e pega os 5 mais antigos
      const oldest = [...animalsWithDates]
        .sort((a, b) => a.shelter_date.getTime() - b.shelter_date.getTime())
        .slice(0, 5)
      
      // Ordena e pega os 5 mais recentes
      const newest = [...animalsWithDates]
        .sort((a, b) => b.shelter_date.getTime() - a.shelter_date.getTime())
        .slice(0, 5)
      
      setLongestStayAnimals(oldest)
      setNewestAnimals(newest)
    }
  }, [animalsResponse])

  // Função para formatar a data
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
  }

  // Função para converter AnimalWithFormattedDate para o formato esperado pelo CardS
  const convertToCardAnimal = (animal: AnimalWithFormattedDate): CardAnimal => {
    const { formatted_date, shelter_date, ...rest } = animal
    return {
      ...rest,
      shelter_date: formatted_date || formatDate(shelter_date.toISOString())
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-12 mx-auto px-20 py-6 xl:py-8 min-h-screen">
        <BannerSlider />
        {/* Placeholders para loading */}
        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-1">
              <CalendarHeart />
              <h2 className="text-lg font-bold">Animais a mais tempo em abrigo</h2>
            </div>
            <Link
              href="#" 
              className="font-bold text-md text-asecondary hover:underline"
            >
              Ver mais 
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square w-full rounded-xl bg-border lg:h-68 lg:w-52" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-1">
              <CalendarCheck2 />
              <h2 className="text-lg font-bold">Animais recém abrigados</h2>
            </div>
            <Link 
              href="#" 
              className="font-bold text-md text-asecondary hover:underline"
            >
              Ver mais
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square w-full rounded-xl bg-border lg:h-68 lg:w-52" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500">Error loading animals</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-12 mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-6 xl:py-8 min-h-screen">
      <BannerSlider />

      {/* Seção de animais a mais tempo no abrigo */}
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            <CalendarHeart className="text-primary" />
            <h2 className="text-lg font-bold">Animais a mais tempo em abrigo</h2>
          </div>
          <Link 
            href="#" 
            className="font-bold text-md text-asecondary hover:underline"
          >
            Ver mais
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {longestStayAnimals.length > 0 ? (
            longestStayAnimals.map((animal) => (
              <CardS 
                key={animal.id}
                animal={convertToCardAnimal(animal)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-4">
              Nenhum animal encontrado
            </p>
          )}
        </div>
      </div>

      {/* Seção de animais recentemente abrigados */}
      <div className="flex flex-col w-full gap-6">
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-2">
            <CalendarCheck2 className="text-primary" />
            <h2 className="text-lg font-bold">Animais recém abrigados</h2>
          </div>
          <Link 
            href="#" 
            className="font-bold text-md text-asecondary hover:underline"
          >
            Ver mais
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {newestAnimals.length > 0 ? (
            newestAnimals.map((animal) => (
              <CardS 
                key={animal.id}
                animal={convertToCardAnimal(animal)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-muted-foreground py-4">
              Nenhum animal encontrado
            </p>
          )}
        </div>
      </div>
    </div>
  )
}