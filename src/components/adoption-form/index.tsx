export default function AdoptionForm () {
    return (
        <div className="flex flex-col mx-auto gap-8 px-20 py-6 xl:py-8 min-h-screen">
            <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold">Formulário de Adoção</h1>
                    <form action="" className="flex flex-col py-4 w-full">
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
                                <input 
                                    type="date"
                                    className="rounded-xl border-2 border-aborder px-4 py-2 mb-6"
                                />
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
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">2. Mora em casa ou apartamento?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">3. Você tem certeza que é permitido animais no imóvel?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">4. Caso more em uma casa, o quintal é cercado? O animal terá acesso à rua?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">5. O animal terá livre acesso ao interior da residência?</label>
                            <textarea className="w-full rounded-xl border-2 border-aborder px-4 py-2 mb-6"/>
                        <label className="mb-1">6. O que faria se precisasse mudar de residência, cidade ou estado?</label>
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