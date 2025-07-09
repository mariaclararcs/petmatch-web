import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Pencil } from "lucide-react";
import { UpdateAnimalForm } from "./form";
import { IAnimal } from "@/interfaces/animal";

interface UpdateAnimalProps {
  animal: IAnimal
}

export function UpdateAnimal({ animal }: UpdateAnimalProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Atualizar Animal</SheetTitle>
        </SheetHeader>
        <UpdateAnimalForm animal={animal} />
      </SheetContent>
    </Sheet>
  )
} 