'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Dog, Cat, Bird, Venus, Mars } from 'lucide-react'

interface CardSProps {
  animal: {
    id: string
    name: string
    type: string
    gender: string
    image?: string
  }
  className?: string
}

export default function CardS({ animal, className }: CardSProps) {
  const AnimalIcon = ({ type }: { type: string }) => {
    const iconClass = "h-6 w-6 flex-shrink-0"
    switch(type) {
      case 'dog': return <Dog className={iconClass} />
      case 'cat': return <Cat className={iconClass} />
      default: return <Bird className={iconClass} />
    }
  }

  return (
    <div className={`group ${className}`}>
      <Card className="flex flex-col items-center rounded-xl border-2 border-border w-52 h-fit gap-2 hover:cursor-pointer overflow-hidden">
        <CardHeader className="flex flex-col items-center w-full h-44 p-0">
          <Image
            className="rounded-lg bg-primary object-cover group-hover:opacity-75"
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
        
        <CardContent className="w-full items-center h-8">
          <div className="flex items-center gap-2 min-w-0">
            <AnimalIcon type={animal.type} />
            <CardTitle className="text-lg overflow-hidden whitespace-nowrap">{animal.name}</CardTitle>
          </div>
          {animal.gender === 'female' && 
            <Venus className="h-5 w-5 flex-shrink-0 text-quaternary" />}
          {animal.gender === 'male' && 
            <Mars className="h-5 w-5 flex-shrink-0 text-secondary" />}
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
  )
}