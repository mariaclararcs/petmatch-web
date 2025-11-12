import { Button } from "@/components/ui/button"
import { CreateAnimalForm } from "./form"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"

export function CreateAnimalSheet() {
  const [isOpen, setIsOpen] = useState(false)

  const handleSuccess = () => {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <Button>Cadastrar</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-[100vw] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10">
          <DialogTitle>Cadastre um animal</DialogTitle>
        </DialogHeader>
        <div className="overflow-y-auto max-h-[calc(90vh-100px)]">
          <CreateAnimalForm onSuccess={handleSuccess} />
        </div>
      </DialogContent>
    </Dialog>
  )
}