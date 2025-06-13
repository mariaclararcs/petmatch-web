'use client'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import { Dog, Cat, Bird, Venus, Mars } from 'lucide-react'
import { IAnimal } from "@/interfaces/animal"
import Link from "next/link"

interface CardMProps {
  animal: IAnimal
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
      <Venus className="h-6 w-6 flex-shrink-0 text-aquaternary" />
    ) : (
      <Mars className="h-6 w-6 flex-shrink-0 text-asecondary" />
    )
  }

  return (
    <div className={`${className}`}>
      <Card className="flex flex-col items-center rounded-xl border-2 border-aborder w-64 h-fit gap-4 p-0 overflow-hidden">
        <CardHeader className="flex flex-col items-center w-full h-62 p-0">
          <Image
            className="rounded-t-lg bg-aprimary object-cover group-hover:opacity-75"
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
        
        <CardContent className="flex flex-col w-full h-20 gap-2 px-4">
            {/* ONG associada (se disponível nos dados)
            {animal.ong && (
              <div className="w-full overflow-hidden">
                <span className="text-sm text-asecondary block overflow-hidden whitespace-nowrap">
                  {animal.ong.name}
                </span>
              </div>
            )}
            */}

            <div className="w-full overflow-hidden">
              <span className="text-sm text-asecondary block overflow-hidden whitespace-nowrap">
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

            <div>
              <p className="text-muted-foreground">Idade</p>
              <p>{animal.age} anos</p>
            </div>
        </CardContent>
        
        <CardFooter className="w-full p-4">
            <Link 
                href={`/animals/${animal.id}`}
                className="bg-aprimary rounded-xl border-2 border-asecondary py-1 w-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors text-center block"
            >
                Ver mais
            </Link>
        </CardFooter>
      </Card>
    </div>
  )
}