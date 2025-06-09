'use client'

import CardS from "@/components/cards/card-s"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Slider from "@/components/slider"
import { CalendarCheck2, CalendarHeart } from 'lucide-react'
import Link from "next/link"
import { useGetAnimals } from "@/hooks/animals/use-get-animals"
import { IAnimal } from "@/interfaces/animals"
import { useEffect, useState } from "react"

export default function Home() {
  const [longestStayAnimals, setLongestStayAnimals] = useState<IAnimal[]>([])
  const [newestAnimals, setNewestAnimals] = useState<IAnimal[]>([])
  
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
        .map(animal => ({
          ...animal,
          shelter_date: new Date(animal.shelter_date)
        }))
        .filter(animal => !isNaN(animal.shelter_date.getTime())) // Filtra datas inválidas

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

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="flex flex-col items-center gap-12 mx-auto px-20 py-6 xl:py-8 max-h-auto">
          <Slider />
          {/* Placeholders para loading */}
          <div className="flex flex-col w-full gap-3">
            <div className="flex flex-row justify-between items-center">
              <div className="flex flex-row items-center gap-1">
                <CalendarHeart />
                <h2 className="text-lg font-bold">Animais a mais tempo em abrigo</h2>
              </div>
              <Link href="" className="font-bold text-md text-secondary hover:underline">Ver mais </Link>
            </div>
            <div className="flex flex-row justify-between">
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
              <Link href="" className="font-bold text-md text-secondary hover:underline">Ver mais </Link>
            </div>
            <div className="flex flex-row justify-between">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square w-full rounded-xl bg-border lg:h-68 lg:w-52" />
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
      <div className="flex flex-col items-center gap-12 mx-auto px-20 py-6 xl:py-8 max-h-auto">
        <Slider />

        {/* Seção de animais a mais tempo no abrigo */}
        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-1">
              <CalendarHeart />
              <h2 className="text-lg font-bold">Animais a mais tempo em abrigo</h2>
            </div>
            <Link href="/animals?order_by=shelter_date&order=asc" className="font-bold text-md text-secondary hover:underline">Ver mais</Link>
          </div>
          <div className="flex flex-row justify-between">
            {longestStayAnimals.length > 0 ? (
              longestStayAnimals.map((animal) => (
                <CardS 
                  key={animal.id}
                  animal={animal}
                />
              ))
            ) : (
              <p>Nenhum animal encontrado</p>
            )}
          </div>
        </div>

        {/* Seção de animais recentemente abrigados */}
        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-1">
              <CalendarCheck2 />
              <h2 className="text-lg font-bold">Animais recém abrigados</h2>
            </div>
            <Link href="/animals?order_by=shelter_date&order=desc" className="font-bold text-md text-secondary hover:underline">Ver mais</Link>
          </div>
          <div className="flex flex-row justify-between">
            {newestAnimals.length > 0 ? (
              newestAnimals.map((animal) => (
                <CardS 
                  key={animal.id}
                  animal={animal}
                />
              ))
            ) : (
              <p>Nenhum animal encontrado</p>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}