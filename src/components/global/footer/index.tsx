'use client'

import style from "@/styles/Font.module.css"
import Image from "next/image"
import Link from "next/link"

export default function Footer() {
    return (
        <footer className="w-full bg-amuted py-12">
            <div className="flex flex-row justify-between items-end container mx-auto px-4">
                <div className="flex flex-row items-center gap-20 lg:gap-24">
                    <div className="flex flex-row items-center text-lg gap-3">
                        <Image
                            alt="Pet Match Icon" 
                            src="/icons/pet-house.png"
                            width={90}
                            height={90}
                        />
                        <div className={style.textoLogo}>
                            <Link href="/" className="flex flex-col text-[40px] leading-[42px] text-asecondary">
                                <span>Pet</span>
                                <span>Match</span>
                            </Link>
                        </div>
                    </div>

                    <div className="flex flex-col font-bold text-md text-asecondary gap-[6px]">
                        <Link href="/ongs" className="hover:underline">ONGs</Link>
                        <Link href="/animals" className="hover:underline">Animais para adoção</Link>
                        <Link href="/about-us" className="hover:underline">Sobre Nós</Link>
                    </div>
                </div>

                <div className="text-sm text-asecondary">
                    <span>2025 - Pet Match</span>
                </div>
            </div>
        </footer>
    )
}