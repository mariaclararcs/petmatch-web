'use client'

import style from "@/styles/Font.module.css"
import Link from "next/link" 
import * as React from "react"
//import { ChevronDown } from "lucide-react"

/*const animais = [
  {
    value: "cachorros",
    label: "Cachorros",
    href: "/animals",
  },
  {
    value: "gatos",
    label: "Gatos",
    href: "/animals",
  },
]*/

export default function Header() {
  //const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="w-full bg-primary py-6">
      <div className="flex flex-row justify-between items-center container mx-auto px-4">
        <div className="flex flex-row items-center gap-6 md:gap-12 lg:gap-24">
          <div className={style.textoLogo}>
            <Link href="/" className="flex items-center gap-3">
              <span className="text-[40px] leading-[42px]">Pet Match</span>
            </Link>
          </div>

          <nav className="hidden md:flex flex-row items-center gap-10 lg:gap-20 text-lg">
            <Link href="/ongs" className="hover:underline">
              ONGs
            </Link>

            <Link href="/animals" className="hover:underline">
              Animais
            </Link>
            
            {/*Dropdown de Animais
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 hover:underline"
                aria-expanded={isOpen}
                aria-haspopup="true"
              >
                Animais
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </button>
              
              {isOpen && (
                <div 
                  className="absolute z-10 mt-2 w-48 bg-background rounded-lg shadow-lg"
                  onMouseLeave={() => setIsOpen(false)}
                >
                  {animais.map((animal) => (
                    <Link
                      key={animal.value}
                      href={animal.href}
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-2 hover:bg-muted rounded-lg transition-colors"
                    >
                      {animal.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>*/}
            
            <Link href="/about-us" className="hover:underline">
              Sobre Nós
            </Link>
          </nav>
        </div>

        <div>
          <Link 
            href="/login/user" 
            className="bg-background rounded-xl border-2 border-secondary px-6 py-3 font-bold text-secondary hover:bg-secondary hover:text-background transition-colors"
          >
            Entrar
          </Link>
        </div>
      </div>
    </header>
  )
}