"use client"

import { Button } from "@/components/ui/button"
import font from "@/styles/Font.module.css"
import { zodResolver } from "@hookform/resolvers/zod"
import { signIn } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"

const loginFormSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

type LoginFormData = z.infer<typeof loginFormSchema>

export default function LoginForm() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
  })

  async function handleSignInCredentials(data: LoginFormData) {
    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast.error(result.error)
        return
      }

      if (result?.ok) {
        router.push("/")
      }
    } catch (error) {
      toast.error("Ocorreu um erro ao fazer login.")
      console.error(error)
    }
  }

  return (
    <div className="flex columns-2 min-h-screen">
      <div className="flex justify-center items-center w-full h-screen grid-cols-1">
        <div className="flex flex-col justify-between items-center container px-6 py-8 xl:py-12 h-full">
          <div className="flex flex-col items-center w-full">
            <div className={font.textoLogo}>
              <span className="text-[52px] leading-[54px]">Pet Match</span>
            </div>
            <span className="text-lg">Encontre seu melhor amigo!</span>
          </div>

          <div className="flex flex-col items-center w-full gap-2 m-8 sm:px-10 lg:px-20">
            <form
              className="flex flex-col w-full h-full"
              onSubmit={handleSubmit(handleSignInCredentials)}
            >
              <label className="mb-1">Insira o e-mail</label>
              <input
                type="email"
                className={`rounded-xl border-2 px-4 py-2 mb-4 ${
                  errors.email ? "border-red-500" : "border-aborder"
                }`}
                {...register("email")}
                disabled={isSubmitting}
              />
              {errors.email && <p className="text-red-500 text-sm mb-4">{errors.email.message}</p>}

              <label className="mb-1">Insira a senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`rounded-xl border-2 px-4 py-2 mb-1 w-full ${
                    errors.password ? "border-red-500" : "border-aborder"
                  }`}
                  {...register("password")}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <Eye className="h-5 w-5" />
                  ) : (
                    <EyeClosed className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm mb-4">{errors.password.message}</p>
              )}

              <Link href="#" className="font-bold text-sm text-asecondary hover:underline mb-6">
                Esqueci minha senha
              </Link>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-aprimary rounded-xl border-2 border-asecondary text-md py-4 mt-2 font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors"
              >
                {isSubmitting ? "Entrando..." : "Entrar"}
              </Button>
            </form>
            {/*<Link
              href="#"
              className="font-bold text-sm text-asecondary hover:underline"
            >
              Entrar como usuário
            </Link>*/}
          </div>

          <div className="flex fles-row text-sm gap-1">
            <span>Ainda não possui cadastro?</span>
            <Link href="/cadastro/usuario" className="font-bold text-asecondary hover:underline">
              Cadastre-se agora!
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center w-full h-screen grid-cols-1">
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
