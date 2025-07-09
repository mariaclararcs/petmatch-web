'use client'

import { useState } from "react"

export default function RegisterONG() {
    const [phone, setPhone] = useState('')
    const [cep, setCep] = useState('')
    const [cnpj, setCnpj] = useState('')

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

    const formatCNPJ = (value: string) => {
        value = value.replace(/\D/g, '')
        if (value.length > 14) value = value.substring(0, 14)
        
        if (value.length > 0) {
            value = value.replace(/^(\d{2})(\d)/, '$1.$2')
        }
        if (value.length > 3) {
            value = value.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
        }
        if (value.length > 7) {
            value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3/$4')
        }
        if (value.length > 12) {
            value = value.replace(/^(\d{2})\.(\d{3})\.(\d{3})\/(\d{4})(\d)/, '$1.$2.$3/$4-$5')
        }
        return value
    }

    return (
        <div>
            <main className="flex flex-col justify-between items-center mx-auto px-12 py-6 xl:py-8 h-full">
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold">Cadastro de Instituição</h1>
                    <form action="" className="flex flex-col py-4">
                        <label className="mb-1">Nome da Instituição *</label>
                        <input type="text" className="rounded-xl border-2 border-aborder px-4 py-3 mb-6" required/>
                        <label className="mb-1">Nome do Responsável *</label>
                        <input type="text" className="rounded-xl border-2 border-aborder px-4 py-3 mb-6" required/>
                        <label className="mb-1">E-mail *</label>
                        <input type="email" className="rounded-xl border-2 border-aborder px-4 py-3 mb-6" required/>
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">CNPJ *</label>
                                <input
                                    type="text"
                                    value={cnpj}
                                    onChange={(e) => setCnpj(formatCNPJ(e.target.value))}
                                    placeholder="00.000.000/0000-00"
                                    className="rounded-xl border-2 border-aborder px-4 py-3 mb-6 w-full"
                                    maxLength={18}
                                    required
                                />
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Celular *</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(formatPhone(e.target.value))}
                                    placeholder="(00)00000-0000"
                                    className="rounded-xl border-2 border-aborder px-4 py-3 mb-6 w-full"
                                    maxLength={15}
                                    required
                                />
                            </div>
                        </div>
                        <label className="mb-1">Endereço *</label>
                        <input type="text" className="rounded-xl border-2 border-aborder px-4 py-3 mb-6" required/>
                        <label className="mb-1">CEP *</label>
                        <input
                            type="text"
                            value={cep}
                            onChange={(e) => setCep(formatCEP(e.target.value))}
                            placeholder="00000-000"
                            className="rounded-xl border-2 border-aborder px-4 py-3 mb-6 w-full"
                            maxLength={9}
                            required
                        />
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Senha *</label>
                                <input type="password" className="rounded-xl border-2 border-aborder px-4 py-3 mb-6" required/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Confirme sua senha *</label>
                                <input type="password" className="rounded-xl border-2 border-aborder px-4 py-3 mb-6" required/>
                            </div>
                        </div>
                        <label className="mb-1">Descrição</label>
                        <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-3 mb-6"/>
                        <button className="bg-aprimary rounded-xl border-2 border-asecondary py-3 mt-2 font-bold text-asecondary hover:bg-asecondary hover:text-abackground transition-colors">
                            Cadastrar
                        </button>
                    </form>
                </div>
            </main>
        </div>
    )
}