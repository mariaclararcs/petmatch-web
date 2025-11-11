"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { IOng } from "@/interfaces/ong"
import { useUpdateOng } from "@/hooks/ongs/useUpdateOng"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const editONGSchema = z.object({
  name_institution: z.string().min(3, 'Nome da instituição deve ter pelo menos 3 caracteres'),
  document_responsible: z.string().min(11, 'CPF deve ter 11 dígitos'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  address: z.string().min(5, 'Endereço muito curto'),
  cep: z.string().min(8, 'CEP deve ter 8 dígitos'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
  ong_image: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
  ong_email: z.string().email('E-mail inválido'), // ADICIONADO
})

type EditONGFormData = z.infer<typeof editONGSchema>

interface UpdateOngFormProps {
  ong: IOng
  onSuccess?: () => void
}

// Função para obter as iniciais do nome da instituição
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function UpdateOngForm({ ong, onSuccess }: UpdateOngFormProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
  const updateOngMutation = useUpdateOng()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<EditONGFormData>({
    resolver: zodResolver(editONGSchema)
  })

  const ong_image = watch('ong_image') // PARA PREVIEW
  const name_institution = watch('name_institution') // PARA AS INICIAIS

  // Formatadores
  const formatPhone = (value: string) => {
    value = value.replace(/\D/g, '')
    if (value.length > 11) value = value.substring(0, 11)
    if (value.length > 0) {
      value = `(${value.substring(0, 2)}${value.length > 2 ? ')' : ''}${value.substring(2)}`
    }
    if (value.length > 10) {
      value = `${value.substring(0, 9)}-${value.substring(9)}`
    }
    setValue('phone', value)
  }

  const formatCEP = (value: string) => {
    value = value.replace(/\D/g, '')
    if (value.length > 8) value = value.substring(0, 8)
    if (value.length > 5) {
      value = `${value.substring(0, 5)}-${value.substring(5)}`
    }
    setValue('cep', value)
  }

  const formatCNPJ = (value: string) => {
    value = value.replace(/\D/g, '')
    if (value.length > 14) value = value.substring(0, 14)
    if (value.length > 0) {
      value = value.replace(/^(\d{2})(\d)/, '$1.$2')
    }
    if (value.length > 3) {
      value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    }
    if (value.length > 7) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
    }
    if (value.length > 12) {
      value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
    }
    setValue('cnpj', value)
  }

  const formatCPF = (value: string) => {
    value = value.replace(/\D/g, '')
    if (value.length > 11) value = value.substring(0, 11)
    if (value.length > 0) {
      value = value.replace(/^(\d{3})(\d)/, '$1.$2')
    }
    if (value.length > 6) {
      value = value.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    }
    if (value.length > 9) {
      value = value.replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    }
    setValue('document_responsible', value)
  }

  useEffect(() => {
    if (ong) {
      setValue('name_institution', ong.name_institution)
      setValue('document_responsible', ong.document_responsible)
      setValue('cnpj', ong.cnpj)
      setValue('phone', ong.phone)
      setValue('address', ong.address)
      setValue('cep', ong.cep)
      setValue('description', ong.description)
      setValue('ong_image', ong.ong_image || '')
      setValue('ong_email', ong.ong_email || '') // ADICIONADO
      setApiError(null)
    }
  }, [ong, setValue])

  const onSubmit = async (data: EditONGFormData) => {
    setApiError(null)

    try {
      const updateData = {
        ...data,
        document_responsible: data.document_responsible.replace(/\D/g, ''),
        cnpj: data.cnpj.replace(/\D/g, ''),
        phone: data.phone.replace(/\D/g, ''),
        cep: data.cep.replace(/\D/g, ''),
        ong_image: data.ong_image || null,
        ong_email: data.ong_email, // ADICIONADO
        status: ong.status
      }

      await updateOngMutation.mutateAsync({ id: ong.id, data: updateData })
      
      setIsSuccessDialogOpen(true)
      
    } catch (error: any) {
      setApiError(error.message || 'Erro ao atualizar ONG')
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
        {/* Campo ONG Image */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium mb-1">Imagem de Perfil (URL)</label>

          <div className="flex flex-row items-center gap-4 w-full">
            {/* Preview da imagem */}
            <div className="flex flex-col justify-center items-center">
              <Avatar className="h-20 w-20">
                <AvatarImage 
                  src={ong_image || ""} 
                  alt={name_institution || ong.name_institution}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg font-semibold bg-gray-200">
                  {getInitials(name_institution || ong.name_institution)}
                </AvatarFallback>
              </Avatar>
              <p className="text-xs text-muted-foreground mt-1">
                Preview da imagem
              </p>
            </div>

            {/* Campo de input */}
            <div className="flex-grow">
              <Input
                type="url"
                {...register('ong_image')}
                placeholder="https://exemplo.com/imagem-ong.jpg"
                className={errors.ong_image ? 'border-red-500' : ''}
                disabled={updateOngMutation.isPending}
              />
              {errors.ong_image && (
                <p className="text-red-500 text-sm mt-1">{errors.ong_image.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Nome da Instituição *</label>
          <Input
            type="text"
            {...register('name_institution')}
            className={errors.name_institution ? 'border-red-500' : ''}
            disabled={updateOngMutation.isPending}
          />
          {errors.name_institution && (
            <p className="text-red-500 text-sm mt-1">{errors.name_institution.message}</p>
          )}
        </div>

        <div className="">
          <div>
            <label className="block text-sm font-medium mb-1">CNPJ *</label>
            <Input
              type="text"
              {...register('cnpj')}
              onChange={(e) => formatCNPJ(e.target.value)}
              value={watch('cnpj')}
              placeholder="00.000.000/0000-00"
              className={errors.cnpj ? 'border-red-500' : ''}
              maxLength={18}
              disabled={updateOngMutation.isPending}
            />
            {errors.cnpj && (
              <p className="text-red-500 text-sm mt-1">{errors.cnpj.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">CPF do Responsável *</label>
            <Input
              type="text"
              {...register('document_responsible')}
              onChange={(e) => formatCPF(e.target.value)}
              value={watch('document_responsible')}
              placeholder="000.000.000-00"
              className={errors.document_responsible ? 'border-red-500' : ''}
              maxLength={14}
              disabled={updateOngMutation.isPending}
            />
            {errors.document_responsible && (
              <p className="text-red-500 text-sm mt-1">{errors.document_responsible.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Telefone para Contato *</label>
            <Input
              type="text"
              {...register('phone')}
              onChange={(e) => formatPhone(e.target.value)}
              value={watch('phone')}
              placeholder="(00)00000-0000"
              className={errors.phone ? 'border-red-500' : ''}
              maxLength={15}
              disabled={updateOngMutation.isPending}
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">E-mail da Instituição *</label>
          <Input
            type="email"
            {...register('ong_email')}
            className={errors.ong_email ? 'border-red-500' : ''}
            disabled={updateOngMutation.isPending}
            placeholder="contato@instituicao.com"
          />
          {errors.ong_email && (
            <p className="text-red-500 text-sm mt-1">{errors.ong_email.message}</p>
          )}
          <p className="text-sm text-muted-foreground mt-1">
            Este e-mail ficará disponível no perfil como meio de contato com a ONG.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Endereço *</label>
          <Input
            type="text"
            {...register('address')}
            className={errors.address ? 'border-red-500' : ''}
            disabled={updateOngMutation.isPending}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">CEP *</label>
          <Input
            type="text"
            {...register('cep')}
            onChange={(e) => formatCEP(e.target.value)}
            value={watch('cep')}
            placeholder="00000-000"
            className={errors.cep ? 'border-red-500' : ''}
            maxLength={9}
            disabled={updateOngMutation.isPending}
          />
          {errors.cep && (
            <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Descrição *</label>
          <Textarea
            {...register('description')}
            className={`min-h-[100px] ${errors.description ? 'border-red-500' : ''}`}
            disabled={updateOngMutation.isPending}
            placeholder="Descreva os objetivos e atividades da instituição..."
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="submit"
            disabled={updateOngMutation.isPending}
          >
            {updateOngMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>

      {/* Dialog de sucesso */}
      <Dialog open={isSuccessDialogOpen} onOpenChange={handleSuccessDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cadastro de ONG atualizado com sucesso!</DialogTitle>
            <DialogDescription>
              As informações da ONG foram atualizadas no sistema.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}