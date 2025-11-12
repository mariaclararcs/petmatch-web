import Image from "next/image";

export default function AdoptionInfo() {
    return (
        <div className="flex flex-col justify-center items-center bg-aprimarymuted rounded-xl py-6 px-20 space-y-6 w-full">
            <h3 className="font-semibold text-lg">O que fazer quando quiser adotar</h3>
            <div className="flex flex-row gap-6 text-center justify-center">
                <div className="flex flex-col items-center gap-2 w-72">
                    <Image
                        alt="Pet Find" 
                        src="/icons/pet-find.png"
                        className="mb-2"
                        width={92}
                        height={92}
                    />
                    <span className="font-semibold text-asecondary">Encontre um pet</span>
                    <span className="text-sm">Entre na tela de informações do animal escolhido e clique em "Formulário de Adoção"</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-72">
                    <Image
                        alt="Pet Form" 
                        src="/icons/pet-form.png"
                        className="mb-2"
                        width={92}
                        height={92}
                    />
                    <span className="font-semibold text-asecondary">Preencha o formulário de adoção</span>
                    <span className="text-sm">Insira suas informações, dados para contato e responda o questionário</span>
                </div>
                <div className="flex flex-col items-center gap-2 w-72">
                    <Image
                        alt="Pet Love" 
                        src="/icons/pet-love.png"
                        className="mb-2"
                        width={92}
                        height={92}
                    />
                    <span className="font-semibold text-asecondary">Formulário enviado</span>
                    <span className="text-sm">A ONG receberá seu formulário e entrará em contato com você nos próximos dias para informar os próximos passos</span>
                </div>
            </div>
        </div>
    )
}