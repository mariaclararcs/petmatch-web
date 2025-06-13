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
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar"
import { CreateAnimalSheet } from "../create-animal"
import { UpdateAnimal } from "../update-animal"
import { DeleteAnimal } from "../delete-animal"

export default function ListAnimals() {
  const searchParams = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get("page") ?? "1")
  const per_page = z.coerce.number().parse(searchParams.get("per_page") ?? "10")
  const [debouncedSearchTerm] = useState<string>(searchParams.get("search") || "")

  const { data: animalsResponse } = useGetAnimals({
    page,
    per_page,
    search: debouncedSearchTerm,
  })

  const animals = animalsResponse?.data || []

  return (
    <section>
      <div className="flex justify-end mt-10">
        <CreateAnimalSheet />
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
    </section>
  )
}
