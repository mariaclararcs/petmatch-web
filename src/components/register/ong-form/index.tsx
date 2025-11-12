'use client'

import { Eye, EyeClosed, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Schema para Step 1 - Dados do Usuário
const userStepSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  avatar: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

// Schema para Step 2 - Dados da ONG
const ongStepSchema = z.object({
  name_institution: z.string().min(3, 'Nome da instituição deve ter pelo menos 3 caracteres'),
  document_responsible: z.string().min(11, 'CPF deve ter 11 dígitos'),
  cnpj: z.string().min(18, 'CNPJ incompleto').max(18, 'CNPJ inválido'),
  phone: z.string().min(14, 'Telefone incompleto').max(15, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço muito curto'),
  cep: z.string().length(9, 'CEP inválido'),
  description: z.string().min(10, 'Descrição deve ter pelo menos 10 caracteres'),
})

type UserStepData = z.infer<typeof userStepSchema>
type ONGStepData = z.infer<typeof ongStepSchema>

// Função para obter as iniciais do nome do usuário
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function RegisterONG() {
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [userStepData, setUserStepData] = useState<UserStepData | null>(null)
    const [createdUserId, setCreatedUserId] = useState<string | null>(null)

    // Form para Step 1 - Dados do Usuário
    const userForm = useForm<UserStepData>({
        resolver: zodResolver(userStepSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            avatar: ''
        }
    })

    // Form para Step 2 - Dados da ONG
    const ongForm = useForm<ONGStepData>({
        resolver: zodResolver(ongStepSchema),
        defaultValues: {
            name_institution: '',
            document_responsible: '',
            cnpj: '',
            phone: '',
            address: '',
            cep: '',
            description: ''
        }
    })

    // Watch para o campo avatar e name para preview em tempo real
    const avatar = userForm.watch('avatar')
    const name = userForm.watch('name')

    // Formatadores para telefone, CEP, CNPJ e CPF
    const formatPhone = (value: string) => {
        value = value.replace(/\D/g, '')
        if (value.length > 11) value = value.substring(0, 11)
        
        if (value.length > 0) {
          value = `(${value.substring(0, 2)}${value.length > 2 ? ')' : ''}${value.substring(2)}`
        }
        if (value.length > 10) {
          value = `${value.substring(0, 9)}-${value.substring(9)}`
        }
        ongForm.setValue('phone', value)
    }

    const formatCEP = (value: string) => {
        value = value.replace(/\D/g, '')
        if (value.length > 8) value = value.substring(0, 8)
        
        if (value.length > 5) {
          value = `${value.substring(0, 5)}-${value.substring(5)}`
        }
        ongForm.setValue('cep', value)
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
        ongForm.setValue('cnpj', value)
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
        ongForm.setValue('document_responsible', value)
    }

    // Submit Step 1 - Criar usuário
    const onSubmitUserStep = async (data: UserStepData) => {
        console.log('User Step data:', data)
        setIsSubmitting(true)
        setApiError(null)

        try {
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword,
                type_user: 'ong',
                avatar: data.avatar || null
            }

            console.log('Creating user:', userData)

            const response = await fetch('http://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Erro ao criar usuário')
            }

            const result = await response.json()
            console.log('User created successfully:', result)
            console.log('Trying to extract user ID from:', result)
            
            // Diferentes possibilidades de estrutura da resposta Laravel
            const userId = result.id || result.user?.id || result.data?.id || result.user_id
            console.log('Extracted user ID:', userId)
            
            if (!userId) {
                console.error('No user ID found in response:', result)
                throw new Error('ID do usuário não foi retornado pela API')
            }
            
            setCreatedUserId(userId)
            setUserStepData(data)
            setCurrentStep(2)
            
        } catch (error: any) {
            console.error('User creation error:', error)
            setApiError(error.message || 'Erro ao criar usuário. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Submit Step 2 - Criar ONG
    const onSubmitONGStep = async (data: ONGStepData) => {
        if (!createdUserId || !userStepData) {
            setApiError('Erro: Dados do usuário não encontrados')
            return
        }

        console.log('ONG Step data:', data)
        setIsSubmitting(true)
        setApiError(null)

        try {
            const ongData = {
                user_id: createdUserId,
                name_institution: data.name_institution,
                document_responsible: data.document_responsible.replace(/\D/g, ''),
                cnpj: data.cnpj.replace(/\D/g, ''),
                phone: data.phone.replace(/\D/g, ''),
                address: data.address,
                cep: data.cep.replace(/\D/g, ''),
                description: data.description,
                ong_image: userStepData.avatar || null,
                ong_email: userStepData.email,
                status: '1'
            }

            console.log('Creating ONG:', ongData)

            const response = await fetch('http://localhost:8000/api/ongs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(ongData)
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.message || 'Erro ao criar ONG')
            }

            const result = await response.json()
            console.log('ONG created successfully:', result)
            router.push('/login')
            
        } catch (error: any) {
            console.error('ONG creation error:', error)
            setApiError(error.message || 'Erro ao criar ONG. Tente novamente.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const goBack = () => {
        setCurrentStep(1)
        setApiError(null)
    }

    return (
        <div>
            <main className="flex flex-col justify-between items-center mx-auto px-12 py-6 xl:py-8 h-full">
                <div className="flex flex-col items-center w-full max-w-2xl">
                    {/* Header com Steps - Indicador de progresso */}
                    <div className="flex flex-col items-center mb-6">
                        <h1 className="text-lg font-bold mb-4">Cadastro de Instituição</h1>
                        <div className="flex items-center mb-4">
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                currentStep >= 1 ? 'bg-asecondary text-white' : 'bg-gray-300 text-gray-600'
                            }`}> 
                                1
                            </div>
                            <div className={`w-16 h-1 ${currentStep >= 2 ? 'bg-asecondary' : 'bg-gray-300'}`}></div>
                            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                currentStep >= 2 ? 'bg-asecondary text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                                2
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">
                            {currentStep === 1 ? 'Dados do Usuário' : 'Dados da Instituição'}
                        </p>
                    </div>

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 w-full">
                            {apiError}
                        </div>
                    )}

                    {/* Step 1 - Dados do Usuário */}
                    {currentStep === 1 && (
                        <form onSubmit={userForm.handleSubmit(onSubmitUserStep)} className="flex flex-col py-4 w-full">
                            {/* Campo Avatar com Preview */}
                            <div className="mb-6">
                                <label className="block mb-1">Imagem de Perfil (URL)</label>
                                <div className="flex flex-row items-center gap-4 w-full">
                                    {/* Preview da imagem */}
                                    <div className="flex flex-col justify-center items-center">
                                        <Avatar className="h-24 w-24">
                                            <AvatarImage 
                                                src={avatar || ""} 
                                                alt={name || "Usuário"}
                                                className="object-cover"
                                            />
                                            <AvatarFallback className="text-lg font-semibold bg-gray-200">
                                                {getInitials(name || "Usuário")}
                                            </AvatarFallback>
                                        </Avatar>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Preview da imagem
                                        </p>
                                    </div>

                                    {/* Campo de input */}
                                    <div className="flex-grow">
                                        <input
                                            type="url"
                                            {...userForm.register('avatar')}
                                            placeholder="https://exemplo.com/imagem.jpg"
                                            className={`rounded-xl border-2 px-4 py-2 w-full ${
                                                userForm.formState.errors.avatar ? 'border-red-500' : 'border-aborder'
                                            }`}
                                            disabled={isSubmitting}
                                        />
                                        {userForm.formState.errors.avatar && (
                                            <p className="text-red-500 text-sm mt-1">{userForm.formState.errors.avatar.message}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <label className="mb-1">Nome do Responsável *</label>
                            <input 
                                type="text" 
                                {...userForm.register('name')}
                                className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                    userForm.formState.errors.name ? 'border-red-500' : 'border-aborder'
                                }`}
                                disabled={isSubmitting}
                            />
                            {userForm.formState.errors.name && (
                                <p className="text-red-500 text-sm mt-1 mb-4">{userForm.formState.errors.name.message}</p>
                            )}

                            <div className="flex flex-col mb-6">
                                <label className="mb-1">E-mail *</label>
                                <input 
                                    type="email" 
                                    {...userForm.register('email')}
                                    className={`rounded-xl border-2 px-4 py-2 w-full ${
                                        userForm.formState.errors.email ? 'border-red-500' : 'border-aborder'
                                    }`}
                                    disabled={isSubmitting}
                                />
                                {userForm.formState.errors.email && (
                                    <p className="text-red-500 text-sm mt-1 mb-4">{userForm.formState.errors.email.message}</p>
                                )}
                                <span className="text-sm text-muted-foreground mt-1">
                                    Esse e-mail ficará disponível no perfil como um meio de contato com a sua ONG.
                                </span>
                            </div>
                            
                            <div className="flex flex-row gap-8 w-full">
                                <div className="flex flex-col w-full">
                                    <label className="mb-1">Senha *</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            {...userForm.register('password')}
                                            className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                                userForm.formState.errors.password ? 'border-red-500' : 'border-aborder'
                                            }`}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {userForm.formState.errors.password && (
                                        <p className="text-red-500 text-sm mt-1 mb-4">{userForm.formState.errors.password.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col w-full">
                                    <label className="mb-1">Confirme sua senha *</label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            {...userForm.register('confirmPassword')}
                                            className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                                userForm.formState.errors.confirmPassword ? 'border-red-500' : 'border-aborder'
                                            }`}
                                            disabled={isSubmitting}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <Eye className="h-5 w-5" /> : <EyeClosed className="h-5 w-5" />}
                                        </button>
                                    </div>
                                    {userForm.formState.errors.confirmPassword && (
                                        <p className="text-red-500 text-sm mt-1 mb-4">{userForm.formState.errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-aprimary rounded-xl border-2 border-asecondary py-2 mt-2 font-bold text-asecondary hover:bg-asecondary hover:text-abackground transition-colors w-full disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? 'Carregando segunda etapa...' : 'Próximo'}
                                {!isSubmitting && <ArrowRight className="h-5 w-5" />}
                            </button>
                        </form>
                    )}

                    {/* Step 2 - Dados da ONG */}
                    {currentStep === 2 && (
                        <form onSubmit={ongForm.handleSubmit(onSubmitONGStep)} className="flex flex-col py-4 w-full">
                            <label className="mb-1">Nome da Instituição *</label>
                            <input 
                                type="text" 
                                {...ongForm.register('name_institution')}
                                className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                    ongForm.formState.errors.name_institution ? 'border-red-500' : 'border-aborder'
                                }`}
                                disabled={isSubmitting}
                            />
                            {ongForm.formState.errors.name_institution && (
                                <p className="text-red-500 text-sm mt-1 mb-4">{ongForm.formState.errors.name_institution.message}</p>
                            )}

                            <div className="flex flex-row gap-8 w-full">
                                <div className="flex flex-col w-full">
                                    <label className="mb-1">CPF do Responsável *</label>
                                    <input
                                        type="text"
                                        {...ongForm.register('document_responsible')}
                                        onChange={(e) => formatCPF(e.target.value)}
                                        value={ongForm.watch('document_responsible')}
                                        placeholder="000.000.000-00"
                                        className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                            ongForm.formState.errors.document_responsible ? 'border-red-500' : 'border-aborder'
                                        }`}
                                        maxLength={14}
                                        disabled={isSubmitting}
                                    />
                                    {ongForm.formState.errors.document_responsible && (
                                        <p className="text-red-500 text-sm mt-1 mb-4">{ongForm.formState.errors.document_responsible.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-row gap-8 w-full">
                                <div className="flex flex-col w-full">
                                    <label className="mb-1">CNPJ *</label>
                                    <input
                                        type="text"
                                        {...ongForm.register('cnpj')}
                                        onChange={(e) => formatCNPJ(e.target.value)}
                                        value={ongForm.watch('cnpj')}
                                        placeholder="00.000.000/0000-00"
                                        className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                            ongForm.formState.errors.cnpj ? 'border-red-500' : 'border-aborder'
                                        }`}
                                        maxLength={18}
                                        disabled={isSubmitting}
                                    />
                                    {ongForm.formState.errors.cnpj && (
                                        <p className="text-red-500 text-sm mt-1 mb-4">{ongForm.formState.errors.cnpj.message}</p>
                                    )}
                                </div>
                                <div className="flex flex-col w-full mb-6">
                                    <label className="mb-1">Celular *</label>
                                    <input
                                        type="text"
                                        {...ongForm.register('phone')}
                                        onChange={(e) => formatPhone(e.target.value)}
                                        value={ongForm.watch('phone')}
                                        placeholder="(00)00000-0000"
                                        className={`rounded-xl border-2 px-4 py-2 w-full ${
                                            ongForm.formState.errors.phone ? 'border-red-500' : 'border-aborder'
                                        }`}
                                        maxLength={15}
                                        disabled={isSubmitting}
                                    />
                                    {ongForm.formState.errors.phone && (
                                        <p className="text-red-500 text-sm mt-1 mb-4">{ongForm.formState.errors.phone.message}</p>
                                    )}
                                    <span className="text-sm text-muted-foreground mt-1">
                                        Esse número ficará disponível no perfil como um meio de contato com a sua ONG.
                                    </span>
                                </div>
                            </div>

                            <label className="mb-1">Endereço *</label>
                            <input 
                                type="text" 
                                {...ongForm.register('address')}
                                className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                    ongForm.formState.errors.address ? 'border-red-500' : 'border-aborder'
                                }`}
                                disabled={isSubmitting}
                            />
                            {ongForm.formState.errors.address && (
                                <p className="text-red-500 text-sm mt-1 mb-4">{ongForm.formState.errors.address.message}</p>
                            )}

                            <label className="mb-1">CEP *</label>
                            <input
                                type="text"
                                {...ongForm.register('cep')}
                                onChange={(e) => formatCEP(e.target.value)}
                                value={ongForm.watch('cep')}
                                placeholder="00000-000"
                                className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                    ongForm.formState.errors.cep ? 'border-red-500' : 'border-aborder'
                                }`}
                                maxLength={9}
                                disabled={isSubmitting}
                            />
                            {ongForm.formState.errors.cep && (
                                <p className="text-red-500 text-sm mt-1 mb-4">{ongForm.formState.errors.cep.message}</p>
                            )}

                            <label className="mb-1">Descrição da Instituição *</label>
                            <textarea 
                                {...ongForm.register('description')}
                                className={`w-full rounded-xl border-2 px-4 py-2 mb-6 h-24 ${
                                    ongForm.formState.errors.description ? 'border-red-500' : 'border-aborder'
                                }`}
                                disabled={isSubmitting}
                                placeholder="Descreva os objetivos e atividades da sua instituição..."
                            />
                            {ongForm.formState.errors.description && (
                                <p className="text-red-500 text-sm mt-1 mb-4">{ongForm.formState.errors.description.message}</p>
                            )}

                            <div className="flex gap-4">
                                <button 
                                    type="button"
                                    onClick={goBack}
                                    disabled={isSubmitting}
                                    className="bg-gray-300 rounded-xl border-2 border-gray-400 py-2 mt-2 font-bold text-gray-700 hover:bg-gray-400 transition-colors w-full disabled:opacity-70 flex items-center justify-center gap-2"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                    Voltar
                                </button>
                                <button 
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="bg-aprimary rounded-xl border-2 border-asecondary py-2 mt-2 font-bold text-asecondary hover:bg-asecondary hover:text-abackground transition-colors w-full disabled:opacity-70"
                                >
                                    {isSubmitting ? 'Finalizando cadastro...' : 'Finalizar Cadastro'}
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="flex fles-row text-sm gap-1 mt-4">
                        <span>Quer se cadastrar como usuário?</span>
                        <Link href="/cadastro/usuario" className="font-bold text-asecondary hover:underline">
                            Cadastre-se agora!
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}