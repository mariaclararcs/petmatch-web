"use client"

import { useGetAnimal } from "@/hooks/animal/useGetAnimal"
import Image from "next/image"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { AlarmClock, CalendarFold, MapPinHouse, NotebookPen, PawPrint, Ruler, VenusAndMars } from "lucide-react"
import Link from "next/link"
import LoadingComponent from "@/components/loading"

const getSizeInPortuguese = (size: string) => {
    const sizes = {
        small: "Pequeno",
        medium: "Médio",
        large: "Grande"
    }
    return sizes[size as keyof typeof sizes] || size
}

export default function AnimalInfo() {
    const params = useParams()
    const animalId = params.id as string

    const { data: animalResponse, isLoading, isError } = useGetAnimal(animalId)
    const animal = animalResponse?.data

    if (isLoading) return <LoadingComponent />

    if (isError) {
        return (
            <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 min-h-screen">
                <p className="text-red-500">Erro ao carregar informações do animal</p>
            </div>
        )
    }

    if (!animal) {
        return (
            <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 min-h-screen">
                <p>Animal não encontrado</p>
            </div>
        )
    }

    return (
        <div className="flex flex-col mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen mb-4">
            <h2 className="text-2xl font-medium">Informações do Animal</h2>
            <div className="flex flex-row justify-center gap-10">
                <div className="flex flex-col w-100 h-120">
                    <Image
                        className="rounded-lg bg-aprimary object-cover"
                        alt={animal.name}
                        src={animal.image || '/default-avatar.jpg'}
                        width={400}
                        height={480}
                        style={{
                            width: "400px",
                            height: "480px",
                        }}
                        unoptimized
                    />
                    <Link 
                        href={`/formulario-adocao/${animal.id}`}
                        className="bg-aprimary rounded-xl border-2 border-asecondary my-6 py-2 w-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors text-center block"
                    >
                        Formulário de Adoção
                    </Link>
                </div>

                <div className="flex flex-col w-fit">
                    <div className="space-y-6">
                        <h2 className="text-3xl font-semibold">{animal.name}</h2>
                        <div className="grid grid-cols-2 space-x-10 space-y-6">
                            <div className="flex flex-col gap-1">
                                <span className="flex flex-row items-center gap-2 text-xl font-medium">
                                    <AlarmClock />
                                    Idade:
                                </span>
                                <span className="text-lg text-muted-foreground ml-8">
                                    {animal.age === 1 ? "1 ano" : `${animal.age} anos`}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex flex-row items-center gap-2 text-xl font-medium">
                                    <VenusAndMars />
                                    Sexo:
                                </span>
                                <span className="text-lg text-muted-foreground ml-8">
                                    {animal.gender === "male" ? "Macho" : "Fêmea"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex flex-row items-center gap-2 text-xl font-medium">
                                    <PawPrint />
                                    Tipo:
                                </span>
                                <span className="text-lg text-muted-foreground ml-8">
                                    {animal.type === "dog"
                                    ? "Cachorro"
                                    : animal.type === "cat"
                                    ? "Gato"
                                    : "Outro"}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex flex-row items-center gap-2 text-xl font-medium">
                                    <Ruler />
                                    Porte:
                                </span>
                                <span className="text-lg text-muted-foreground ml-8">
                                    {getSizeInPortuguese(animal.size)}
                                </span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex flex-row items-center gap-2 text-xl font-medium">
                                    <MapPinHouse />
                                    ONG:
                                </span>
                                <Link 
                                    href={`/ongs/perfil/${animal?.ong.id}`}
                                    className="text-lg text-muted-foreground ml-8 hover:cursor-pointer hover:underline">
                                    {animal.ong.name_institution}
                                </Link>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="flex flex-row items-center gap-2 text-xl font-medium">
                                    <CalendarFold />
                                    Data de Abrigo:
                                </span>
                                <span className="text-lg text-muted-foreground ml-8">
                                    {format(new Date(animal.shelter_date), "dd 'de' MMMM 'de' yyyy", {
                                        locale: ptBR,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="flex flex-row items-center gap-2 text-xl font-medium">
                            <NotebookPen />
                            Sobre o animal:
                        </span>
                        <span className="text-lg text-muted-foreground ml-8">
                            {animal.description}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}