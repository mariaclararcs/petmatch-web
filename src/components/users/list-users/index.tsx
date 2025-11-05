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
import { PaginationFull } from "../../pagination"
import EditUserModal from "../edit-user-modal"
import DeleteUserModal from "../delete-user-modal"
import LoadingComponent from "../../loading"

export default function ListUsers() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const page = z.coerce.number().parse(searchParams.get("page") ?? "1")
  const per_page = z.coerce.number().parse(searchParams.get("per_page") ?? "12")
  const [debouncedSearchTerm] = useState<string>(searchParams.get("search") || "")
  
  // Estados para controlar os modais
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null)

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

  // Funções para abrir os modais
  const handleEditClick = (user: IUser) => {
    setSelectedUser(user)
    setEditModalOpen(true)
  }

  const handleDeleteClick = (user: IUser) => {
    setSelectedUser(user)
    setDeleteModalOpen(true)
  }

  const handleCloseModals = () => {
    setEditModalOpen(false)
    setDeleteModalOpen(false)
    setSelectedUser(null)
  }

  const formatTypeUser = (type: string) => {
    switch(type?.toLowerCase()) {
      case 'admin': return 'Administrador'
      case 'ong': return 'ONG'
      case 'adopter': return 'Adotante'
      default: return type
    }
  }

  if (isLoading) return <LoadingComponent />

  if (isError) return <div className="flex flex-col justify-center items-center mx-auto gap-6 px-20 py-6 xl:py-8 min-h-screen">Erro ao carregar usuários</div>

  return (
    <section className="flex flex-col mx-auto gap-6 px-14 py-6 xl:py-8 min-h-screen">
      <h2 className="text-2xl font-medium">Gerenciar Usuários</h2>

      {/* Container com overflow para a tabela */}
      <div className="border rounded-lg overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              {/* Defina larguras fixas para cada coluna */}
              <TableHead className="w-[200px] min-w-[200px] max-w-[200px] font-semibold">Nome</TableHead>
              <TableHead className="w-[200px] min-w-[200px] max-w-[200px] font-semibold">E-mail</TableHead>
              <TableHead className="w-[140px] min-w-[140px] max-w-[140px] font-semibold">Tipo de Usuário</TableHead>
              <TableHead className="w-[120px] min-w-[120px] max-w-[120px] font-semibold">Criado Em</TableHead>
              <TableHead className="w-[120px] min-w-[120px] max-w-[120px] text-center font-semibold">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user: IUser) => (
              <TableRow key={user.id} className="hover:bg-muted/50">
                {/* Aplica as mesmas classes de largura nas células */}
                <TableCell className="w-[200px] min-w-[200px] max-w-[200px] truncate" title={user.name}>
                  {user.name}
                </TableCell>
                <TableCell className="w-[180px] min-w-[180px] max-w-[180px] truncate" title={user.email}>
                  {user.email}
                </TableCell>
                <TableCell className="w-[140px] min-w-[140px] max-w-[140px] truncate" title={user.type_user}>
                  {formatTypeUser(user.type_user)}
                </TableCell>
                <TableCell className="w-[120px] min-w-[120px] max-w-[120px] truncate" title={user.created_at}>
                  {new Date(user.created_at).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell className="w-[120px] min-w-[120px] max-w-[120px]">
                  <div className="flex gap-2 justify-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditClick(user)}
                      title="Editar Usuário"
                      className="h-8 w-8 p-0 hover:bg-amuted hover:border-amuted hover:text-aforeground"
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteClick(user)}
                      title="Deletar Usuário"
                      className="h-8 w-8 p-0 hover:bg-amuted hover:border-amuted hover:text-red-600"
                    >
                      <Trash2 className="h-3 w-3 text-red-600" />
                    </Button>
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

      {/* Modais */}
      <EditUserModal
        isOpen={editModalOpen}
        onClose={handleCloseModals}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={deleteModalOpen}
        onClose={handleCloseModals}
        user={selectedUser}
      />
    </section>
  )
}