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
import Image from "next/image"
import { uploadImage } from "@/app/services/image-upload"
import { useSession } from "next-auth/react" // IMPORT ADICIONADO
import { getUserPermissions } from "@/lib/permissions" // IMPORT ADICIONADO

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

interface UpdateAnimalFormProps {
  animal: IAnimal
}

export function UpdateAnimalForm({ animal }: UpdateAnimalFormProps) {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(animal?.image || "")
  
  // ADICIONADO: Obter sessão e permissões
  const { data: session } = useSession()
  const userType = session?.user?.type_user
  const permissions = getUserPermissions(userType)
  
  // ADICIONADO: Verificar se usuário pode gerenciar ONGs (admin)
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
      setIsSuccessDialogOpen(true)
      queryClient.invalidateQueries({ queryKey: ["get-animals"] })
    },
    onError: error => {
      toast.error("Erro ao atualizar animal")
      console.error(error)
    },
  })

  const { data: ongsResponse } = useGetOngs({ page: 1, per_page: 100, search: "" })
  const ongs = ongsResponse?.data || []

  // Função para lidar com seleção de arquivo
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Por favor, selecione um arquivo de imagem")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("A imagem deve ter no máximo 5MB")
        return
      }

      setSelectedImage(file)
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

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
        image: finalImageUrl?.trim() || "",
        description: data.description?.trim() || ""
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 px-4 py-4 max-h-[calc(80vh-100px)] overflow-y-auto">
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
            // Mostra a ONG atual como informação (somente leitura)
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
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Imagem do Animal</FormLabel>
                <FormControl>
                  <div>
                    <div>
                      <Input 
                        placeholder="https://..."
                        {...field}
                        value={field.value || ""}
                        onChange={(e) => {
                          field.onChange(e)
                          setImagePreview(e.target.value)
                        }}
                      />
                    </div>
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

          <Button 
            type="submit" 
            disabled={isPending}>
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