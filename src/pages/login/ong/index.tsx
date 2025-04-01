import style from "@/styles/Form.module.css"
import Image from "next/image"
import Link from "next/link"

export default function loginONG() {
    return (
        <div className="flex columns-2">
            <div className={style.esquerda}>
                <div className={style.form}>
                    <h1>Login Usuário</h1>
                        <input type="text" placeholder="Insira seu e-mail"></input>
                        <input type="password" placeholder="Insira sua senha"></input>
                        <button>Entrar</button>
                    <span className="text-xs">Ainda não possui cadastro? <Link href="/register/ong">Cadastre-se agora!</Link></span>
                </div>
            </div>
            <div className={style.direita}>
                <Image
                    src="/login-user.jpg"
                    alt="User login image"
                    width={800}
                    height={800}
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}