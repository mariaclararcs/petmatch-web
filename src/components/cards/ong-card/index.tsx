"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { IOng } from "@/interfaces/ong"
import { MapPin, Phone } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"

interface CardOngProps {
  ong: IOng
  className?: string
}

// Função de formatação de telefone
const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ''
  
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Aplica a formatação baseada no tamanho do número
  if (cleaned.length === 11) {
    // Formato para celular: (11) 99999-9999
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`
  } else if (cleaned.length === 10) {
    // Formato para telefone fixo: (11) 9999-9999
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`
  } else {
    // Retorna o número original se não for um formato conhecido
    return phone
  }
}

export default function CardOng({ ong, className }: CardOngProps) {
  const formattedPhone = formatPhoneNumber(ong.phone)

  return (
    <div className={`${className}`}>
      <Card className="flex flex-col items-center rounded-xl border-2 border-aborder w-64 h-fit gap-4 p-0 overflow-hidden">
        <CardHeader className="flex flex-col items-center w-full h-52 p-0">
          <Image
            className="rounded-t-lg bg-aprimary object-cover group-hover:opacity-75 w-full h-52"
            alt={ong.name_institution}
            src={ong.ong_image || '/placeholder-animal.jpg'}
            width={248}
            height={248}
            style={{
              width: '100%',
              height: '208px'
            }}
            unoptimized
          />
        </CardHeader>
        
        <CardContent className="flex flex-col w-full h-fit gap-2 px-4">
          <CardTitle className="text-lg overflow-hidden whitespace-nowrap text-ellipsis">
            {ong.name_institution}
          </CardTitle>
          <div className="min-h-[40px] max-h-[40px]">
            <span 
              className="text-muted-foreground text-sm line-clamp-2 overflow-hidden text-ellipsis break-words"
              title={ong.address} // Mostra o endereço completo no hover
            >
              {ong.address}
            </span>
          </div>
        </CardContent>
        
        <CardFooter className="w-full px-4 pb-4">
          <Link 
            href={`ongs/perfil/${ong.id}`}
            className="bg-aprimary rounded-xl border-2 border-asecondary py-1 w-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors text-center block"
          >
            Detalhes
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}