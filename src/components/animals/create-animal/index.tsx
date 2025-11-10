import { Button } from "@/components/ui/button"
import { CreateAnimalForm } from "./form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export function CreateAnimalSheet() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Cadastrar</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[100vw] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10">
          <DialogTitle>Cadastre um animal</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <CreateAnimalForm />
        </div>
      </DialogContent>
    </Dialog>
  )
}