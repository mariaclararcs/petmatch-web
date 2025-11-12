"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IUser } from "@/interfaces/user"
import { useUpdateUser } from "@/hooks/users/useUpdateUser"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Eye, EyeClosed } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { uploadImage } from "@/app/services/image-upload"
import { normalizeImageUrl } from "@/lib/image-url"

const editUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  type_user: z.enum(['admin', 'ong', 'adopter'], {
    errorMap: () => ({ message: 'Tipo de usuário inválido' })
  }),
  avatar: z.string().optional().or(z.literal('')),
  password: z.string().optional(),
  password_confirmation: z.string().optional(),
}).refine((data) => {
  // Se password foi fornecido, password_confirmation também deve ser fornecido
  if (data.password && !data.password_confirmation) {
    return false
  }
  if (!data.password && data.password_confirmation) {
    return false
  }
  if (data.password && data.password_confirmation) {
    return data.password === data.password_confirmation
  }
  return true
}, {
  message: "As senhas não coincidem ou estão incompletas",
  path: ["password_confirmation"]
})

type EditUserFormData = z.infer<typeof editUserSchema>

interface UpdateUserFormProps {
  user: IUser
  onSuccess?: () => void
}

// Função para obter as iniciais do nome do usuário
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UpdateUserForm({ user, onSuccess }: UpdateUserFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')
  const updateUserMutation = useUpdateUser()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema)
  })

  const avatar = watch('avatar') // PARA PREVIEW
  const name = watch('name') // PARA AS INICIAIS

  // Função para selecionar imagem (apenas preview, sem upload)
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validação do tipo de arquivo
    if (!file.type.startsWith('image/')) {
      setApiError('Por favor, selecione um arquivo de imagem válido')
      return
    }

    // Validação do tamanho (máximo 5MB)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setApiError('A imagem deve ter no máximo 5MB')
      return
    }

    // Armazena o arquivo para upload posterior
    setSelectedImageFile(file)
    setApiError(null)

    // Cria preview local (base64 temporário apenas para visualização)
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.onerror = () => {
      setApiError('Erro ao carregar preview da imagem')
    }
    reader.readAsDataURL(file)
  }

  // Função para remover imagem selecionada
  const handleRemoveImage = () => {
    setSelectedImageFile(null)
    setImagePreview(user?.avatar || '')
    setValue('avatar', '')
    const fileInput = document.getElementById('update-user-image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  useEffect(() => {
    if (user) {
      setValue('name', user.name)
      setValue('email', user.email)
      setValue('type_user', user.type_user as 'admin' | 'ong' | 'adopter')
      setValue('avatar', user.avatar || '')
      setValue('password', '')
      setValue('password_confirmation', '')
      setImagePreview(user.avatar || '')
      setApiError(null)
    }
  }, [user, setValue])

  const onSubmit = async (data: EditUserFormData) => {
    setApiError(null)

    try {
      let imageUrl = data.avatar || null

      // Se uma nova imagem foi selecionada, fazer upload primeiro
      if (selectedImageFile) {
        try {
          console.log('Fazendo upload da imagem do usuário...')
          imageUrl = await uploadImage(selectedImageFile)
          console.log('URL da imagem recebida:', imageUrl)
          
          // Garante que a URL é válida e completa
          if (!imageUrl || (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://'))) {
            throw new Error('URL da imagem inválida recebida do servidor')
          }
          
          setValue('avatar', imageUrl)
        } catch (error: unknown) {
          const errorMessage = error instanceof Error 
            ? error.message 
            : 'Erro ao fazer upload da imagem. Tente novamente.'
          setApiError(errorMessage)
          return // Para o processo se o upload falhar
        }
      }

      const updateData: any = {
        name: data.name,
        email: data.email,
        type_user: data.type_user,
        avatar: imageUrl || null
      }

      // Só inclui senha se foi fornecida
      if (data.password && data.password.length > 0) {
        updateData.password = data.password
        updateData.password_confirmation = data.password_confirmation
      }

      await updateUserMutation.mutateAsync({ id: user.id, data: updateData })
      
      // Abre o dialog de sucesso
      setIsSuccessDialogOpen(true)
      
    } catch (error: any) {
      setApiError(error.message || 'Erro ao atualizar usuário')
    }
  }

  const handleSuccessDialogClose = () => {
    setIsSuccessDialogOpen(false)
    onSuccess?.()
  }

  return (
    <div className="space-y-4">
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Campo Avatar com Upload - ATUALIZADO */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Imagem de Perfil</label>

          <div className="flex flex-row items-center gap-4 w-full">
            {/* Preview da imagem */}
            <div className="flex flex-col justify-center items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={imagePreview || normalizeImageUrl(avatar) || ""} 
                  alt={name || user.name}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg font-semibold bg-gray-200">
                  {getInitials(name || user.name)}
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
                  id="update-user-image-upload"
                  disabled={updateUserMutation.isPending}
                />
                <label
                  htmlFor="update-user-image-upload"
                  className="cursor-pointer inline-block rounded-xl border-2 border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-100 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {selectedImageFile ? 'Trocar Imagem' : 'Selecionar Imagem'}
                </label>
                {(selectedImageFile || avatar) && (
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    className="ml-2 text-sm text-red-500 hover:text-red-700"
                    disabled={updateUserMutation.isPending}
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
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nome *</label>
          <Input
            type="text"
            {...register('name')}
            className={errors.name ? 'border-red-500' : ''}
            disabled={updateUserMutation.isPending}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail *</label>
          <Input
            type="email"
            {...register('email')}
            className={errors.email ? 'border-red-500' : ''}
            disabled={updateUserMutation.isPending}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Usuário *</label>
          <select
            {...register('type_user')}
            className={`w-full text-sm rounded-md border-2 px-2 py-2 ${
              errors.type_user ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={updateUserMutation.isPending}
          >
            <option value="adopter">Adotante</option>
            <option value="ong">ONG</option>
            <option value="admin">Administrador</option>
          </select>
          {errors.type_user && (
            <p className="text-red-500 text-sm mt-1">{errors.type_user.message}</p>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-4">
            Deixe em branco para não alterar a senha
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nova Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register('password')}
                  className={errors.password ? 'border-red-500' : ''}
                  disabled={updateUserMutation.isPending}
                  placeholder="Deixe vazio para não alterar"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirmar Nova Senha</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...register('password_confirmation')}
                  className={errors.password_confirmation ? 'border-red-500' : ''}
                  disabled={updateUserMutation.isPending}
                  placeholder="Deixe vazio para não alterar"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
                </button>
              </div>
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation.message}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="submit"
            disabled={updateUserMutation.isPending} 
          >
            {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>

      {/* Dialog de sucesso */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={handleSuccessDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro de usuário atualizado com sucesso!</DialogTitle>
            <DialogDescription>
              As informações do usuário foram atualizadas no sistema.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}