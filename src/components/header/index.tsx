"use client"

import style from "@/styles/Font.module.css"
import Link from "next/link" 
import * as React from "react"
import { ChevronDown } from "lucide-react"

const animais = [
  {
    value: "cachorros",
    label: "Cachorros",
    href: "/login/user", // Adicione o caminho para cada animal
  },
  {
    value: "gatos",
    label: "Gatos",
    href: "/login/user",
  },
]

export default function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex flex-row justify-between items-center min-h-24 min-w-screen px-10 bg-primary">
      <div className="flex flex-row items-center gap-24 lg:gap-32 text-lg">
        <div className={style.textoLogo}>
          <Link href="/">
            <span className="text-4xl">Pet Match</span>
          </Link>
        </div>

        <Link href="/ongs" className="">ONGs</Link>
        
        {/* Combobox Customizada com Links */}
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center justify-between gap-2 px-4 py-2 text-left hover:bg-gray-100 rounded-md transition-colors"
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            Animais
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>
          
          {isOpen && (
            <div 
              className="absolute z-10 mt-1 w-[200px] bg-background border rounded-lg shadow-lg"
              // onMouseLeave={() => setIsOpen(false)} Fecha quando o mouse sai
            >
              {animais.map((animal) => (
                <Link
                  key={animal.value}
                  href={animal.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-2 hover:bg-muted rounded-lg transition-colors ${
                    // Você pode adicionar lógica para destacar a página atual se quiser
                    false ? "bg-muted font-medium" : ""
                  }`}
                >
                  {animal.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        
        <Link href="/sobre">Sobre Nós</Link>
      </div>

      <div>
        <button className="bg-background rounded-xl border-2 border-secondary px-8 py-4 font-bold text-secondary">
          Entrar
        </button>
      </div>
    </div>
  )
}