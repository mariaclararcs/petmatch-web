'use client'

import CardP from "@/components/cards"
import Footer from "@/components/footer"
import Header from "@/components/header"
import Slider from "@/components/slider"
import { ClockAlert } from 'lucide-react'
import Link from "next/link"

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex flex-col items-center gap-10 mx-auto px-20 py-6 xl:py-8 max-h-auto">
        <Slider />

        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-1">
              <ClockAlert />
              <h2 className="text-lg font-bold">Animais a mais tempo em abrigo</h2>
            </div>
            <Link href="" className="font-bold text-md text-secondary hover:underline">Ver mais </Link>
          </div>
          <div className="flex flex-row justify-between">
            <CardP />
            <CardP />
            <CardP />
            <CardP />
            <CardP />
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
          <div className="flex flex-row justify-between items-center">
            <div className="flex flex-row items-center gap-1">
              <ClockAlert />
              <h2 className="text-lg font-bold">Animais a mais tempo em abrigo</h2>
            </div>
            <Link href="" className="font-bold text-md text-secondary hover:underline">Ver mais </Link>
          </div>
          <div className="flex flex-row justify-between">
            <CardP />
            <CardP />
            <CardP />
            <CardP />
            <CardP />
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}