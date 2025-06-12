'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Dog, Cat, Bird, Venus, Mars } from 'lucide-react'
import { IAnimal } from "@/interfaces/animal"

interface CardSProps {
  animal: IAnimal
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

  // Função para traduzir o tamanho
  const getSizeText = (size: string) => {
    switch(size) {
      case 'small': return 'Pequeno'
      case 'medium': return 'Médio'
      case 'large': return 'Grande'
      default: return size
    }
  }

  return (
    <div className={`group ${className}`}>
      <Card className="flex flex-col items-center rounded-xl border-2 border-aborder w-52 h-fit gap-3 hover:cursor-pointer overflow-hidden">
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
        
        <CardContent className="flex flex-row justify-between w-full items-center h-8">
          <div className="flex items-center gap-2 min-w-0">
            <AnimalIcon type={animal.type} />
            <CardTitle className="text-lg overflow-hidden whitespace-nowrap">
              {animal.name}
            </CardTitle>
            {animal.gender === 'female' ? (
              <Venus className="h-5 w-5 flex-shrink-0 text-aquaternary" />
            ) : (
              <Mars className="h-5 w-5 flex-shrink-0 text-asecondary" />
            )}
          </div>
          
          {/*<div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-muted-foreground">Idade</p>
              <p>{animal.age} anos</p>
            </div>
            <div>
              <p className="text-muted-foreground">Porte</p>
              <p>{getSizeText(animal.size)}</p>
            </div>
          </div>*/}
        </CardContent>
        
        <CardFooter className="w-full pt-0">
          <Link 
            href={`/animals/${animal.id}`}
            className="font-bold text-asecondary hover:underline text-md w-full text-center"
          >
            Mais informações
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}