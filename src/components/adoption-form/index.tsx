"use client"

import * as React from "react"
import { ChevronDownIcon, ArrowLeftIcon, Star } from "lucide-react"
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
import { useSession } from "next-auth/react"
import { useRouter, useParams } from "next/navigation"
import { useGetAnimal } from "@/hooks/animal/useGetAnimal"
import { useGetOng } from "@/hooks/ongs/useGetOng"
import LoadingComponent from "@/components/loading"

// Função de formatação de telefone
const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ''
  
  // Remove todos os caracteres não numéricos
  const cleaned = phone.replace(/\D/g, '')
  
  // Aplica a formatação baseada no tamanho do número
  if (cleaned.length === 11) {
    // Formato para celular: (11) 99999-9999
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`
  } else if (cleaned.length === 10) {
    // Formato para telefone fixo: (11) 9999-9999
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`
  } else {
    // Retorna o número original se não for um formato conhecido
    return phone
  }
}

export default function AdoptionForm() {
    const { data: session } = useSession()
    const router = useRouter()
    const params = useParams()
    const animalId = params.id as string
    
    // Buscar dados do animal - SEMPRE chamado, independente da sessão
    const { data: animalResponse, isLoading: isLoadingAnimal, isError: isErrorAnimal } = useGetAnimal(animalId)
    const animal = animalResponse?.data

    // Buscar dados completos da ONG usando o ID da ONG do animal
    const { data: ongResponse, isLoading: isLoadingOng, isError: isErrorOng } = useGetOng(animal?.ong_id || '')
    const ong = ongResponse?.data

    // Estados do formulário - SEMPRE chamados
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [currentStep, setCurrentStep] = React.useState(1) // 1 = Dados, 2 = Questionário

    // Dados do formulário - SEMPRE chamado
    const [formData, setFormData] = React.useState({
        nome: "",
        email: "",
        dataNascimento: "",
        celular: "",
        endereco: "",
        cep: "",
        // Perguntas do questionário
        pergunta1: "",
        pergunta2: "",
        pergunta3: "",
        pergunta4: "",
        pergunta5: "",
        pergunta6: "",
        pergunta7: "",
        pergunta8: "",
        pergunta9: "",
        pergunta10: "",
        pergunta11: "",
    })

    // Verificar se o usuário está logado - AGORA DEPOIS DOS HOOKS
    if (!session) {
        return (
            <div className="flex flex-col items-center mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
                <div className="flex flex-col items-center w-full max-w-2xl text-center">
                    <h1 className="text-2xl font-bold mb-6">Formulário de Adoção</h1>
                    <p className="text-lg text-gray-600 mb-6">
                        Você precisa estar logado para enviar o formulário de adoção.
                    </p>
                    <Button
                        onClick={() => router.push('/login')}
                        className="bg-asecondary text-white hover:bg-asecondary/90"
                    >
                        Fazer Login
                    </Button>
                </div>
            </div>
        )
    }

    // Loading enquanto carrega os dados do animal e da ONG
    const isLoading = isLoadingAnimal || isLoadingOng
    if (isLoading) return <LoadingComponent />

    // Erro ao carregar animal ou ONG
    const isError = isErrorAnimal || isErrorOng
    if (isError || !animal || !ong) {
        return (
            <div className="flex flex-col items-center mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
                <div className="flex flex-col items-center w-full max-w-2xl text-center">
                    <h1 className="text-2xl font-bold mb-6">Formulário de Adoção</h1>
                    <p className="text-lg text-red-500 mb-6">
                        {!animal ? "Erro ao carregar informações do animal." : "Erro ao carregar informações da ONG."} Tente novamente mais tarde.
                    </p>
                    <Button
                        onClick={() => router.push('/')}
                        className="bg-asecondary text-white hover:bg-asecondary/90"
                    >
                        Voltar para Home
                    </Button>
                </div>
            </div>
        )
    }

    // Formata o telefone da ONG
    const formattedPhone = formatPhoneNumber(ong.phone)

    // Resto das funções...
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

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Funções específicas para campos formatados
    const handlePhoneChange = (value: string) => {
        const formatted = formatPhone(value)
        handleInputChange('celular', formatted)
    }

    const handleCEPChange = (value: string) => {
        const formatted = formatCEP(value)
        handleInputChange('cep', formatted)
    }

    const handleContinue = () => {
        // Validação básica dos dados antes de continuar
        if (!formData.nome || !formData.email || !date || 
            !formData.celular || !formData.endereco || !formData.cep) {
            alert("Por favor, preencha todos os campos obrigatórios")
            return
        }
        setCurrentStep(2)
    }

    const handleBack = () => {
        setCurrentStep(1)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Lógica para enviar o formulário
        console.log("Formulário enviado:", formData)
        console.log("Animal:", animal.name)
        console.log("ONG:", ong.name_institution)

        setCurrentStep(3)
    }

    return (
        <div className="flex flex-col items-center mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
            <div className="flex flex-col items-center w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">Formulário de Adoção</h1>
                
                {/* Indicador de progresso */}
                <div className="flex items-center justify-center mb-8 w-full">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-asecondary text-white' : 'bg-gray-300 text-gray-600'}`}>
                        1
                    </div>
                    <div className={`h-1 w-20 ${currentStep >= 2 ? 'bg-asecondary' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-asecondary text-white' : 'bg-gray-300 text-gray-600'}`}>
                        2
                    </div>
                    <div className={`h-1 w-20 ${currentStep >= 2 ? 'bg-asecondary' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-asecondary text-white' : 'bg-gray-300 text-gray-600'}`}>
                        <Star className="w-5 h-5" />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col w-full">
                    {/* ETAPA 1: Dados Pessoais */}
                    {currentStep === 1 && (
                        <div className="flex flex-col space-y-6">
                            <div className="flex flex-col justify-center items-center text-center mb-6">
                                <label className="mb-6 block">O formulário será enviado para a ONG: 
                                    <span className="font-bold text-asecondary ml-1">{ong.name_institution}</span>
                                </label>
                                <label className="mb-6 block">Animal a ser adotado: 
                                    <span className="font-bold text-asecondary ml-1">{animal.name}</span>
                                </label>
                            </div>

                            <h2 className="font-bold text-xl mb-6 text-center">Confirme seus dados</h2>
                            
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <label className="block mb-2 font-medium">Nome Completo *</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-xl border-2 border-aborder px-4 py-2"
                                        value={formData.nome}
                                        onChange={(e) => handleInputChange('nome', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">E-mail *</label>
                                    <input 
                                        type="email" 
                                        className="w-full rounded-xl border-2 border-aborder px-4 py-2"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-2 font-medium">Data de Nascimento *</label>
                                        <Popover open={open} onOpenChange={setOpen}>
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="justify-between w-full rounded-xl h-fit border-2 border-aborder text-md px-4 py-2 hover:bg-aborder hover:border-aborder"
                                                >
                                                    {date ? date.toLocaleDateString() : "00/00/0000"}
                                                    <ChevronDownIcon />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={(selectedDate) => {
                                                        setDate(selectedDate)
                                                        setOpen(false)
                                                        if (selectedDate) {
                                                            handleInputChange('dataNascimento', selectedDate.toISOString())
                                                        }
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    <div>
                                        <label className="block mb-2 font-medium">Celular *</label>
                                        <input
                                            type="text"
                                            placeholder="(00) 00000-0000"
                                            className="w-full rounded-xl border-2 border-aborder px-4 py-2"
                                            value={formData.celular}
                                            onChange={(e) => handlePhoneChange(e.target.value)}
                                            maxLength={15}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">Endereço Completo *</label>
                                    <input 
                                        type="text" 
                                        className="w-full rounded-xl border-2 border-aborder px-4 py-2"
                                        value={formData.endereco}
                                        onChange={(e) => handleInputChange('endereco', e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block mb-2 font-medium">CEP *</label>
                                    <input
                                        type="text"
                                        placeholder="00000-000"
                                        className="w-full rounded-xl border-2 border-aborder px-4 py-2"
                                        value={formData.cep}
                                        onChange={(e) => handleCEPChange(e.target.value)}
                                        maxLength={9}
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="button"
                                onClick={handleContinue}
                                className="flex justify-center items-center bg-aprimary rounded-xl border-2 border-asecondary text-md my-6 py-2 w-fit h-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors text-center"
                            >
                                Continuar
                            </Button>
                        </div>
                    )}

                    {/* ETAPA 2: Questionário */}
                    {currentStep === 2 && (
                        <div className="flex flex-col space-y-6">
                            <h2 className="font-bold text-xl mb-6 text-center">Questionário</h2>
                            <div className="space-y-6">
                                {[
                                    { number: 1, question: "Você está adotando este animal para ser:" },
                                    { number: 2, question: "Mora em casa ou apartamento?" },
                                    { number: 3, question: "Você tem certeza que é permitido animais no imóvel?" },
                                    { number: 4, question: "Caso more em uma casa, o quintal é cercado? O animal terá acesso à rua?" },
                                    { number: 5, question: "O animal terá livre acesso ao interior da residência?" },
                                    { number: 6, question: "O que faria se precisasse mudar de residência, cidade ou estado?" },
                                    { number: 7, question: "Já possui outros animais na casa? Se sim, quais? São vacinados e castrados?" },
                                    { number: 8, question: "Caso não tenha animais atualmente, já teve?" },
                                    { number: 9, question: "Se houver outros animais atualmente, haverá espaço para fazer a adaptação e previnir uma briga territorial?" },
                                    { number: 10, question: "O que faria com o animal em caso de viagem?" }
                                ].map((item, index) => (
                                    <div key={item.number} className="space-y-2">
                                        <label className="block font-medium">
                                            {item.number}. {item.question}
                                        </label>
                                        
                                        {item.number <= 3 ? (
                                            <Select
                                                value={formData[`pergunta${item.number}` as keyof typeof formData]}
                                                onValueChange={(value) => handleInputChange(`pergunta${item.number}`, value)}
                                            >
                                                <SelectTrigger className="w-full rounded-xl border-2 border-aborder text-md px-4 py-2">
                                                    <SelectValue placeholder="Selecione" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {item.number === 1 && (
                                                        <>
                                                            <SelectItem value="companhia" className="text-md">Companhia</SelectItem>
                                                            <SelectItem value="guarda" className="text-md">Guarda</SelectItem>
                                                            <SelectItem value="outro" className="text-md">Outro</SelectItem>
                                                        </>
                                                    )}
                                                    {item.number === 2 && (
                                                        <>
                                                            <SelectItem value="casa" className="text-md">Casa</SelectItem>
                                                            <SelectItem value="apartamento" className="text-md">Apartamento</SelectItem>
                                                        </>
                                                    )}
                                                    {item.number === 3 && (
                                                        <>
                                                            <SelectItem value="nao" className="text-md">Não</SelectItem>
                                                            <SelectItem value="sim" className="text-md">Sim, já verifiquei</SelectItem>
                                                        </>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        ) : (
                                            <textarea 
                                                className="w-full rounded-xl border-2 border-aborder px-4 py-2 min-h-[100px]"
                                                value={formData[`pergunta${item.number}` as keyof typeof formData]}
                                                onChange={(e) => handleInputChange(`pergunta${item.number}`, e.target.value)}
                                                placeholder="Digite sua resposta..."
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="text-center mb-4 mt-8">
                                <span className="text-sm text-muted-foreground">
                                    Ao enviar este formulário o usuário concorda em compartilhar as informações com a ONG.
                                </span>
                            </div>
                            
                            <div className="flex flex-row justify-between items-center mb-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleBack}
                                    className="flex justify-center items-center rounded-xl border-2 border-aborder text-md my-6 mr-4 py-2 px-3 w-fit h-full hover:bg-aborder hover:text-background hover:border-aborder transition-colors text-center"
                                >
                                    <ArrowLeftIcon className="h-4 w-4" />
                                    Voltar
                                </Button>
                                <button 
                                    type="submit"
                                    onClick={handleContinue}
                                    className="flex justify-center items-center bg-aprimary rounded-xl border-2 border-asecondary text-md my-6 py-2 px-3 w-fit h-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors text-center"
                                >
                                    Enviar formulário
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ETAPA 3: Questionário Enviado */}
                    {currentStep === 3 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                            {/* Ícone de sucesso */}
                            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>

                            {/* Mensagem principal */}
                            <h2 className="text-3xl font-bold text-green-600">Formulário Enviado com Sucesso!</h2>
                            
                            {/* Informações detalhadas */}
                            <div className="bg-gray-50 rounded-xl p-6 space-y-4 max-w-md">
                                <h3 className="font-semibold text-lg">Detalhes do Envio</h3>
                                
                                <div className="text-left space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">ONG Destinatária:</span>
                                        <span className="font-medium">{ong.name_institution}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Animal:</span>
                                        <span className="font-medium">{animal.name}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Data de Envio:</span>
                                        <span className="font-medium">{new Date().toLocaleDateString('pt-BR')}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Hora:</span>
                                        <span className="font-medium">{new Date().toLocaleTimeString('pt-BR')}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Instruções próximas */}
                            <div className="space-y-4 max-w-md">
                                <h3 className="font-semibold text-lg">Próximos Passos</h3>
                                
                                <div className="text-left space-y-2 text-sm text-muted-foreground">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-asecondary rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">
                                            1
                                        </div>
                                        <span>A ONG entrará em contato nos próximos dias</span>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-asecondary rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">
                                            2
                                        </div>
                                        <span>Esteja disponível no celular {formData.celular}</span>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-asecondary rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">
                                            3
                                        </div>
                                        <span>Verifique sua caixa de entrada e spam do e-mail {formData.email}</span>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-asecondary rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">
                                            4
                                        </div>
                                        <span>Prepare-se para uma possível visita da ONG ao seu endereço</span>
                                    </div>
                                </div>
                            </div>

                            {/* Contato da ONG */}
                            <div className="bg-blue-50 rounded-xl p-6 space-y-3 max-w-md">
                                <h3 className="font-semibold text-lg">Contato da ONG</h3>
                                <p className="text-sm text-muted-foreground">
                                    Caso tenha dúvidas, entre em contato diretamente com a ONG {ong.name_institution}:
                                </p>
                                <div className="space-y-1 text-sm">
                                    <div>📧 {ong.email || "email@ong.org.br"}</div>
                                    <div>📞 {formattedPhone || "(00) 00000-0000"}</div>
                                    <div>📍 {ong.address || "Endereço da ONG"}</div>
                                </div>
                            </div>

                            {/* Botões de ação */}
                            <div className="flex gap-4 pt-6">
                                <Button
                                    onClick={() => window.location.href = '/'}
                                    className="bg-asecondary text-white hover:bg-asecondary/90"
                                >
                                    Voltar para Home
                                </Button>
                            </div>

                            {/* Mensagem final */}
                            <p className="text-sm text-muted-foreground italic max-w-md">
                                Obrigado por escolher a adoção responsável! 💚
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}