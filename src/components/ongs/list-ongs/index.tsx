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
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar" // IMPORT ADICIONADO

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

// Função de formatação de CNPJ
const formatCNPJ = (cnpj: string): string => {
  if (!cnpj) return ''
  
  // Remove todos os caracteres não numéricos
  const cleaned = cnpj.replace(/\D/g, '')
  
  // Aplica a formatação no formato 00.000.000/0000-00
  if (cleaned.length === 14) {
    return `${cleaned.substring(0, 2)}.${cleaned.substring(2, 5)}.${cleaned.substring(5, 8)}/${cleaned.substring(8, 12)}-${cleaned.substring(12)}`
  } else {
    // Retorna o CNPJ original se não tiver 14 dígitos
    return cnpj
  }
}

// Função para obter as iniciais do nome da instituição
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
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
              {/* Coluna Imagem da ONG - mesma largura dos usuários */}
              <TableHead className="w-[80px] min-w-[80px] max-w-[80px] font-semibold text-center">Foto</TableHead>
              {/* Ajustei as larguras das outras colunas para compensar a nova coluna */}
              <TableHead className="w-[180px] min-w-[180px] max-w-[180px] font-semibold">Nome Instituição</TableHead>
              <TableHead className="w-[120px] min-w-[120px] max-w-[120px] font-semibold">CNPJ</TableHead>
              <TableHead className="w-[100px] min-w-[100px] max-w-[100px] font-semibold">Telefone</TableHead>
              <TableHead className="w-[200px] min-w-[200px] max-w-[200px] font-semibold">Endereço</TableHead>
              <TableHead className="w-[120px] min-w-[120px] max-w-[120px] text-center font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ongs.map((ong: IOng) => (
              <TableRow key={ong.id} className="hover:bg-muted/50">
                {/* Coluna Imagem da ONG - mesma implementação dos usuários */}
                <TableCell className="w-[80px] min-w-[80px] max-w-[80px] text-center">
                  <Avatar className="h-10 w-10 mx-auto">
                    <AvatarImage 
                      src={ong.ong_image || ""} 
                      alt={ong.name_institution}
                      className="object-cover"
                    />
                    <AvatarFallback className="text-xs bg-gray-200">
                      {getInitials(ong.name_institution)}
                    </AvatarFallback>
                  </Avatar>
                </TableCell>
                
                {/* Aplica as mesmas classes de largura nas células (ajustadas) */}
                <TableCell className="w-[180px] min-w-[180px] max-w-[180px] truncate" title={ong.name_institution}>
                  {ong.name_institution}
                </TableCell>
                <TableCell className="w-[120px] min-w-[120px] max-w-[120px] truncate" title={ong.cnpj}>
                  {formatCNPJ(ong.cnpj)}
                </TableCell>
                <TableCell className="w-[100px] min-w-[100px] max-w-[100px] truncate" title={ong.phone}>
                  {formatPhoneNumber(ong.phone)}
                </TableCell>
                <TableCell className="w-[200px] min-w-[200px] max-w-[200px] truncate" title={ong.address}>
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

      {/* Paginação 
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
      */}
    </section>
  )
}