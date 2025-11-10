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
import LoadingComponent from "@/components/loading"

export default function ListAnimals() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = z.coerce.number().parse(searchParams.get("page") ?? "1")
  const per_page = z.coerce.number().parse(searchParams.get("per_page") ?? "20")
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

  if (isLoading) return <LoadingComponent />
  
  if (isError) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Erro ao carregar animais</div>

  return (
    <section className="flex flex-col mx-auto gap-6 px-14 py-6 xl:py-8 min-h-screen">
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-2xl font-medium">Gerenciar Animais</h2>
        <div className="flex justify-end">
          <CreateAnimalSheet />
        </div>
      </div>

      {/* Container com overflow para a tabela - igual ao das ONGs */}
      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {/* Defina larguras fixas para cada coluna */}
              <TableHead className="w-[80px] min-w-[80px] max-w-[80px] font-semibold text-center">Foto</TableHead>
              <TableHead className="w-[150px] min-w-[150px] max-w-[150px] font-semibold">Nome</TableHead>
              <TableHead className="w-[200px] min-w-[200px] max-w-[200px] font-semibold">ONG</TableHead>
              <TableHead className="w-[80px] min-w-[80px] max-w-[80px] font-semibold">Idade</TableHead>
              <TableHead className="w-[100px] min-w-[100px] max-w-[100px] font-semibold">Genêro</TableHead>
              <TableHead className="w-[120px] min-w-[120px] max-w-[120px] font-semibold">Tipo</TableHead>
              <TableHead className="w-[100px] min-w-[100px] max-w-[100px] font-semibold">Porte</TableHead>
              <TableHead className="w-[120px] min-w-[120px] max-w-[120px] font-semibold text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {animals.map((animal: IAnimal) => (
              <TableRow key={animal.id} className="hover:bg-muted/50">
                {/* Aplica as mesmas classes de largura nas células */}
                <TableCell className="w-[80px] min-w-[80px] max-w-[80px] text-center">
                  <Avatar className="h-10 w-10 mx-auto">
                    <AvatarImage src={animal.image} alt={animal.name} />
                    <AvatarFallback className="text-xs">
                      {animal.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                <TableCell className="w-[150px] min-w-[150px] max-w-[150px] truncate" title={animal.name}>
                  {animal.name}
                </TableCell>
                <TableCell className="w-[200px] min-w-[200px] max-w-[200px] truncate" title={animal.ong?.name_institution || "N/A"}>
                  {animal.ong?.name_institution || "N/A"}
                </TableCell>
                <TableCell className="w-[80px] min-w-[80px] max-w-[80px]">
                  {animal.age} anos
                </TableCell>
                <TableCell className="w-[100px] min-w-[100px] max-w-[100px]">
                  {animal.gender === "male" ? "Macho" : "Fêmea"}
                </TableCell>
                <TableCell className="w-[120px] min-w-[120px] max-w-[120px]">
                  {animal.type === "dog"
                    ? "Cachorro"
                    : animal.type === "cat"
                    ? "Gato"
                    : "Outro"}
                </TableCell>
                <TableCell className="w-[100px] min-w-[100px] max-w-[100px]">
                  {animal.size === "small"
                    ? "Pequeno"
                    : animal.size === "medium"
                    ? "Médio"
                    : "Grande"}
                </TableCell>
                <TableCell className="w-[120px] min-w-[120px] max-w-[120px]">
                  <div className="flex gap-2 justify-center">
                    <UpdateAnimal animal={animal} />
                    <DeleteAnimal animal={animal} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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