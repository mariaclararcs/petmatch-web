import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { UpdateOngForm } from "./form"
import { IOng } from "@/interfaces/ong"
import { useState } from "react"

interface UpdateOngProps {
  ong: IOng
}

export function UpdateOng({ ong }: UpdateOngProps) {
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
          title="Editar ONG"
          className="h-8 w-8 p-0 hover:bg-amuted hover:border-amuted hover:text-aforeground"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[100vw] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10">
          <DialogTitle>Atualizar cadastro da ONG</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <UpdateOngForm ong={ong} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}