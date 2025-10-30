"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetAnimals } from "@/hooks/animal/useGetAnimals"
import { IAnimal } from "@/interfaces/animal"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { CreateAnimalSheet } from "../create-animal"
import { UpdateAnimal } from "../update-animal"
import { DeleteAnimal } from "../delete-animal"
import { PaginationFull } from "../../pagination"
import { LoaderCircle } from "lucide-react"

export default function ListAnimals() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = z.coerce.number().parse(searchParams.get("page") ?? "1")
  const per_page = z.coerce.number().parse(searchParams.get("per_page") ?? "10")
  const [debouncedSearchTerm] = useState<string>(searchParams.get("search") || "")

  const { data: animalsResponse, isLoading, isError } = useGetAnimals({
    page,
    per_page,
    search: debouncedSearchTerm,
  })

  const animals = animalsResponse?.data?.data || []
  const paginationData = animalsResponse?.data

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  if (isLoading) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen"><LoaderCircle className="h-12 w-12 text-aborder animate-spin"/></div>
  
  if (isError) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Erro ao carregar animais</div>

  return (
    <section className="flex flex-col mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-2xl font-medium">Gerenciar Animais</h2>
        <div className="flex justify-end">
          <CreateAnimalSheet />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Foto</TableHead>
            <TableHead>Nome</TableHead>
            <TableHead>Idade</TableHead>
            <TableHead>Genêro</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Porte</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {animals.map((animal: IAnimal) => (
            <TableRow key={animal.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={animal.image} alt={animal.name} />
                  <AvatarFallback>
                    {animal.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{animal.name}</TableCell>
              <TableCell>{animal.age} anos</TableCell>
              <TableCell>
                {animal.gender === "male" ? "Macho" : "Fêmea"}
              </TableCell>
              <TableCell>
                {animal.type === "dog"
                  ? "Cachorro"
                  : animal.type === "cat"
                  ? "Gato"
                  : "Outro"}
              </TableCell>
              <TableCell>
                {animal.size === "small"
                  ? "Pequeno"
                  : animal.size === "medium"
                  ? "Médio"
                  : "Grande"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <UpdateAnimal animal={animal} />
                  <DeleteAnimal animal={animal} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Adicionando a paginação */}
      {paginationData && (
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
    </section>
  )
}