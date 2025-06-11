import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { CreateAnimalForm } from "./form";

export function CreateAnimalSheet() {
  return (
    <Sheet>
      <SheetTrigger>
        <Button>Criar</Button>
      </SheetTrigger>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Crie um animal</SheetTitle>
        </SheetHeader>
        <div className="py-4">
          <CreateAnimalForm />
        </div>
      </SheetContent>
    </Sheet>
  );
}
