"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { IUser } from "@/interfaces/user"
import { useUpdateUser } from "@/hooks/users/useUpdateUser"
import { toast } from "sonner"
import { Eye, EyeClosed } from "lucide-react"

const editUserSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  type_user: z.enum(['admin', 'ong', 'adopter'], {
    errorMap: () => ({ message: 'Tipo de usuário inválido' })
  }),
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

export function UpdateUserForm({ user, onSuccess }: UpdateUserFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)
  const updateUserMutation = useUpdateUser()

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors }
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema)
  })

  const password = watch('password')

  // Carrega dados do usuário no formulário quando o componente monta
  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        email: user.email,
        type_user: user.type_user as 'admin' | 'ong' | 'adopter',
        password: '',
        password_confirmation: ''
      })
      setApiError(null)
    }
  }, [user, reset])

  const onSubmit = async (data: EditUserFormData) => {
    setApiError(null)

    try {
      const updateData: any = {
        name: data.name,
        email: data.email,
        type_user: data.type_user
      }

      // Só inclui senha se foi fornecida
      if (data.password && data.password.length > 0) {
        updateData.password = data.password
        updateData.password_confirmation = data.password_confirmation
      }

      await updateUserMutation.mutateAsync({ id: user.id, data: updateData })
      toast.success("Usuário atualizado com sucesso!")
      onSuccess?.()
    } catch (error: any) {
      setApiError(error.message || 'Erro ao atualizar usuário')
      toast.error("Erro ao atualizar usuário")
    }
  }

  return (
    <div className="space-y-4">
      {apiError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
          {apiError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            className={`w-full rounded-md border-2 px-4 py-2 ${
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
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </div>
  )
}