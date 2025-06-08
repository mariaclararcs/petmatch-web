"use client"

import { LoginFormData } from '@/interfaces/user'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginFormSchema } from '@/schemas/auth'
import { useForm } from 'react-hook-form'
import style from "@/styles/Form.module.css"
import font from "@/styles/Font.module.css"
import Image from "next/image"
import Link from "next/link"

export default function LoginONG() {
    const {
        register,
        handleSubmit,
        formState: { isSubmitting, errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginFormSchema),
    });
    
    const router = useRouter();
    
    async function handleSignInCredentials(data: LoginFormData) {
        const result = await signIn('credentials', {
            email: data.email,
            password: data.password,
            redirect: false,
        });
    
        if (result?.ok) {
          router.push('/dashboard')
        }
    }

    return (
        <div className="flex columns-2">
            <div className={style.esquerda}>
                <div className="flex flex-col justify-between items-center container px-6 py-8 xl:py-12 h-full">
                    <div className="flex flex-col items-center w-full">
                        <div className={font.textoLogo}>
                            <span className="text-[52px] leading-[54px]">Pet Match</span>
                        </div>
                        <span className="text-lg">Divulgue sua ONG!</span>
                    </div>

                    <div className="flex flex-col items-center w-full gap-2">
                        <form className="flex flex-col" onSubmit={handleSubmit(handleSignInCredentials)}> 
                            <label className="mb-1">Insira o e-mail</label>
                            <input 
                                type="email" 
                                className={`rounded-xl border-2 px-4 py-3 mb-6 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('email')}
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm mb-4">{errors.email.message}</p>
                            )}
                            
                            <label className="mb-1">Insira a senha</label>
                            <input 
                                type="password" 
                                className={`rounded-xl border-2 px-4 py-3 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                                {...register('password')}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm mb-4">{errors.password.message}</p>
                            )}
                            
                            <Link href="" className="font-bold text-sm text-secondary hover:underline">
                                Esqueci minha senha
                            </Link>
                            
                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-primary rounded-xl border-2 border-secondary py-3 mt-6 font-bold text-secondary hover:bg-secondary hover:text-background transition-colors">
                                {isSubmitting ? 'Entrando...' : 'Entrar'}
                            </button>
                        </form>
                        <Link href="/login/user" className="font-bold text-sm text-secondary hover:underline">Entrar como usuário</Link>
                    </div>
                    
                    <div className="flex fles-row text-sm gap-1">
                        <span>Sua ONG ainda não possui cadastro?</span>
                        <Link href="/register/ong" className="font-bold text-secondary hover:underline">Cadastre-se agora!</Link>
                    </div>
                </div>
            </div>
            <div className={style.direita}>
                <Image
                    src="/images/login-ong.svg"
                    alt="User login image"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}