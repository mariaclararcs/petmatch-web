'use client'

import style from "@/styles/Font.module.css"
import Link from "next/link" 
import * as React from "react"
import { useSession } from "next-auth/react";
import { NavUser } from "./nav-user";

export default function Header() {
    const { data: session } = useSession()

    return (
        <header className="w-full bg-aprimary py-6">
        <div className="flex flex-row justify-between items-center container mx-auto px-4">
            <div className="flex flex-row items-center gap-6 md:gap-12 lg:gap-24">
            <div className={style.textoLogo}>
                <Link href="/home" className="flex items-center gap-3">
                <span className="text-[40px] leading-[42px]">Pet Match</span>
                </Link>
            </div>

            <nav className="hidden md:flex flex-row items-center gap-10 lg:gap-20 text-lg">
                <Link href="#" className="hover:underline">
                ONGs
                </Link>

                <Link href="/animais" className="hover:underline">
                Animais
                </Link>
                
                <Link href="#" className="hover:underline">
                Sobre Nós
                </Link>
            </nav>
            </div>

            <div>
                {session ? <NavUser user={session.user} /> : 
                    <Link 
                        href="/" 
                        className="bg-abackground rounded-xl border-2 border-asecondary px-6 py-3 font-bold text-asecondary hover:bg-asecondary hover:text-abackground transition-colors"
                    >
                        Entrar
                    </Link>
                }
            </div>
        </div>
        </header>
    )
}