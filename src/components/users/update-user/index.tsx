import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UpdateUserForm } from "./form"
import { IUser } from "@/interfaces/user"
import { useState } from "react"

interface UpdateUserProps {
  user: IUser
}

export function UpdateUser({ user }: UpdateUserProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline" 
          size="sm"
          title="Editar Usuário"
          className="h-8 w-8 p-0 hover:bg-amuted hover:border-amuted hover:text-aforeground"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[100vw]">
        <DialogHeader className="sticky top-0 z-10">
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <UpdateUserForm user={user} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}