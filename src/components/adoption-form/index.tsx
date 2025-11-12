"use client"

import * as React from "react"
import { ChevronDownIcon, ArrowLeftIcon, Star, MapPin, Phone, Mail } from "lucide-react"
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
import emailjs from '@emailjs/browser'
import Link from "next/link"

// Configuração do EmailJS (credenciais)
const EMAILJS_CONFIG = {
  serviceId: 'service_j1ip5vo', // Service ID do EmailJS
  templateId: 'template_x2p36cd', // Template ID do EmailJS
  publicKey: 'Gz9B6hknojpmtMweS', // Public Key do EmailJS
}

// Função de formatação de telefone
const formatPhoneNumber = (phone: string): string => {
  if (!phone) return ''
  
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.length === 11) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 7)}-${cleaned.substring(7)}`
  } else if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 2)}) ${cleaned.substring(2, 6)}-${cleaned.substring(6)}`
  } else {
    return phone
  }
}

// Função de formatação do tipo de animal
const formatAnimalType = (type: string): string => {
  switch (type?.toLowerCase()) {
    case 'dog':
      return 'Cachorro'
    case 'cat':
      return 'Gato'
    case 'other':
      return 'Outro'
    default:
      return type || 'Não informado'
  }
}

export default function AdoptionForm() {
    const { data: session } = useSession()
    const router = useRouter()
    const params = useParams()
    const animalId = params.id as string
    
    const { data: animalResponse, isLoading: isLoadingAnimal, isError: isErrorAnimal } = useGetAnimal(animalId)
    const animal = animalResponse?.data

    const { data: ongResponse, isLoading: isLoadingOng, isError: isErrorOng } = useGetOng(animal?.ong_id || '')
    const ong = ongResponse?.data

    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(undefined)
    const [currentStep, setCurrentStep] = React.useState(1)
    const [isSubmitting, setIsSubmitting] = React.useState(false)

    const [formData, setFormData] = React.useState({
        nome: "",
        email: "",
        dataNascimento: "",
        celular: "",
        endereco: "",
        cep: "",
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
    })

    // Inicializar EmailJS
    React.useEffect(() => {
        emailjs.init(EMAILJS_CONFIG.publicKey)
    }, [])

    // Verificar se o usuário está logado
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

    const isLoading = isLoadingAnimal || isLoadingOng
    if (isLoading) return <LoadingComponent />

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

    const formattedPhone = formatPhoneNumber(ong.phone)
    const formattedAnimalType = formatAnimalType(animal.type)

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

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhone(value)
        handleInputChange('celular', formatted)
    }

    const handleCEPChange = (value: string) => {
        const formatted = formatCEP(value)
        handleInputChange('cep', formatted)
    }

    const handleContinue = () => {
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

    const sendEmail = async (): Promise<boolean> => {
        try {
            // DIAGNÓSTICO: Ver todos os campos da ONG
            console.log('🔍 Diagnóstico completo da ONG:', {
                todosOsCampos: Object.keys(ong || {}),
                dadosCompletos: ong,
                emailCampo: ong?.email,
                ong_emailCampo: ong?.ong_email,
                emailInstitution: ong?.email_institution,
            })

            const ongEmail = 
                ong?.ong_email

            console.log('📧 Email da ONG encontrado:', ongEmail)

            // VERIFICAÇÃO CRÍTICA
            if (!ongEmail || !ongEmail.includes('@') || ongEmail === 'seu-email-fallback@dominio.com') {
                console.error('❌ Email da ONG inválido ou não encontrado. Campos disponíveis:', Object.keys(ong || {}))
                alert(`Erro: A ONG ${ong.name_institution} não possui um email válido cadastrado no sistema. Entre em contato diretamente com a ONG.`)
                return false
            }

            // Preparar dados para o email
            const templateParams = {
                to_email: ongEmail,
                from_name: "Sistema de Adoção PetAdopt",
                reply_to: formData.email,
                
                // Dados do solicitante
                nome_solicitante: formData.nome,
                email_solicitante: formData.email,
                data_nascimento: date?.toLocaleDateString('pt-BR') || '',
                celular: formData.celular,
                endereco: formData.endereco,
                cep: formData.cep,
                
                // Dados do animal - COM TIPO FORMATADO
                nome_animal: animal.name,
                idade_animal: animal.age,
                especie_animal: formattedAnimalType,
                
                // Dados da ONG
                nome_ong: ong.name_institution,
                email_ong: ongEmail,
                
                // Respostas do questionário
                pergunta1: formData.pergunta1,
                pergunta2: formData.pergunta2,
                pergunta3: formData.pergunta3,
                pergunta4: formData.pergunta4,
                pergunta5: formData.pergunta5,
                pergunta6: formData.pergunta6,
                pergunta7: formData.pergunta7,
                pergunta8: formData.pergunta8,
                pergunta9: formData.pergunta9,
                pergunta10: formData.pergunta10,
                
                // Data de envio
                data_envio: new Date().toLocaleDateString('pt-BR'),
                hora_envio: new Date().toLocaleTimeString('pt-BR'),
            }

            console.log('🚀 Enviando email para:', ongEmail)
            console.log('📤 Template params:', templateParams)
            console.log('🐾 Tipo do animal:', {
                original: animal.type,
                formatado: formattedAnimalType
            })

            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.templateId,
                templateParams
            )

            console.log('✅ Email enviado com sucesso!', response)
            return response.status === 200
            
        } catch (error: any) {
            console.error('❌ Erro detalhado ao enviar email:', {
                status: error?.status,
                text: error?.text,
                message: error?.message
            })
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        try {
            const emailSent = await sendEmail()
            
            if (emailSent) {
                setCurrentStep(3)
            } else {
                alert("Erro ao enviar formulário. Tente novamente.")
            }
        } catch (error) {
            alert("Erro ao enviar formulário. Tente novamente.")
        } finally {
            setIsSubmitting(false)
        }
    }

    console.log('🔍 TODOS os dados da ONG:', ong)
    console.log('🔍 Campos disponíveis:', Object.keys(ong || {}))
    console.log('🐾 Dados do animal:', {
        nome: animal.name,
        tipo: animal.type,
        tipoFormatado: formattedAnimalType
    })

    return (
        <div className="flex flex-col items-center mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
            <div className="flex flex-col items-center w-full max-w-4xl">
                <h1 className="text-lg font-bold mb-6">Formulário de Adoção</h1>
                
                {/* Header com Steps */}
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
                                    <span className="text-gray-600 ml-2">({formattedAnimalType})</span> {/* ← EXIBINDO TIPO FORMATADO */}
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
                                                            <SelectItem value="Companhia" className="text-md">Companhia</SelectItem>
                                                            <SelectItem value="Guarda" className="text-md">Guarda</SelectItem>
                                                            <SelectItem value="Outro" className="text-md">Outro</SelectItem>
                                                        </>
                                                    )}
                                                    {item.number === 2 && (
                                                        <>
                                                            <SelectItem value="Casa" className="text-md">Casa</SelectItem>
                                                            <SelectItem value="Apartamento" className="text-md">Apartamento</SelectItem>
                                                        </>
                                                    )}
                                                    {item.number === 3 && (
                                                        <>
                                                            <SelectItem value="Nao" className="text-md">Não</SelectItem>
                                                            <SelectItem value="Sim" className="text-md">Sim</SelectItem>
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
                                    disabled={isSubmitting}
                                    className={`flex justify-center items-center bg-aprimary rounded-xl border-2 border-asecondary text-md my-6 py-2 px-3 w-fit h-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors text-center ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    {isSubmitting ? 'Enviando...' : 'Enviar formulário'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* ETAPA 3: Confirmação */}
                    {currentStep === 3 && (
                        <div className="flex flex-col items-center justify-center text-center space-y-6 py-6 px-52">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                                <svg className="w-12 h-12 text-asecondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>

                            <h2 className="text-2xl font-bold text-asecondary">Formulário Enviado com Sucesso!</h2>
                            
                            <div className="bg-aprimarymuted rounded-xl py-4 space-y-4 w-full">
                                <h3 className="font-semibold text-lg">Detalhes do Envio</h3>
                                
                                <div className="flex justify-center">
                                    <div className="text-left space-y-3">
                                        <div className="flex flex-row gap-2">
                                            <span className="text-muted-foreground">ONG Destinatária:</span>
                                            <span className="font-medium">{ong.name_institution}</span>
                                        </div>
                                        
                                        <div className="flex flex-row gap-2">
                                            <span className="text-muted-foreground">Animal:</span>
                                            <span className="font-medium">{animal.name}</span>
                                        </div>
                                        
                                        <div className="flex flex-row gap-2">
                                            <span className="text-muted-foreground">Data de Envio:</span>
                                            <span className="font-medium">{new Date().toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        
                                        <div className="flex flex-row gap-2">
                                            <span className="text-muted-foreground">Hora:</span>
                                            <span className="font-medium">{new Date().toLocaleTimeString('pt-BR')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-4 w-full">
                                <h3 className="font-semibold text-lg">Próximos Passos</h3>
                                
                                <div className="text-left space-y-2 text-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-asecondary rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">
                                            1
                                        </div>
                                        <span>A ONG deve entrar em contato nos próximos dias</span>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-asecondary rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">
                                            2
                                        </div>
                                        <span>Esteja disponível no telefone <strong>{formData.celular}</strong></span>
                                    </div>
                                    
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 bg-asecondary rounded-full flex items-center justify-center text-white text-xs mt-1 flex-shrink-0">
                                            3
                                        </div>
                                        <span>Verifique sua caixa de entrada e spam do e-mail <strong>{formData.email}</strong></span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-aprimarymuted rounded-xl p-4 space-y-3 w-full">
                                <h3 className="font-semibold text-lg">Contato da ONG</h3>
                                <p className="text-sm">
                                    Caso tenha dúvidas, entre em contato diretamente com a ONG <strong>{ong.name_institution}</strong>:
                                </p>
                                <div className="flex flex-col gap-2 text-start">
                                    <div className="flex flex-row items-center gap-2 text-sm">
                                        <Phone />
                                        <span className="">
                                            {formattedPhone}
                                        </span>
                                    </div>
                                    <div className="flex flex-row items-center gap-2 text-sm">
                                        <Mail />
                                        <span className="">
                                            {ong.ong_email}
                                        </span>
                                    </div>
                                    <div className="flex flex-row items-center gap-2 text-sm">
                                        <MapPin />
                                        <span className="">
                                            {ong.address}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6">
                                <Link 
                                    href="/"
                                    className="bg-aprimary rounded-xl border-2 border-asecondary py-2 px-6 w-full font-bold text-asecondary hover:bg-asecondary hover:text-background transition-colors text-center block"
                                >
                                    Voltar para Tela Inicial
                                </Link>
                            </div>

                            <p className="text-sm text-muted-foreground italic max-w-md">
                                Obrigado por escolher a adoção responsável! 💙
                            </p>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}