import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { MapPin, Phone } from "lucide-react"
import Image from "next/image"
import CardM from "@/components/cards/animal-card/card-m"
import { IAnimal } from "@/interfaces/animal"
import { PaginationFull } from "@/components/pagination"
import { useSearchParams, useParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { useGetAllAnimals } from "@/hooks/animal/useGetAllAnimals"
import { useGetOng } from "@/hooks/ongs/useGetOng"

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

export default function ProfileOng() {
    const searchParams = useSearchParams()
    const params = useParams()
    const ongId = params.id as string
    
    // Buscar dados da ONG
    const { 
        data: ongResponse, 
        isLoading: isLoadingOng, 
        isError: isErrorOng 
    } = useGetOng(ongId)
    
    const ong = ongResponse?.data

    // Definindo itens por página
    const itemsPerPage = 12
    const currentPage = z.coerce.number().parse(searchParams.get("page") ?? "1")
    const [debouncedSearchTerm] = useState<string>(searchParams.get("search") || "")

    const {
        data: animalsResponse,
        isLoading: isLoadingAnimals,
        isError: isErrorAnimals,
    } = useGetAllAnimals({
        page: currentPage,
        per_page: itemsPerPage,
        search: debouncedSearchTerm,
        ong_id: ongId // Filtra animais apenas desta ONG
    })

    const animals = animalsResponse?.data?.data || []
    const paginationData = animalsResponse?.data

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set("page", page.toString())
        window.history.pushState({}, '', `?${params.toString()}`)
    }

    const isLoading = isLoadingOng || isLoadingAnimals
    const isError = isErrorOng || isErrorAnimals

    // Formata o telefone da ONG
    const formattedPhone = ong ? formatPhoneNumber(ong.phone) : ''

    if (isLoading) { 
        return (
            <div className="flex flex-col gap-12 mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-6 xl:py-8 min-h-screen">
                <div className="flex flex-col mt-4 gap-10">
                    <h2 className="text-2xl font-medium">Perfil da ONG</h2>

                    <div className="flex flex-row gap-8">
                        <Avatar className="h-38 w-38 rounded-full">
                            <div className="h-38 w-38 rounded-full bg-gray-200 animate-pulse"/>
                        </Avatar>

                        <div className="flex flex-col justify-center py-4 gap-4 w-full">
                            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"/>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-row items-center gap-2 text-lg overflow-hidden">
                                    <MapPin />
                                    <div className="h-6 w-80 bg-gray-200 animate-pulse rounded"/>
                                </div>
                                <div className="flex flex-row items-center gap-2 text-lg overflow-hidden">
                                    <Phone />
                                    <div className="h-6 w-80 bg-gray-200 animate-pulse rounded"/>
                                </div>
                                <div className="flex flex-row items-center gap-2 text-lg overflow-hidden">
                                    <div className="h-6 w-80 bg-gray-200 animate-pulse rounded"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col w-full mx-auto py-6 xl:py-8">
                        <h2 className="text-xl font-medium">Animais abrigados</h2>

                        {/* Área de listagem de cards */}
                        <div className="my-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                            {[...Array(itemsPerPage)].map((_, i) => (
                                <div key={i} className="animate-pulse">
                                <div className="aspect-square w-full rounded-xl bg-border lg:h-96 lg:w-62" />
                                <div className="mt-4 space-y-2"/>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isError) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Erro ao carregar ONG</div>

    if (!ong) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">ONG não encontrada</div>

    return (
        <div className="flex flex-col mx-auto px-4 sm:px-8 md:px-12 lg:px-20 py-6 xl:py-8 min-h-screen">
            <div className="flex flex-col mt-4 gap-10">
                <h2 className="text-2xl font-medium">Perfil da ONG</h2>

                <div className="flex flex-row gap-8">
                    <Avatar className="h-38 w-38 rounded-full">
                        <AvatarFallback className="h-38 w-38 rounded-xg">
                            <Image
                                src={ong.ong_image || "/images/default-avatar.jpg"}
                                alt={ong.name_institution ? `${ong.name_institution} avatar` : "Default avatar"}
                                width={152}
                                height={152}
                                className="size-full object-cover rounded-full"
                                priority
                                unoptimized
                            />
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col justify-center py-4 gap-4 w-full">
                        <h3 className="text-2xl font-semibold">
                            {ong.name_institution}
                        </h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex flex-row items-center gap-2 text-lg overflow-hidden">
                                <MapPin />
                                <span className="text-muted-foreground">
                                    {ong.address}
                                </span>
                            </div>
                            <div className="flex flex-row items-center gap-2 text-lg overflow-hidden">
                                <Phone />
                                <span className="text-muted-foreground">
                                    {formattedPhone}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col w-full mx-auto pb-6 xl:pb-8">
                    <h2 className="text-xl font-medium">Animais abrigados</h2>

                    {/* Área de listagem de cards */}
                    <div className="my-6 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
                        {animals.length > 0 ? (
                            animals.map((animal: IAnimal) => (
                                <div key={animal.id} className="group">
                                    <CardM key={animal.id} animal={animal} className="w-full" />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-8">
                                <p className="text-muted-foreground">
                                    Nenhum animal encontrado nesta ONG
                                </p>
                            </div>
                        )}
                    </div>
                    
                    {paginationData && paginationData.last_page > 1 && (
                        <PaginationFull
                            pageIndex={paginationData.current_page}
                            totalCount={paginationData.total}
                            perPage={paginationData.per_page}
                            totalPages={paginationData.last_page}
                            hasNextPage={!!paginationData.next_page_url}
                            hasPreviousPage={!!paginationData.prev_page_url}
                            onPageChange={handlePageChange}
                        />
                    )}
                </div>
            </div>
        </div>
    )
}