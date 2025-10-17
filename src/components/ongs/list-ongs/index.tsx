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
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { PaginationFull } from "../../pagination"

export default function ListOngs() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = z.coerce.number().parse(searchParams.get("page") ?? "1")
  const per_page = z.coerce.number().parse(searchParams.get("per_page") ?? "12")
  const [debouncedSearchTerm] = useState<string>(searchParams.get("search") || "")

  const { data: ongsResponse, isLoading, isError } = useGetOngs({
    page,
    per_page,
    search: debouncedSearchTerm,
  })

  const ongs = ongsResponse?.data || []
  console.log(ongsResponse)
  const paginationData = ongsResponse?.data

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  if (isLoading) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Carregando...</div>

  if (isError) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Erro ao carregar ONGs</div>

  return (
    <section className="flex flex-col mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">
      <h2 className="text-2xl font-medium">Gerenciar ONGs</h2>

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
              <TableCell className="overflow-hidden whitespace-nowrap">{ong.address}</TableCell>
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

      {/* Paginação */}
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