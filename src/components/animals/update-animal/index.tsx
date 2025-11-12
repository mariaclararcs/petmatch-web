import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"
import { UpdateAnimalForm } from "./form"
import { IAnimal } from "@/interfaces/animal"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"

interface UpdateAnimalProps {
  animal: IAnimal
}

export function UpdateAnimal({ animal }: UpdateAnimalProps) {
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
          title="Editar Animal"
          className="h-8 w-8 p-0 hover:bg-amuted hover:border-amuted hover:text-aforeground"
        >
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[100vw]">
        <DialogHeader className="sticky top-0 z-10">
          <DialogTitle>Atualizar cadastro do animal</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <UpdateAnimalForm animal={animal} onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}