'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Dog, Cat, Bird, Venus, Mars } from 'lucide-react'
import { IAnimal } from "@/interfaces/animal"

interface CardSProps {
  animal: IAnimal & { shelter_date?: string }
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
      <Card className="flex flex-col items-center rounded-xl border-2 border-aborder w-52 h-fit gap-4 hover:cursor-pointer overflow-hidden">
        <CardHeader className="flex flex-col items-center w-full h-44 p-0">
          <Image
            className="rounded-lg bg-primary object-cover group-hover:opacity-75"
            alt={animal.name} 
            src={animal.image || '/placeholder-animal.jpg'}
            width={176}
            height={176}
            style={{
              width: '100%',
              height: '176px',
              objectFit: 'cover'
            }}
            unoptimized
          />
        </CardHeader>
        
        <CardContent className="flex flex-col w-full gap-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <AnimalIcon type={animal.type} />
              <CardTitle className="text-lg overflow-hidden whitespace-nowrap">
                {animal.name}
              </CardTitle>
            </div>
            {animal.gender === 'female' ? (
              <Venus className="h-5 w-5 flex-shrink-0 text-aquaternary" />
            ) : (
              <Mars className="h-5 w-5 flex-shrink-0 text-asecondary" />
            )}
          </div>

          {animal.shelter_date && (
            <div className="text-sm text-muted-foreground">
              Abrigado em: {animal.shelter_date}
            </div>
          )}
        </CardContent>
        
        <CardFooter className="w-full">
          <Link 
            href={`/animais/${animal.id}`}
            className="font-bold text-asecondary hover:underline text-sm w-full text-center"
          >
            Mais informações
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}