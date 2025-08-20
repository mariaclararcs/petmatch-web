import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

import { handlePaginate } from "@/lib/utils"

import { Button } from "../ui/button"

export interface PaginationProps {
  pageIndex: number
  totalCount: number
  perPage: number
  totalPages: number
  hasNextPage: boolean
  hasPreviousPage: boolean
  onPageChange: (index: number) => void
}

export function PaginationFull({
  pageIndex,
  totalCount,
  totalPages,
  hasNextPage,
  hasPreviousPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full md:items-center md:justify-between">
      <span className="text-sm text-muted-foreground">Total de {totalCount} item(s)</span>

      <div className="flex justify-between md:justify-start items-center gap-6 lg:gap-8">
        <div className="text-sm font-medium">
          Página {pageIndex} de {totalPages}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-1"
            onClick={() => onPageChange(1)}
            disabled={!hasPreviousPage}
          >
            <ChevronsLeft className="h-4 w-4" />
            <span className="sr-only">Primeira página</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-1"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={!hasPreviousPage}
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Página anterior</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-1"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={!hasNextPage}
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Próxima página</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            className="h-8 w-8 p-1"
            onClick={() => onPageChange(totalPages)}
            disabled={!hasNextPage}
          >
            <ChevronsRight className="h-4 w-4" />
            <span className="sr-only">Última página</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export function PaginationShorty({ pageIndex, totalCount, perPage = 20 }: PaginationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pages = Math.ceil(totalCount / perPage) || 1

  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        className="h-8 w-8 p-1"
        onClick={() => handlePaginate(pageIndex - 1, searchParams, router)}
        disabled={pageIndex === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      <span className="whitespace-nowrap">
        {pageIndex} / {pages}
      </span>

      <Button
        type="button"
        variant="outline"
        className="h-8 w-8 p-1"
        onClick={() => handlePaginate(pageIndex + 1, searchParams, router)}
        disabled={pageIndex === pages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  )
}
