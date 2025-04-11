import Footer from "@/components/footer"
import Header from "@/components/header"

export default function registerONG() {
    return (
        <div>
            <Header/>
            <main className="flex flex-col justify-between items-center min-w-screen mx-auto px-12 py-6 xl:py-8 h-full">
                <div className="flex flex-col items-center">
                    <h1 className="text-lg font-bold">Cadastro de Instituição</h1>
                    <form action="" className="py-4">
                        <label className="mb-1">Nome da Instituição *</label>
                        <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                        <label className="mb-1">Nome do Responsável *</label>
                        <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                        <label className="mb-1">E-mail *</label>
                        <input type="email" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">CNPJ *</label>
                                <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Celular *</label>
                                <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                            </div>
                        </div>
                        <label className="mb-1">Endereço *</label>
                        <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                        <label className="mb-1">CEP *</label>
                        <input type="text" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                        <div className="flex flex-row gap-8 w-full">
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Senha *</label>
                                <input type="password" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                            </div>
                            <div className="flex flex-col w-full">
                                <label className="mb-1">Confirme sua senha *</label>
                                <input type="password" className="rounded-xl border-2 px-4 py-3 mb-6" required/>
                            </div>
                        </div>
                        <label className="mb-1">Descrição</label>
                        <textarea className="w-full rounded-xl border-2 px-4 py-3 mb-6"/>
                        <button className="bg-primary rounded-xl border-2 border-secondary py-3 mt-2 font-bold text-secondary hover:bg-secondary hover:text-background transition-colors">
                            Cadastrar
                        </button>
                    </form>
                </div>
            </main>
            <Footer/>
        </div>
    )
}