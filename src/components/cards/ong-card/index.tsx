"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IOng } from "@/interfaces/ong"
import { MapPin, Phone } from 'lucide-react'
import Link from "next/link"

interface CardOngProps {
  ong: IOng
  className?: string
}

export default function CardOng({ ong, className }: CardOngProps) {
  return (
    <div className={`${className}`}>
        <Card className="flex flex-col items-center rounded-xl border-2 border-aborder w-62 h-fit gap-4 p-4 overflow-hidden">
            <CardHeader className="flex flex-col w-full p-0 overflow-hidden">
                <CardTitle className="text-lg overflow-hidden whitespace-nowrap">
                    {ong.name_institution}
                </CardTitle>
            </CardHeader>
        
            <CardContent className="flex flex-col w-full h-40 gap-4">
                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row items-center gap-2 min-w-0 overflow-hidden">
                        <MapPin />
                        <span>Endereço</span>
                    </div>
                    <span className="text-muted-foreground">{ong.address}</span>
                </div>

                <div className="flex flex-col w-full gap-2">
                    <div className="flex flex-row items-center gap-2 min-w-0 flex-1 overflow-hidden">
                        <Phone />
                        <span>Telefone</span>
                    </div>
                    <span className="text-muted-foreground">{ong.phone}</span>
                </div>
            </CardContent>
            
            <CardFooter className="w-full">
                <Link 
                    href="#"
                    className="bg-aprimary rounded-xl border-2 border-asecondary py-1 w-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors text-center block"
                >
                    Detalhes
                </Link>
            </CardFooter>
        </Card>
    </div>
  )
}