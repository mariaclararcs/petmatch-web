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
} from "@/components/ui/dialog" // Importe todos do mesmo lugar

interface UpdateAnimalProps {
  animal: IAnimal
}

export function UpdateAnimal({ animal }: UpdateAnimalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10">
          <DialogTitle>Atualizar cadastro do animal</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <UpdateAnimalForm animal={animal} />
        </div>
      </DialogContent>
    </Dialog>
  )
}