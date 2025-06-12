'use client'

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface PaginationProps {
  currentPage: number
  totalPages: number
  className?: string
}

export function Pagination({ currentPage, totalPages, className }: PaginationProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  if (totalPages <= 1) return null

  return (
    <div className={`flex items-center justify-between font-bold ${className}`}>
      <Button
        variant="outline"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center justify-center rounded-xl border-2 border-border h-10 w-10 hover:bg-border hover:text-background transition-colors"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={3} />
      </Button>

      <div className="flex items-center gap-1">
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let pageNum
          if (totalPages <= 5) {
            pageNum = i + 1
          } else if (currentPage <= 3) {
            pageNum = i + 1
          } else if (currentPage >= totalPages - 2) {
            pageNum = totalPages - 4 + i
          } else {
            pageNum = currentPage - 2 + i
          }

          return (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              onClick={() => goToPage(pageNum)}
              className={
                currentPage === pageNum 
                  ? 'flex items-center rounded-xl border-2 border-secondary h-10 w-10 text-secondary font-bold hover:bg-secondary hover:text-background transition-colors' 
                  : 'flex items-center rounded-xl border-2 border-border bg-border text-background h-10 w-10 font-bold hover:bg-background hover:text-foreground transition-colors'
              }
            >
              {pageNum}
            </Button>
          )
        })}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <span className="mx-1">...</span>
        )}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <Button
            variant="outline"
            onClick={() => goToPage(totalPages)}
            className="flex items-center rounded-xl border-2 border-border h-10 w-10 font-bold hover:bg-border hover:text-background transition-colors"
          >
            {totalPages}
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center rounded-xl border-2 border-border h-10 w-10 hover:bg-border hover:text-background transition-colors"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={3} />
      </Button>
    </div>
  )
}