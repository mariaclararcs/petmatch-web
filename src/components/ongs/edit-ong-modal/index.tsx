'use client'

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { IOng } from "@/interfaces/ong"
import { useUpdateOng } from "@/hooks/ongs/useUpdateOng"

const editONGSchema = z.object({
  name_institution: z.string().min(3, 'Nome da instituição deve ter pelo menos 3 caracteres'),
  name_responsible: z.string().min(3, 'Nome do responsável deve ter pelo menos 3 caracteres'),
  document_responsible: z.string().min(11, 'CPF deve ter 11 dígitos'),
  cnpj: z.string().min(14, 'CNPJ deve ter 14 dígitos'),
  phone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  address: z.string().min(5, 'Endereço muito curto'),
  cep: z.string().min(8, 'CEP deve ter 8 dígitos'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
})

type EditONGFormData = z.infer<typeof editONGSchema>

interface EditONGModalProps {
  isOpen: boolean
  onClose: () => void
  ong: IOng | null
}

export default function EditONGModal({ isOpen, onClose, ong }: EditONGModalProps) {
  const [apiError, setApiError] = useState<string | null>(null)
  const updateOngMutation = useUpdateOng()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm<EditONGFormData>({
    resolver: zodResolver(editONGSchema)
  })

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

  // Carrega dados da ONG no formulário quando o modal abre
  useEffect(() => {
    if (isOpen && ong) {
      setValue('name_institution', ong.name_institution)
      setValue('name_responsible', ong.name_responsible)
      setValue('document_responsible', ong.document_responsible)
      setValue('cnpj', ong.cnpj)
      setValue('phone', ong.phone)
      setValue('address', ong.address)
      setValue('cep', ong.cep)
      setValue('description', ong.description)
      setApiError(null)
    }
  }, [isOpen, ong, setValue])

  const onSubmit = async (data: EditONGFormData) => {
    if (!ong) return

    setApiError(null)

    try {
      const updateData = {
        ...data,
        document_responsible: data.document_responsible.replace(/\D/g, ''),
        cnpj: data.cnpj.replace(/\D/g, ''),
        phone: data.phone.replace(/\D/g, ''),
        cep: data.cep.replace(/\D/g, ''),
        status: ong.status // Mantém o status atual
      }

      await updateOngMutation.mutateAsync({ id: ong.id, data: updateData })
      onClose()
      reset()
    } catch (error: any) {
      setApiError(error.message || 'Erro ao atualizar ONG')
    }
  }

  const handleClose = () => {
    onClose()
    reset()
    setApiError(null)
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar ONG</DialogTitle>
        </DialogHeader>

        {apiError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Instituição *</label>
            <input
              type="text"
              {...register('name_institution')}
              className={`w-full rounded-xl border-2 px-4 py-2 ${
                errors.name_institution ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updateOngMutation.isPending}
            />
            {errors.name_institution && (
              <p className="text-red-500 text-sm mt-1">{errors.name_institution.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nome do Responsável *</label>
              <input
                type="text"
                {...register('name_responsible')}
                className={`w-full rounded-xl border-2 px-4 py-2 ${
                  errors.name_responsible ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={updateOngMutation.isPending}
              />
              {errors.name_responsible && (
                <p className="text-red-500 text-sm mt-1">{errors.name_responsible.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">CPF do Responsável *</label>
              <input
                type="text"
                {...register('document_responsible')}
                onChange={(e) => formatCPF(e.target.value)}
                value={watch('document_responsible')}
                placeholder="000.000.000-00"
                className={`w-full rounded-xl border-2 px-4 py-2 ${
                  errors.document_responsible ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={14}
                disabled={updateOngMutation.isPending}
              />
              {errors.document_responsible && (
                <p className="text-red-500 text-sm mt-1">{errors.document_responsible.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">CNPJ *</label>
              <input
                type="text"
                {...register('cnpj')}
                onChange={(e) => formatCNPJ(e.target.value)}
                value={watch('cnpj')}
                placeholder="00.000.000/0000-00"
                className={`w-full rounded-xl border-2 px-4 py-2 ${
                  errors.cnpj ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={18}
                disabled={updateOngMutation.isPending}
              />
              {errors.cnpj && (
                <p className="text-red-500 text-sm mt-1">{errors.cnpj.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Telefone *</label>
              <input
                type="text"
                {...register('phone')}
                onChange={(e) => formatPhone(e.target.value)}
                value={watch('phone')}
                placeholder="(00)00000-0000"
                className={`w-full rounded-xl border-2 px-4 py-2 ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={15}
                disabled={updateOngMutation.isPending}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Endereço *</label>
            <input
              type="text"
              {...register('address')}
              className={`w-full rounded-xl border-2 px-4 py-2 ${
                errors.address ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updateOngMutation.isPending}
            />
            {errors.address && (
              <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">CEP *</label>
            <input
              type="text"
              {...register('cep')}
              onChange={(e) => formatCEP(e.target.value)}
              value={watch('cep')}
              placeholder="00000-000"
              className={`w-full rounded-xl border-2 px-4 py-2 ${
                errors.cep ? 'border-red-500' : 'border-gray-300'
              }`}
              maxLength={9}
              disabled={updateOngMutation.isPending}
            />
            {errors.cep && (
              <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição *</label>
            <textarea
              {...register('description')}
              className={`w-full rounded-xl border-2 px-4 py-2 h-24 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={updateOngMutation.isPending}
              placeholder="Descreva os objetivos e atividades da instituição..."
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateOngMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={updateOngMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {updateOngMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
