'use client'

import style from "@/styles/Font.module.css"
import Link from "next/link" 
import * as React from "react"
import { useSession } from "next-auth/react"
import { NavUser } from "./nav-user"
import { NavAnimals } from "./nav-animals"
import { NavOngs } from "./nav-ongs"

export default function Header() {
    const { data: session } = useSession()

    return (
        <header className="w-full bg-aprimary py-6">
        <div className="flex flex-row justify-between items-center container mx-auto px-4">
            <div className="flex flex-row items-center gap-6 md:gap-12 lg:gap-24">
            <div className={style.textoLogo}>
                <Link href="/" className="flex items-center gap-3">
                    <span className="text-[40px] leading-[42px]">Pet Match</span>
                </Link>
            </div>

            <nav className="hidden md:flex flex-row items-center gap-10 lg:gap-20 text-lg">
                {session ? <NavOngs /> : 
                    <Link href="/ongs" className="hover:underline">
                        ONGs
                    </Link>
                }
                {session ? <NavAnimals /> : 
                    <Link href="/animais" className="hover:underline">
                        Animais
                    </Link>
                }
                <Link href="/sobre-nos" className="hover:underline">Sobre Nós</Link>
            </nav>
            </div>

            <div>
                {session ? <NavUser user={session.user} /> : 
                    <Link 
                        href="/login" 
                        className="bg-background rounded-xl border-2 border-asecondary px-6 py-3 font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors"
                    >
                        Entrar
                    </Link>
                }
            </div>
        </div>
        </header>
    )
}