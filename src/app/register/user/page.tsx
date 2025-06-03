'use client'

import Footer from "@/components/footer"
import Header from "@/components/header"
import { useState } from "react"

export default function RegisterUser() {
    const [phone, setPhone] = useState('')
    const [cep, setCep] = useState('')

    const formatPhone = (value: string) => {
        value = value.replace(/\D/g, '')
        if (value.length > 11) value = value.substring(0, 11)
        
        if (value.length > 0) {
          value = `(${value.substring(0, 2)}${value.length > 2 ? ')' : ''}${value.substring(2)}`
        }
        if (value.length > 10) {
          value = `${value.substring(0, 9)}-${value.substring(9)}`
        }
        return value
    }

    const formatCEP = (value: string) => {
        value = value.replace(/\D/g, '')
        if (value.length > 8) value = value.substring(0, 8)
        
        if (value.length > 5) {
          value = `${value.substring(0, 5)}-${value.substring(5)}`
        }
        return value
    }

    return (
        <div>
            <Header/>
            <main className="flex flex-col justify-between items-center min-w-screen mx-auto px-12 py-6 xl:py-8 h-full">
                <div className="flex flex-col items-center w-full max-w-2xl">
                    <h1 className="text-lg font-bold">Cadastro de Usuário</h1>
                    <form action="" className="py-4 w-full">
                        <label className="mb-1">Nome *</label>
                        <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6 w-full" required/>
                        
                        <label className="mb-1">E-mail *</label>
                        <input type="email" className="rounded-xl border-2 px-4 py-3 mb-6 w-full" required/>
                        
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Data de Nascimento *</label>
                                <input type="date" className="rounded-xl border-2 px-4 py-3 mb-6 w-full" required/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Celular *</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    placeholder="(00)00000-0000"
                                    className="rounded-xl border-2 px-4 py-3 mb-6 w-full"
                                    maxLength={15}
                                    required
                                />
                            </div>
                        </div>
                        
                        <label className="mb-1">Endereço *</label>
                        <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6 w-full" required/>
                        
                        <label className="mb-1">CEP *</label>
                        <input
                            type="text"
                            value={cep}
                            onChange={(e) => setCep(formatCEP(e.target.value))}
                            placeholder="00000-000"
                            className="rounded-xl border-2 px-4 py-3 mb-6 w-full"
                            maxLength={9}
                            required
                        />
                        
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Senha *</label>
                                <input type="password" className="rounded-xl border-2 px-4 py-3 mb-6 w-full" required/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Confirme sua senha *</label>
                                <input type="password" className="rounded-xl border-2 px-4 py-3 mb-6 w-full" required/>
                            </div>
                        </div>
                        
                        <button 
                            type="button"
                            className="bg-primary rounded-xl border-2 border-secondary py-3 mt-2 font-bold text-secondary hover:bg-secondary hover:text-background transition-colors w-full"
                        >
                            Cadastrar
                        </button>
                    </form>
                </div>
            </main>
            <Footer/>
        </div>
    )
}