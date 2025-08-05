"use client"

import api from "@/app/services/api"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useGetOngs } from "@/hooks/ongs/useGetOngs"
import { useSheetContext } from "@/hooks/use-sheet-context"
import { IAnimal } from "@/interfaces/animal"
import { IOng } from "@/interfaces/ong"
import { queryClient } from "@/lib/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import Image from "next/image"

const GENDER_TYPES = [
  { label: "Macho", value: "male" },
  { label: "Fêmea", value: "female" },
] as const

const SIZE_TYPES = [
  { label: "Pequeno", value: "small" },
  { label: "Médio", value: "medium" },
  { label: "Grande", value: "large" },
] as const

const TYPE_TYPES = [
  { label: "Cachorro", value: "dog" },
  { label: "Gato", value: "cat" },
  { label: "Outro", value: "other" },
] as const

const animalFormSchema = z.object({
  ong_id: z.string().min(1, "Selecione uma ONG"),
  name: z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
  age: z.coerce.number().int().positive("Idade inválida"),
  gender: z.enum(["male", "female"]),
  type: z.enum(["dog", "cat", "other"]),
  size: z.enum(["small", "medium", "large"]),
  shelter_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida"),
  image: z.union([z.instanceof(File), z.string()]).optional(),
  description: z.string().max(500).optional(),
})

type AnimalFormValues = z.infer<typeof animalFormSchema>

interface UpdateAnimalFormProps {
  animal: IAnimal
}

export function UpdateAnimalForm({ animal }: UpdateAnimalFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const { setIsOpen } = useSheetContext()
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false) // Estado para controlar o dialog

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fieldChange: (value: any) => void) => {
    event.preventDefault()
    
    const fileReader = new FileReader()
    
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0]
      
      if (!file.type.includes('image')) {
        toast.error('Por favor, envie apenas imagens')
        return
      }
      
      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || ''
        setPreviewImage(imageDataUrl)
      }
      
      fileReader.readAsDataURL(file)
      fieldChange(file)
    }
  }

  const defaultValues = {
    ong_id: animal?.ong_id || "",
    name: animal?.name || "",
    age: animal?.age || 1,
    gender: (animal?.gender as "male" | "female") || "male",
    type: (animal?.type as "dog" | "cat" | "other") || "dog",
    size: (animal?.size as "small" | "medium" | "large") || "medium",
    shelter_date: animal?.shelter_date 
      ? new Date(animal.shelter_date).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0],
    image: animal?.image || "",
    description: animal?.description || "",
  }

  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues,
  })

  useEffect(() => {
    if (animal) {
      form.reset({
        ong_id: animal.ong_id,
        name: animal.name,
        age: animal.age,
        gender: animal.gender as "male" | "female",
        type: animal.type as "dog" | "cat" | "other",
        size: animal.size as "small" | "medium" | "large",
        shelter_date: new Date(animal.shelter_date).toISOString().split("T")[0],
        image: animal.image || "",
        description: animal.description || "",
      })
    }
  }, [animal, form])

  console.log(animal.id);
  const { mutate: updateAnimal, isPending } = useMutation({
    mutationFn: (data: AnimalFormValues) =>
      api.put(`http://localhost:8000/api/animals/${animal.id}`, data),
    onSuccess: () => {
      setIsSuccessDialogOpen(true) // Abre o dialog de sucesso
      queryClient.invalidateQueries({ queryKey: ["get-animals"] })
    },
    onError: error => {
      toast.error("Erro ao atualizar animal")
      console.error(error)
    },
  })

  const { data: ongsResponse } = useGetOngs({ page: 1, per_page: 100, search: "" })
  const ongs = ongsResponse?.data || []

  async function onSubmit(data: AnimalFormValues) {
    try {
      const formData = new FormData()
      
      // Adiciona todos os campos ao FormData
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'image' && value instanceof File) {
          formData.append('image', value)
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value))
        }
      })

      const payload = {
        ...data,
        description: data.description?.trim() || "Campo vazio"
      }
      
      console.log("Dados sendo enviados:", payload)
      await updateAnimal(payload)
    } catch (error) {
      console.error("Erro ao enviar formulário:", error)
      toast.error("Ocorreu um erro ao atualizar o animal")
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 pb-6" encType="multipart/form-data">
          <FormField
            control={form.control}
            name="ong_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ONG</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma ONG" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {ongs && ongs.length > 0 ? (
                      ongs.map((ong: IOng) => (
                        <SelectItem key={ong.id} value={ong.id}>
                          {ong.name_institution}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="no-ongs" disabled>
                        Nenhuma ONG disponível
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Nome do animal" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Idade (anos)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Sexo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o gênero" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {GENDER_TYPES.map(gender => (
                      <SelectItem key={gender.value} value={gender.value}>
                        {gender.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TYPE_TYPES.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Porte</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o porte" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {SIZE_TYPES.map(size => (
                      <SelectItem key={size.value} value={size.value}>
                        {size.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="shelter_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de abrigo</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem do Animal</FormLabel>
                <FormControl>
                  <div className="flex items-center gap-4">
                    {previewImage || animal.image ? (
                      <div className="relative h-20 w-20">
                        <Image
                          src={previewImage || animal.image || ''}
                          alt="Preview da imagem"
                          fill
                          className="rounded-full object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">Sem imagem</span>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={(e) => handleFileChange(e, field.onChange)}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50"
                    >
                      {field.value instanceof File ? 'Alterar imagem' : 'Selecionar imagem'}
                    </label>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Textarea placeholder="Descreva o animal..." className="min-h-[100px]" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isPending}>
            {isPending ? "Atualizando..." : "Atualizar Animal"}
          </Button>
        </form>
      </Form>

      {/* Dialog de sucesso */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro de animal atualizado com sucesso!</DialogTitle>
            <DialogDescription>
              As informações do animal foram atualizadas no sistema.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}
