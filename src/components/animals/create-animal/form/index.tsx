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
import { IOng } from "@/interfaces/ong"
import { queryClient } from "@/lib/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import { getUserPermissions } from "@/lib/permissions"
import { uploadImage } from "@/app/services/image-upload"
import { normalizeImageUrl } from "@/lib/image-url"

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

interface CreateAnimalFormProps {
  onSuccess?: () => void
}

export function CreateAnimalForm({ onSuccess }: CreateAnimalFormProps) {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [userOng, setUserOng] = useState<IOng | null>(null)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  
  const { data: session } = useSession()
  const userType = session?.user?.type_user
  const permissions = getUserPermissions(userType)
  
  // Verificar se usuário pode gerenciar ONGs (admin)
  const canManageOngs = permissions.canManageAnimals && permissions.canManageUsers

  const form = useForm<AnimalFormValues>({
    resolver: zodResolver(animalFormSchema),
    defaultValues: {
      ong_id: "",
      name: "",
      age: 1,
      gender: "male",
      type: "dog",
      size: "medium",
      shelter_date: new Date().toISOString().split("T")[0],
      image: "",
      description: "",
    },
  })

  // Watch para o campo image e name para preview em tempo real
  const image = form.watch('image')
  const name = form.watch('name')

  // Função para selecionar imagem (apenas preview, sem upload)
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validação do tipo de arquivo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione um arquivo de imagem válido')
      return
    }

    // Validação do tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      toast.error('A imagem deve ter no máximo 5MB')
      return
    }

    // Armazena o arquivo para upload posterior
    setSelectedImageFile(file)

    // Cria preview local (base64 temporário apenas para visualização)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.onerror = () => {
      toast.error('Erro ao carregar preview da imagem')
    }
    reader.readAsDataURL(file)
  }

  // Função para remover imagem selecionada
  const handleRemoveImage = () => {
    setSelectedImageFile(null)
    setImagePreview('')
    form.setValue('image', '')
    const fileInput = document.getElementById('animal-image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  const { mutate: createAnimal, isPending } = useMutation({
    mutationFn: (data: AnimalFormValues) => api.post("http://localhost:8000/api/animals", data),
    onSuccess: () => {
      setIsSuccessDialogOpen(true) // Abre o dialog de sucesso
      queryClient.invalidateQueries({ queryKey: ["get-animals"] })
      form.reset()
      setSelectedImageFile(null)
      setImagePreview('')
      const fileInput = document.getElementById('animal-image-upload') as HTMLInputElement
      if (fileInput) fileInput.value = ''
    },
    onError: error => {
      toast.error("Erro ao criar animal")
      console.error(error)
    },
  })

  const { data: ongsResponse } = useGetOngs({ page: 1, per_page: 100, search: "" })
  const ongs = ongsResponse?.data || []

  // Encontrar a ONG do usuário logado
  useEffect(() => {
    if (session?.user?.id && ongs.length > 0) {
      const userOngFound = ongs.find((ong: IOng) => ong.user_id === session.user.id)
      if (userOngFound) {
        setUserOng(userOngFound)
        // Se o usuário não é admin, preenche automaticamente com a ONG dele
        if (!canManageOngs) {
          form.setValue('ong_id', userOngFound.id)
        }
      }
    }
  }, [session, ongs, canManageOngs, form])

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false)
    onSuccess?.()
  }

  async function onSubmit(data: AnimalFormValues) {
    try {
      let imageUrl = data.image || null

      // Se uma nova imagem foi selecionada, fazer upload primeiro
      if (selectedImageFile) {
        try {
          console.log('Fazendo upload da imagem do animal...')
          imageUrl = await uploadImage(selectedImageFile)
          console.log('URL da imagem recebida:', imageUrl)
          
          // Garante que a URL é válida e completa
          if (!imageUrl || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
            throw new Error('URL da imagem inválida recebida do servidor')
          }
          
          form.setValue('image', imageUrl)
        } catch (error: unknown) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Erro ao fazer upload da imagem. Tente novamente.'
          toast.error(errorMessage)
          return // Para o processo se o upload falhar
        }
      }

      const payload = {
        ...data,
        // Se não for admin, usa a ONG do usuário logado
        ong_id: canManageOngs ? data.ong_id : (userOng?.id || data.ong_id),
        image: imageUrl?.trim() || "Campo vazio",
        description: data.description?.trim() || "Campo vazio"
      }

      console.log("Dados sendo enviados:", payload)
      createAnimal(payload)
    } catch (error) {
      console.error('Erro ao processar formulário:', error)
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
            // Mostra a ONG do usuário como informação (somente leitura para usuário do tipo ONG)
            <FormItem>
              <FormLabel>ONG</FormLabel>
              <FormControl>
                <Input 
                  value={userOng?.name_institution || "Carregando..."} 
                  disabled 
                  className="bg-gray-50"
                />
              </FormControl>
              <p className="text-sm text-muted-foreground">
                O animal será cadastrado automaticamente na sua ONG
              </p>
            </FormItem>
          )}

          {/* Campo Image com Upload */}
          <FormItem>
            <FormLabel>Imagem do Animal</FormLabel>
            <div className="flex flex-row items-center gap-4 w-full">
              {/* Preview da imagem */}
              <div className="flex flex-col justify-center items-center">
                <Avatar className="h-20 w-20">
                  <AvatarImage 
                    src={imagePreview || normalizeImageUrl(image) || ""} 
                    alt={name || "Animal"}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-lg font-semibold bg-gray-200">
                    {getInitials(name || "Animal")}
                  </AvatarFallback>
                </Avatar>
                <p className="text-xs text-muted-foreground mt-1">
                  Preview da imagem
                </p>
              </div>

              {/* Campo de upload */}
              <div className="flex-grow">
                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="animal-image-upload"
                    disabled={isPending}
                  />
                  <label
                    htmlFor="animal-image-upload"
                    className="cursor-pointer inline-block rounded-xl border-2 border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {selectedImageFile ? 'Trocar Imagem' : 'Selecionar Imagem'}
                  </label>
                  {(selectedImageFile || image) && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="ml-2 text-sm text-red-500 hover:text-red-700"
                      disabled={isPending}
                    >
                      Remover
                    </button>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Selecione uma imagem para fazer upload
                </p>
              </div>
            </div>
          </FormItem>

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

          <Button type="submit" disabled={isPending}>
            {isPending ? "Cadastrando..." : "Cadastrar Animal"}
          </Button>
        </form>
      </Form>

      {/* Dialog de sucesso */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={handleSuccessDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Animal cadastrado com sucesso!</DialogTitle>
            <DialogDescription>
              O animal foi cadastrado no sistema e agora está disponível para adoção.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}