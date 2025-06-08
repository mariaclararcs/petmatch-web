'use client'

import CardS from "@/components/cards"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Slider from "@/components/slider"
import { CalendarCheck2, CalendarHeart } from 'lucide-react'
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center gap-12 mx-auto px-20 py-6 xl:py-8 max-h-auto">
        <Slider />

        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-1">
              <CalendarHeart />
              <h2 className="text-lg font-bold">Animais a mais tempo em abrigo</h2>
            </div>
            <Link href="" className="font-bold text-md text-secondary hover:underline">Ver mais </Link>
          </div>
          <div className="flex flex-row justify-between">
            <CardS />
            <CardS />
            <CardS />
            <CardS />
            <CardS />
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
            <CardS />
            <CardS />
            <CardS />
            <CardS />
            <CardS />
          </div>
        </div>

        {/*<div className="flex flex-col items-center mx-auto px-20 max-h-auto justify-center w-full max-w-screen-xl bg-secondary/50 gap-4 py-6">
          <span className="text-xl font-bold">Como adotar?</span>
          <div className="flex flex-row justify-between gap-10">
            <div className="flex flex-col items-center gap-1 text-center">
              <Image
                alt="Pet Match Icon" 
                src="/icons/finding-pet.png"
                width={100}
                height={100}
              />
              <span className="text-md font-bold">Ache seu melhor amigo</span>
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur porttitor posuere. Maecenas nec lacinia.</span>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <Image
                alt="Pet Match Icon" 
                src="/icons/finding-pet.png"
                width={100}
                height={100}
              />
              <span className="text-md font-bold">Ache seu melhor amigo</span>
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur porttitor posuere. Maecenas nec lacinia.</span>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <Image
                alt="Pet Match Icon" 
                src="/icons/finding-pet.png"
                width={100}
                height={100}
              />
              <span className="text-md font-bold">Ache seu melhor amigo</span>
              <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc consectetur porttitor posuere. Maecenas nec lacinia.</span>
            </div>
          </div>
        </div>*/}
      </div>
      <Footer />
    </>
  )
}