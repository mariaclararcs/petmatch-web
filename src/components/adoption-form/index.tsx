"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useCreateAdopter } from "@/hooks/adopter/useCreateAdopter"

// Schema de validação
const adopterSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  birth_date: z.string().min(1, 'Data de nascimento é obrigatória'),
  phone: z.string().min(14, 'Telefone incompleto').max(15, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço muito curto'),
  cep: z.string().length(9, 'CEP inválido'),
})

type AdopterFormData = z.infer<typeof adopterSchema>

export default function AdoptionForm() {
    const { data: session } = useSession()
    const router = useRouter()
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [apiError, setApiError] = React.useState<string | null>(null)
    const [isSuccess, setIsSuccess] = React.useState(false)
    const createAdopterMutation = useCreateAdopter()

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<AdopterFormData>({
        resolver: zodResolver(adopterSchema),
        defaultValues: {
            name: '',
            birth_date: '',
            phone: '',
            address: '',
            cep: ''
        }
    })

    // Formatadores para telefone e CEP
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

    const onSubmit = async (data: AdopterFormData) => {
        if (!session?.user?.id) {
            setApiError('Você precisa estar logado para enviar o formulário')
            return
        }

        setApiError(null)

        try {
            const adopterData = {
                user_id: session.user.id,
                name: data.name,
                birth_date: data.birth_date,
                phone: data.phone.replace(/\D/g, ''),
                address: data.address,
                cep: data.cep.replace(/\D/g, '')
            }

            await createAdopterMutation.mutateAsync(adopterData)
            setIsSuccess(true)
        } catch (error: any) {
            setApiError(error.message || 'Erro ao enviar formulário. Tente novamente.')
        }
    }

    if (isSuccess) {
        return (
            <div className="flex flex-col items-center mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
                <div className="flex flex-col items-center w-full max-w-2xl text-center">
                    {/* Ícone de sucesso */}
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                    </div>

                    {/* Mensagem principal */}
                    <h2 className="text-3xl font-bold text-green-600 mb-4">Formulário Enviado com Sucesso!</h2>
                    <p className="text-lg text-gray-600 mb-6">
                        Seu formulário de adoção foi enviado com sucesso. A ONG entrará em contato em breve.
                    </p>

                    <Button
                        onClick={() => router.push('/')}
                        className="bg-asecondary text-white hover:bg-asecondary/90"
                    >
                        Voltar para Home
                    </Button>
                </div>
            </div>
        )
    }

    if (!session) {
        return (
            <div className="flex flex-col items-center mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
                <div className="flex flex-col items-center w-full max-w-2xl text-center">
                    <h1 className="text-2xl font-bold mb-6">Formulário de Adoção</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Você precisa estar logado para enviar o formulário de adoção.
                    </p>
                    <Button
                        onClick={() => router.push('/login')}
                        className="bg-asecondary text-white hover:bg-asecondary/90"
                    >
                        Fazer Login
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col items-center mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
            <div className="flex flex-col items-center w-full max-w-2xl">
                <h1 className="text-2xl font-bold mb-6">Formulário de Adoção</h1>

                {apiError && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 w-full">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col w-full space-y-6">
                    <div className="flex flex-col space-y-4">
                        <div>
                            <label className="block mb-2 font-medium">Nome Completo *</label>
                            <input 
                                type="text" 
                                {...register('name')}
                                className={`w-full rounded-xl border-2 px-4 py-2 ${
                                    errors.name ? 'border-red-500' : 'border-aborder'
                                }`}
                                disabled={createAdopterMutation.isPending}
                            />
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block mb-2 font-medium">Data de Nascimento *</label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            type="button"
                                            className={`justify-between w-full rounded-xl h-fit border-2 text-md px-4 py-2 hover:bg-aborder hover:border-aborder ${
                                                errors.birth_date ? 'border-red-500' : 'border-aborder'
                                            }`}
                                        >
                                            {date ? date.toLocaleDateString('pt-BR') : "00/00/0000"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(selectedDate) => {
                                                setDate(selectedDate)
                                                setOpen(false)
                                                if (selectedDate) {
                                                    setValue('birth_date', selectedDate.toISOString().split('T')[0])
                                                } else {
                                                    setValue('birth_date', '')
                                                }
                                            }}
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.birth_date && (
                                    <p className="text-red-500 text-sm mt-1">{errors.birth_date.message}</p>
                                )}
                            </div>

                            <div>
                                <label className="block mb-2 font-medium">Celular *</label>
                                <input
                                    type="text"
                                    {...register('phone')}
                                    onChange={(e) => formatPhone(e.target.value)}
                                    value={watch('phone')}
                                    placeholder="(00) 00000-0000"
                                    className={`w-full rounded-xl border-2 px-4 py-2 ${
                                        errors.phone ? 'border-red-500' : 'border-aborder'
                                    }`}
                                    maxLength={15}
                                    disabled={createAdopterMutation.isPending}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">Endereço Completo *</label>
                            <input 
                                type="text" 
                                {...register('address')}
                                className={`w-full rounded-xl border-2 px-4 py-2 ${
                                    errors.address ? 'border-red-500' : 'border-aborder'
                                }`}
                                disabled={createAdopterMutation.isPending}
                            />
                            {errors.address && (
                                <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                            )}
                        </div>

                        <div>
                            <label className="block mb-2 font-medium">CEP *</label>
                            <input
                                type="text"
                                {...register('cep')}
                                onChange={(e) => formatCEP(e.target.value)}
                                value={watch('cep')}
                                placeholder="00000-000"
                                className={`w-full rounded-xl border-2 px-4 py-2 ${
                                    errors.cep ? 'border-red-500' : 'border-aborder'
                                }`}
                                maxLength={9}
                                disabled={createAdopterMutation.isPending}
                            />
                            {errors.cep && (
                                <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>
                            )}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={createAdopterMutation.isPending}
                        className="flex justify-center items-center bg-aprimary rounded-xl border-2 border-asecondary text-md my-6 py-2 w-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors disabled:opacity-70"
                    >
                        {createAdopterMutation.isPending ? 'Enviando...' : 'Enviar Formulário'}
                    </Button>
                </form>
            </div>
        </div>
    )
}
