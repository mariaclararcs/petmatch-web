"use client"

import * as React from "react"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function AdoptionForm () {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)

    return (
        <div className="flex flex-col items-center mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
            <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold">Formulário de Adoção</h1>
                    <form action="" className="flex flex-col px-20 py-4">
                        <label className="mb-6">O formulário será enviado para a ONG: 
                            <span className="font-bold text-asecondary ml-1">Petss</span>
                        </label>
                        <label className="mb-6">Animal a ser adotado: 
                            <span className="font-bold text-asecondary ml-1">Estela</span>
                        </label>

                        <span className="font-bold mt-4 mb-6">Confirme seus dados</span>
                        <label className="mb-1">Nome do Responsável *</label>
                            <input type="text" className="rounded-xl border-2 border-aborder px-4 py-2 mb-6" required/>
                        <label className="mb-1">E-mail *</label>
                            <input type="email" className="rounded-xl border-2 border-aborder px-4 py-2 mb-6" required/>
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Data de Nascimento *</label>
                                <Popover open={open} onOpenChange={setOpen}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            id="date"
                                            className="justify-between rounded-xl h-fit border-2 border-aborder text-md px-4 py-2 mb-6 hover:bg-aborder hover:border-aborder"
                                        >
                                            {date ? date.toLocaleDateString() : "00/00/0000"}
                                            <ChevronDownIcon />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        captionLayout="dropdown"
                                        onSelect={(date) => {
                                        setDate(date)
                                        setOpen(false)
                                        }}
                                    />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Celular *</label>
                                <input
                                    type="text"
                                    placeholder="(00)00000-0000"
                                    className="rounded-xl border-2 border-aborder px-4 py-2 mb-6"
                                    maxLength={15}
                                />
                            </div>
                        </div>
                        <label className="mb-1">Endereço completo *</label>
                        <input type="text" className="rounded-xl border-2 border-aborder px-4 py-2 mb-6" required/>
                        <label className="mb-1">CEP *</label>
                        <input
                            type="text"
                            placeholder="00000-000"
                            className="rounded-xl border-2 border-aborder px-4 py-2 mb-6 w-full"
                            maxLength={9}
                            required
                        />

                        <span className="font-bold mt-4 mb-6">Questionário</span>
                        <label className="mb-1">1. Você está adotando este animal para ser:</label>
                            <Select>
                                <SelectTrigger className="w-full rounded-xl border-2 border-aborder text-md px-4 py-2 mb-6">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="companhia" className="text-md">Companhia</SelectItem>
                                    <SelectItem value="guarda" className="text-md">Guarda</SelectItem>
                                    <SelectItem value="outro" className="text-md">Outro</SelectItem>
                                </SelectContent>
                            </Select>
                        <label className="mb-1">2. Mora em casa ou apartamento?</label>
                            <Select>
                                <SelectTrigger className="w-full rounded-xl border-2 border-aborder text-md px-4 py-2 mb-6">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="casa" className="text-md">Casa</SelectItem>
                                    <SelectItem value="apartamento" className="text-md">Apartamento</SelectItem>
                                </SelectContent>
                            </Select>
                        <label className="mb-1">3. Você tem certeza que é permitido animais no imóvel?</label>
                            <Select>
                                <SelectTrigger className="w-full rounded-xl border-2 border-aborder text-md px-4 py-2 mb-6">
                                    <SelectValue placeholder="Selecione" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="nao" className="text-md">Não</SelectItem>
                                    <SelectItem value="sim" className="text-md">Sim, já verifiquei</SelectItem>
                                </SelectContent>
                            </Select>
                        <label className="mb-1">4. Caso more em uma casa, o quintal é cercado? O animal terá acesso à rua?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">5. O animal terá livre acesso ao interior da residência?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">6. O que faria se precisasse mudar de residência, cidade ou estado?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">7. Já possui outros animais na casa? Se sim, quais? São vacinados e castrados?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">8. Caso não tenha animais atualmente, já teve?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">9. Se houver outros animais atualmente, haverá espaço para fazer a adaptação e previnir uma briga territorial?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">10. Você ou alguém da sua família possuem alergia a pelos de animais? O que faria caso descobrisse que alguém da família possui alergia após a adoção do animal?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">11. O que faria com o animal em caso de viagem?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>

                        <span className="text-center mb-2">
                            Ao enviar este formulário o usuário concorda em compartilhar as informações com a ONG.
                        </span>
                        <button className="bg-aprimary rounded-xl border-2 border-asecondary py-2 mt-2 font-bold text-asecondary hover:bg-asecondary hover:text-abackground transition-colors">
                            Enviar formulário
                        </button>
                    </form>
                </div>
        </div>
    )
}