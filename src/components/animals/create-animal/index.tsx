import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { CreateAnimalForm } from "./form"

export function CreateAnimalSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button>Cadastrar</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Cadastre um animal</SheetTitle>
        </SheetHeader>
          <CreateAnimalForm />
      </SheetContent>
    </Sheet>
  )
}
