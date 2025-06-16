"use client"

import CardOng from "@/components/cards/ong-card"
import { useGetOngs } from "@/hooks/ongs/useGetOngs"
import { IOng } from "@/interfaces/ong"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { PaginationFull } from "../pagination"

export default function Ongs() {
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
        <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 max-h-auto">
            <div className="flex flex-row justify-center gap-10 mb-8">
                {/* Área de listagem de cards */}
                <div className="flex flex-col mt-4 w-3/4">
                <h2 className="text-2xl font-medium">ONGs Cadastradas</h2>

                <div className="mt-6 grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
                    {ongs.map((ong: IOng) => (
                        <div key={ong.id} className="group">
                        <CardOng key={ong.id} ong={ong} className="w-full" />
                    </div>
                    ))}
                </div>
                </div>
            </div>
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
        </div>
    )
}
