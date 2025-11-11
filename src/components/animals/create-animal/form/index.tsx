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

export function CreateAnimalForm() {
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [userOng, setUserOng] = useState<IOng | null>(null)
  
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

  const { mutate: createAnimal, isPending } = useMutation({
    mutationFn: (data: AnimalFormValues) => api.post("http://localhost:8000/api/animals", data),
    onSuccess: () => {
      setIsSuccessDialogOpen(true) // Abre o dialog de sucesso
      queryClient.invalidateQueries({ queryKey: ["get-animals"] })
      form.reset()
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

  function onSubmit(data: AnimalFormValues) {
    const payload = {
      ...data,
      // Se não for admin, usa a ONG do usuário logado
      ong_id: canManageOngs ? data.ong_id : (userOng?.id || data.ong_id),
      image: data.image?.trim() || "Campo vazio",
      description: data.description?.trim() || "Campo vazio"
    }

    console.log("Dados sendo enviados:", payload)
    createAnimal(payload)
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

          {/* Campo Image com Preview */}
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

                  {/* Campo de input */}
                  <div className="flex-grow">
                    <FormControl>
                      <Input
                        type="url"
                        placeholder="https://exemplo.com/imagem-animal.jpg"
                        {...field}
                        value={field.value || ""}
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
      <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
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