import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
  import Image from "next/image"
  import Link from "next/link"
  import { Dog } from 'lucide-react'
  
  export default function CardP() {
    return (
      <div>
        <Card className="flex flex-col items-center rounded-xl border-2 border-border w-fit h-fit gap-2">
          <CardHeader className="flex flex-col items-center w-full">
            <Image
              className="rounded-lg w-44 h-44 bg-primary object-cover"
              alt="Animal image" 
              src="/images/login-ong.svg"
              width={176}
              height={176}
            />
          </CardHeader>
          
          <CardContent className="w-full items-center">
            <div className="flex items-center gap-2">
              <Dog className="h-6 w-6" />
              <CardTitle className="text-lg">Estela</CardTitle>
            </div>
            <span className="text-md text-muted-foreground">fêmea</span>
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