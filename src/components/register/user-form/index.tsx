"use client"

import { useState } from "react"
import * as React from "react"
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { ChevronDownIcon, Eye, EyeClosed } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  birthDate: z.string().min(1, 'Data de nascimento é obrigatória'),
  phone: z.string().min(14, 'Telefone incompleto').max(15, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço muito curto'),
  cep: z.string().length(9, 'CEP inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string(),
  avatar: z.string().url('URL da imagem inválida').optional().or(z.literal('')),
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

// Função para obter as iniciais do nome do usuário
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export default function RegisterUser() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors }
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            birthDate: '',
            phone: '',
            address: '',
            cep: '',
            password: '',
            confirmPassword: '',
            avatar: ''
        }
    })

    // Watch para o campo avatar e name para preview em tempo real
    const avatar = watch('avatar')
    const name = watch('name')

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

    const onSubmit = async (data: RegisterFormData) => {
        console.log('Form data:', data); // Debug log
        setIsSubmitting(true);
        setApiError(null);

        try {
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword,
                type_user: 'adopter',
                birth_date: data.birthDate,
                phone: data.phone.replace(/\D/g, ''),
                address: data.address,
                cep: data.cep.replace(/\D/g, ''),
                avatar: data.avatar || null
            };

            console.log('Sending to API:', userData); // Debug log
            
            const response = await fetch('http://localhost:8000/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro no cadastro');
            }

            const result = await response.json();
            console.log('Registration success:', result);
            router.push('/login'); // Redireciona para login após sucesso
            
        } catch (error: any) {
            console.error('Registration error:', error); // Debug log
            setApiError(
                error.message || 
                'Erro durante o cadastro. Tente novamente.'
            );
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <main className="flex flex-col justify-between items-center mx-auto px-12 py-6 xl:py-8 h-full">
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold">Cadastro de Usuário</h1>

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 w-full">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4 w-full max-w-2xl">
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
                                        {...register('avatar')}
                                        placeholder="https://exemplo.com/imagem.jpg"
                                        className={`rounded-xl border-2 px-4 py-2 w-full ${
                                            errors.avatar ? 'border-red-500' : 'border-aborder'
                                        }`}
                                        disabled={isSubmitting}
                                    />
                                    {errors.avatar && (
                                        <p className="text-red-500 text-sm mt-1">{errors.avatar.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <label className="mb-1">Nome *</label>
                        <input
                            type="text"
                            {...register('name')}
                            className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                errors.name ? 'border-red-500' : 'border-aborder'
                            }`}
                            disabled={isSubmitting}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                        
                        <div className="flex flex-col mb-6">
                            <label className="mb-1">E-mail *</label>
                            <input 
                                type="email"
                                {...register('email')}
                                className={`rounded-xl border-2 px-4 py-2 w-full ${
                                    errors.email ? 'border-red-500' : 'border-aborder'
                                }`}
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                            )}
                            <span className="text-sm text-muted-foreground mt-1">
                                Utilize um e-mail que você tenha acesso.
                            </span> 
                        </div>
                        
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Data de Nascimento *</label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className={`justify-between rounded-xl h-fit border-2 text-md px-4 py-2 mb-6 hover:bg-aborder hover:border-aborder ${
                                                errors.birthDate ? 'border-red-500' : 'border-aborder'
                                            }`}
                                            disabled={isSubmitting}
                                        >
                                            {date ? date.toLocaleDateString() : "00/00/0000"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        onSelect={(selectedDate) => {
                                            setDate(selectedDate)
                                            if (selectedDate) {
                                                setValue('birthDate', selectedDate.toISOString().split('T')[0])
                                            } else {
                                                setValue('birthDate', '')
                                            }
                                            setOpen(false)
                                        }}
                                        disabled={isSubmitting}
                                    />
                                    </PopoverContent>
                                </Popover>
                                {errors.birthDate && (
                                    <p className="text-red-500 text-sm mt-1">{errors.birthDate.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Celular *</label>
                                <input
                                    type="text"
                                    {...register('phone')}
                                    onChange={(e) => formatPhone(e.target.value)}
                                    value={watch('phone')}
                                    placeholder="(00)00000-0000"
                                    className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                        errors.phone ? 'border-red-500' : 'border-aborder'
                                    }`}
                                    maxLength={15}
                                    disabled={isSubmitting}
                                />
                                {errors.phone && (
                                    <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <label className="mb-1">Endereço *</label>
                        <input 
                            type="text"
                            {...register('address')}
                            className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                errors.address ? 'border-red-500' : 'border-aborder'
                            }`}
                            disabled={isSubmitting}
                        />
                        {errors.address && (
                            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                        )}
                        
                        <label className="mb-1">CEP *</label>
                        <input
                            type="text"
                            {...register('cep')}
                            onChange={(e) => formatCEP(e.target.value)}
                            value={watch('cep')}
                            placeholder="00000-000"
                            className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                errors.cep ? 'border-red-500' : 'border-aborder'
                             }`}
                            maxLength={9}
                            disabled={isSubmitting}
                        />
                        {errors.cep && (
                            <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>
                        )}
                        
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Senha *</label>
                                <div className="relative">
                                    <input
                                    type={showPassword ? "text" : "password"}
                                    className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                        errors.password ? "border-red-500" : "border-aborder"
                                    }`}
                                    {...register("password")}
                                    disabled={isSubmitting}
                                    />
                                    <button
                                    type="button"
                                    className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isSubmitting}
                                    >
                                    {showPassword ? (
                                        <Eye className="h-5 w-5" />
                                    ) : (
                                        <EyeClosed className="h-5 w-5" />
                                    )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Confirme sua senha *</label>
                                <div className="relative">
                                    <input
                                    type={showPassword ? "text" : "password"}
                                    className={`rounded-xl border-2 px-4 py-2 mb-6 w-full ${
                                        errors.confirmPassword ? "border-red-500" : "border-aborder"
                                    }`}
                                    {...register("confirmPassword")}
                                    disabled={isSubmitting}
                                    />
                                    <button
                                    type="button"
                                    className="absolute right-3 top-1/3 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isSubmitting}
                                    >
                                    {showPassword ? (
                                        <Eye className="h-5 w-5" />
                                    ) : (
                                        <EyeClosed className="h-5 w-5" />
                                    )}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-aprimary rounded-xl border-2 border-asecondary py-2 mt-2 font-bold text-asecondary hover:bg-asecondary hover:text-abackground transition-colors w-full disabled:opacity-70"
                        >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>

                    <div className="flex fles-row text-sm gap-1">
                        <span>Quer se cadastrar como ONG?</span>
                        <Link href="/cadastro/ong" className="font-bold text-asecondary hover:underline">
                            Cadastre-se agora!
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}