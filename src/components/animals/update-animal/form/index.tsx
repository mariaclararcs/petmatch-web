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
import { IAnimal } from "@/interfaces/animal"
import { IOng } from "@/interfaces/ong"
import { queryClient } from "@/lib/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { uploadImage } from "@/app/services/image-upload"
import { useSession } from "next-auth/react"
import { getUserPermissions } from "@/lib/permissions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

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
  image: z.string().optional(),
  description: z.string().max(500).optional(),
})

type AnimalFormValues = z.infer<typeof animalFormSchema>

// Função para obter as iniciais do nome do animal
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

interface UpdateAnimalFormProps {
  animal: IAnimal
  onSuccess?: () => void
}

export function UpdateAnimalForm({ animal, onSuccess }: UpdateAnimalFormProps) {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(animal?.image || "")
  
  const { data: session } = useSession()
  const userType = session?.user?.type_user
  const permissions = getUserPermissions(userType)
  
  // Verificar se usuário pode gerenciar ONGs (admin)
  const canManageOngs = permissions.canManageAnimals && permissions.canManageUsers

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

  // Watch para o campo image para preview em tempo real
  const image = form.watch('image')
  const name = form.watch('name')

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
      setImagePreview(animal.image || "")
    }
  }, [animal, form])

  console.log(animal.id)
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

  // Função para fazer upload da imagem
  const uploadImageToServer = async (file: File): Promise<string> => {
    setIsUploading(true)
    try {
      const imageUrl = await uploadImage(file)
      setIsUploading(false)
      return imageUrl
    } catch (error) {
      setIsUploading(false)
      throw new Error("Falha no upload da imagem")
    }
  }

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false)
    onSuccess?.()
  }

  async function onSubmit(data: AnimalFormValues) {
    try {
      let finalImageUrl = data.image

      // Se uma nova imagem foi selecionada, fazer upload
      if (selectedImage) {
        finalImageUrl = await uploadImageToServer(selectedImage)
      }

      const payload = {
        ...data,
        // Se não for admin, mantém a ONG original do animal
        ong_id: canManageOngs ? data.ong_id : animal.ong_id,
        image: finalImageUrl?.trim() || "Campo vazio",
        description: data.description?.trim() || "Campo vazio"
      }
      
      console.log("Dados sendo enviados:", payload)
      updateAnimal(payload)
      
    } catch (error) {
      toast.error("Erro ao processar imagem")
      console.error(error)
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Campo ONG - Só mostra se usuário pode gerenciar ONGs */}
          {canManageOngs ? (
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
          ) : (
            // Mostra a ONG atual como informação (somente leitura para usuário do tipo ONG)
            <FormItem>
              <FormLabel>ONG</FormLabel>
              <FormControl>
                <Input 
                  value={animal.ong?.name_institution || "ONG não encontrada"} 
                  disabled 
                  className="bg-gray-50"
                />
              </FormControl>
            </FormItem>
          )}

          {/* Campo Image */}
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem do Animal (URL)</FormLabel>
                <div className="flex flex-row items-center gap-4 w-full">
                  {/* Preview da imagem */}
                  <div className="flex flex-col justify-center items-center">
                    <Avatar className="h-20 w-20">
                      <AvatarImage 
                        src={image || ""} 
                        alt={name || animal.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-lg font-semibold bg-gray-200">
                        {getInitials(name || animal.name)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs text-muted-foreground mt-1">
                      Preview da imagem
                    </p>
                  </div>

                  {/* Campo de input */}
                  <div className="flex-grow">
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://exemplo.com/imagem-animal.jpg"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e)
                          setImagePreview(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </div>
                </div>
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
                <FormLabel>Idade aproximada (anos)</FormLabel>
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
                      <SelectValue placeholder="Selecione o sexo" />
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

          <Button 
            type="submit" 
            disabled={isPending || isUploading}>
              {isPending || isUploading ? "Atualizando..." : "Atualizar Animal"}
          </Button>
        </form>
      </Form>

      {/* Dialog de sucesso */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={handleSuccessDialogClose}>
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