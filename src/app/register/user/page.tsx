'use client'

import Footer from "@/components/footer"
import Header from "@/components/header"
import { useState } from "react"
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

// Schema de validação
const registerSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('E-mail inválido'),
  birthDate: z.string().refine(val => !isNaN(Date.parse(val)), 'Data inválida'),
  phone: z.string().min(14, 'Telefone incompleto').max(15, 'Telefone inválido'),
  address: z.string().min(5, 'Endereço muito curto'),
  cep: z.string().length(9, 'CEP inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterUser() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)

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
            confirmPassword: ''
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

    const onSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    setApiError(null);

    try {
        const response = await fetch('http://localhost:8000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                name: data.name,
                email: data.email,
                password: data.password,
                password_confirmation: data.confirmPassword,
                birth_date: data.birthDate,
                phone: data.phone.replace(/\D/g, ''),
                address: data.address,
                cep: data.cep.replace(/\D/g, '')
            })
        })

        const contentType = response.headers.get('content-type');
        
        // Verifica se a resposta é JSON
        if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(text.includes('<!DOCTYPE html>') 
            ? 'Erro interno do servidor' 
            : text)
        }

        const responseData = await response.json()

        if (!response.ok) {
        throw new Error(
            responseData.message || 
            responseData.errors?.join(', ') || 
            'Erro no cadastro'
        )
        }

        router.push('/') // Redireciona após sucesso
        } catch (error: any) {
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
            <Header/>
            <main className="flex flex-col justify-between items-center mx-auto px-12 py-6 xl:py-8 h-full">
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold">Cadastro de Usuário</h1>

                    {apiError && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 w-full">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col py-4">
                        <label className="mb-1">Nome *</label>
                        <input
                            type="text"
                            {...register('name')}
                            className={`rounded-xl border-2 px-4 py-3 mb-6 w-full ${
                                errors.name ? 'border-red-500' : 'border-border'
                            }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                        
                        <label className="mb-1">E-mail *</label>
                        <input 
                            type="email"
                            {...register('email')}
                            className={`rounded-xl border-2 px-4 py-3 mb-6 w-full ${
                                errors.email ? 'border-red-500' : 'border-border'
                            }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                        
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Data de Nascimento *</label>
                                <input 
                                    type="date"
                                    {...register('birthDate')}
                                    className={`rounded-xl border-2 px-4 py-3 mb-6 w-full ${
                                        errors.birthDate ? 'border-red-500' : 'border-border'
                                    }`}
                                />
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
                                    className={`rounded-xl border-2 px-4 py-3 mb-6 w-full ${
                                        errors.phone ? 'border-red-500' : 'border-border'
                                    }`}
                                    maxLength={15}
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
                            className={`rounded-xl border-2 px-4 py-3 mb-6 w-full ${
                                errors.address ? 'border-red-500' : 'border-border'
                            }`}
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
                            className={`rounded-xl border-2 px-4 py-3 mb-6 w-full ${
                                errors.cep ? 'border-red-500' : 'border-border'
                             }`}
                            maxLength={9}
                        />
                        {errors.cep && (
                            <p className="text-red-500 text-sm mt-1">{errors.cep.message}</p>
                        )}
                        
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Senha *</label>
                                <input 
                                    type="password" 
                                    {...register('password')}
                                    className={`rounded-xl border-2 px-4 py-3 mb-6 w-full ${
                                        errors.password ? 'border-red-500' : 'border-border'
                                    }`}
                                />
                                {errors.password && (
                                    <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Confirme sua senha *</label>
                                <input 
                                    type="password" 
                                    {...register('confirmPassword')}
                                    className={`rounded-xl border-2 px-4 py-3 mb-6 w-full ${
                                        errors.confirmPassword ? 'border-red-500' : 'border-border'
                                    }`}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>
                        
                        <button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-primary rounded-xl border-2 border-secondary py-3 mt-2 font-bold text-secondary hover:bg-secondary hover:text-background transition-colors w-full disabled:opacity-70"
                        >
                        {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
                        </button>
                    </form>
                </div>
            </main>
            <Footer/>
        </div>
    )
}