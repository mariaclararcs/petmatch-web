'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Dog, Cat, Bird, Venus, Mars } from 'lucide-react'

interface CardMProps {
  animal: {
    id: string
    name: string
    type: string
    gender: string
    image?: string
  }
  className?: string
}

export default function CardM({ animal, className }: CardMProps) {
  const AnimalIcon = ({ type }: { type: string }) => {
    const iconClass = "h-6 w-6 flex-shrink-0"
    switch(type) {
      case 'dog': return <Dog className={iconClass} />
      case 'cat': return <Cat className={iconClass} />
      default: return <Bird className={iconClass} />
    }
  }

  const GenderIcon = ({ gender }: { gender: string }) => {
    return gender === 'female' ? (
      <Venus className="h-6 w-6 flex-shrink-0 text-quaternary" />
    ) : (
      <Mars className="h-6 w-6 flex-shrink-0 text-secondary" />
    )
  }

  return (
    <div className={`${className}`}>
      <Card className="flex flex-col items-center rounded-xl border-2 border-border w-64 h-fit gap-4 p-0 overflow-hidden">
        <CardHeader className="flex flex-col items-center w-full h-62 p-0">
          <Image
            className="rounded-t-lg bg-primary object-cover group-hover:opacity-75"
            alt={animal.name}
            src={animal.image || '/placeholder-animal.jpg'}
            width={248}
            height={248}
            style={{
              width: '100%',
              height: '248px'
            }}
            unoptimized
          />
        </CardHeader>
        
        <CardContent className="flex flex-col w-full h-16 gap-2 px-4">
            {/* Espaço reservado para o nome da ONG (pode ser integrado depois) */}
            <div className="w-full overflow-hidden">
              <span className="text-sm text-secondary block overflow-hidden whitespace-nowrap">
                 Associação Paulista de Proteção Animal com nome muito grande que precisa ser truncado
              </span>
            </div>
            
            <div className="flex flex-row w-full justify-between items-center gap-2">
                <div className="flex items-center gap-2 min-w-0 flex-1 overflow-hidden">
                    <AnimalIcon type={animal.type} />
                    <CardTitle className="text-lg overflow-hidden whitespace-nowrap flex-1">
                      {animal.name}
                    </CardTitle>
                </div>
                <GenderIcon gender={animal.gender} />
            </div>
        </CardContent>
        
        <CardFooter className="w-full px-4 pb-4">
            <button 
                type="submit"
                className="bg-primary rounded-xl border-2 border-secondary py-1 w-full font-bold text-secondary hover:bg-secondary hover:text-background transition-colors">
                    Ver mais
            </button>
        </CardFooter>
      </Card>
    </div>
  )
}