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
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { PaginationFull } from "../../pagination"
import { UpdateOng } from "../update-ong"
import { DeleteOng } from "../delete-ong"
import LoadingComponent from "@/components/loading"

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

  const ongs = ongsResponse?.data?.data || ongsResponse?.data || []
  
  const paginationData = ongsResponse?.data?.data 
    ? ongsResponse?.data
    : ongsResponse?.data

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  if (isLoading) return <LoadingComponent />

  if (isError) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Erro ao carregar ONGs</div>

  return (
    <section className="flex flex-col mx-auto gap-6 px-14 py-6 xl:py-8 min-h-screen">
      <h2 className="text-2xl font-medium">Gerenciar ONGs</h2>

      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] min-w-[200px] max-w-[200px] font-semibold">Nome Instituição</TableHead>
              <TableHead className="w-[180px] min-w-[180px] max-w-[180px] font-semibold">Nome do Responsável</TableHead>
              <TableHead className="w-[140px] min-w-[140px] max-w-[140px] font-semibold">CNPJ</TableHead>
              <TableHead className="w-[120px] min-w-[120px] max-w-[120px] font-semibold">Telefone</TableHead>
              <TableHead className="w-[250px] min-w-[250px] max-w-[250px] font-semibold">Endereço</TableHead>
              <TableHead className="w-[120px] min-w-[120px] max-w-[120px] text-center font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ongs.map((ong: IOng) => (
              <TableRow key={ong.id} className="hover:bg-muted/50">
                <TableCell className="w-[200px] min-w-[200px] max-w-[200px] truncate" title={ong.name_institution}>
                  {ong.name_institution}
                </TableCell>
                <TableCell className="w-[180px] min-w-[180px] max-w-[180px] truncate" title={ong.name_responsible}>
                  {ong.name_responsible}
                </TableCell>
                <TableCell className="w-[140px] min-w-[140px] max-w-[140px] truncate" title={ong.cnpj}>
                  {ong.cnpj}
                </TableCell>
                <TableCell className="w-[120px] min-w-[120px] max-w-[120px] truncate" title={ong.phone}>
                  {formatPhoneNumber(ong.phone)} {/* ← Telefone formatado */}
                </TableCell>
                <TableCell className="w-[250px] min-w-[250px] max-w-[250px] truncate" title={ong.address}>
                  {ong.address}
                </TableCell>
                <TableCell className="w-[120px] min-w-[120px] max-w-[120px]">
                  <div className="flex gap-2 justify-center">
                    {/* Componente de edição */}
                    <UpdateOng ong={ong} />
                    
                    {/* Componente de delete - agora seguindo o padrão do Animal */}
                    <DeleteOng ong={ong} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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