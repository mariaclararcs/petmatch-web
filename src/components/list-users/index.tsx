import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useGetUsers } from "@/hooks/users/useGetUsers"
import { IUser } from "@/interfaces/user"
import { Pencil, Trash2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"
import { z } from "zod"
import { PaginationFull } from "../pagination"

export default function ListUsers() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = z.coerce.number().parse(searchParams.get("page") ?? "1")
  const per_page = z.coerce.number().parse(searchParams.get("per_page") ?? "12")
  const [debouncedSearchTerm] = useState<string>(searchParams.get("search") || "")

  const { data: usersResponse, isLoading, isError } = useGetUsers({
    page,
    per_page,
    search: debouncedSearchTerm,
  })

  const users = usersResponse?.data?.data || []
  const paginationData = usersResponse?.data

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", page.toString())
    router.push(`?${params.toString()}`)
  }

  if (isLoading) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Carregando...</div>

  if (isError) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Erro ao carregar usuários</div>

  return (
    <section className="flex flex-col mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>E-mail</TableHead>
            <TableHead>Tipo de usuário</TableHead>
            <TableHead>Criado em</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((user: IUser) => (
            <TableRow key={user.id}>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.type_user}</TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
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