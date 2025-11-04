"use client"

import { useState } from "react"
import { useGetAdoptions } from "@/hooks/adoption/useGetAdoptions"
import { IAdoption } from "@/interfaces/adoption"
import { PaginationFull } from "@/components/pagination"

const formatDate = (date: Date | string) => {
  if (typeof date === 'string') {
    return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
  }
  return new Intl.DateTimeFormat('pt-BR').format(date)
}

const formatStatus = (status: string) => {
  const statusMap: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendente', color: 'bg-yellow-100 text-yellow-800' },
    approved: { label: 'Aprovada', color: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejeitada', color: 'bg-red-100 text-red-800' },
  }
  
  const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800' }
  
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusInfo.color}`}>
      {statusInfo.label}
    </span>
  )
}

export default function ListAdopters() {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const itemsPerPage = 10

  const { data: adoptionsResponse, isLoading, isError } = useGetAdoptions({
    page: currentPage,
    per_page: itemsPerPage,
    search: searchTerm || undefined,
  })

  const adoptions = adoptionsResponse?.data?.data || []
  const pagination = adoptionsResponse?.data

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-lg text-red-600">Erro ao carregar solicitações de adoção.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 max-h-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-medium mb-4">Solicitações de Adoção</h2>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar por nome do adotante ou animal..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="w-full max-w-md rounded-xl border-2 border-aborder px-4 py-2"
          />
        </div>
      </div>

      {adoptions.length === 0 ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-lg text-gray-600">Nenhuma solicitação de adoção encontrada.</div>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300 rounded-xl">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Adotante</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Animal</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Status</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Data da Solicitação</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold">Data de Criação</th>
                </tr>
              </thead>
              <tbody>
                {adoptions.map((adoption: IAdoption) => (
                  <tr key={adoption.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3">
                      {adoption.adopter?.name || `ID: ${adoption.adopter_id.substring(0, 8)}...`}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {adoption.animal?.name || `ID: ${adoption.animal_id.substring(0, 8)}...`}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {formatStatus(adoption.status)}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {adoption.request_date ? formatDate(adoption.request_date) : '-'}
                    </td>
                    <td className="border border-gray-300 px-4 py-3">
                      {adoption.created_at ? formatDate(adoption.created_at) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.last_page > 1 && (
            <div className="mt-6">
              <PaginationFull
                pageIndex={currentPage}
                totalCount={pagination.total}
                perPage={pagination.per_page}
                totalPages={pagination.last_page}
                hasNextPage={!!pagination.next_page_url}
                hasPreviousPage={!!pagination.prev_page_url}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  )
}
