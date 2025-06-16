import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetOngs } from "@/hooks/ongs/useGetOngs"
import { IOng } from "@/interfaces/ong"
import { Pencil, Trash2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"

export default function ListOngs() {
  const searchParams = useSearchParams()
  const page = z.coerce.number().parse(searchParams.get("page") ?? "1")
  const per_page = z.coerce.number().parse(searchParams.get("per_page") ?? "10")
  const [debouncedSearchTerm] = useState<string>(searchParams.get("search") || "")

  const { data: ongsResponse } = useGetOngs({
    page,
    per_page,
    search: debouncedSearchTerm,
  })

  const ongs = ongsResponse?.data?.data || []

  return (
    <section className="flex flex-col mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome Instituição</TableHead>
            <TableHead>Nome do Responsável</TableHead>
            <TableHead>CNPJ</TableHead>
            <TableHead>Telefone</TableHead>
            <TableHead>Endereço</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {ongs.map((ong: IOng) => (
            <TableRow key={ong.id}>
              <TableCell>{ong.name_institution}</TableCell>
              <TableCell>{ong.name_responsible}</TableCell>
              <TableCell>{ong.cnpj}</TableCell>
              <TableCell>{ong.phone}</TableCell>
              <TableCell>{ong.address}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  )
}