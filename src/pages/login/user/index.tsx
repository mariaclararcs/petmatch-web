import style from "@/styles/Form.module.css"
import font from "@/styles/Font.module.css"
import Image from "next/image"
import Link from "next/link"

export default function loginUser() {
    return (
        <div className="flex columns-2">
            <div className={style.esquerda}>
                <Image
                    src="/images/login-user.svg"
                    alt="User login image"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                />
            </div>
            <div className={style.direita}>
                <div className="flex flex-col justify-between items-center container mx-auto px-8 py-8 xl:py-12 h-full">
                    <div className="flex flex-col items-center w-full">
                        <div className={font.textoLogo}>
                            <span className="text-[52px] leading-[54px]">Pet Match</span>
                        </div>
                        <span className="text-lg">Encontre seu melhor amigo!</span>
                    </div>

                    <div className="flex flex-col items-center w-full gap-2">
                        <form action=""> 
                            <label className="mb-1">Insira o e-mail</label>
                            <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6"/>
                            
                            <label className="mb-1">Insira a senha</label>
                            <input type="password" className="rounded-xl border-2 px-4 py-3"/>
                            
                            <Link href="" className="font-bold text-sm text-secondary hover:underline">
                                Esqueci minha senha
                            </Link>
                            
                            <button className="bg-primary rounded-xl border-2 border-secondary py-3 mt-6 font-bold text-secondary hover:bg-secondary hover:text-background transition-colors">
                                Entrar
                            </button>
                        </form>
                        <Link href="/login/ong" className="font-bold text-sm text-secondary hover:underline">Entrar como ONG</Link>
                    </div>
                    
                    <div className="flex fles-row text-sm gap-1">
                        <span>Você ainda não possui cadastro?</span>
                        <Link href="/register/user" className="font-bold text-secondary hover:underline">Cadastre-se agora!</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}