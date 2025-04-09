import Header from "@/components/header"

export default function registerONG() {
    return (
        <div>
            <Header/>
            <main>
                <h1>Cadastro de Instituição</h1>
                <form action="">
                    <label htmlFor="">Nome da Instituição:</label>
                    <input type="text" />
                    <label htmlFor="">Nome do Responsável:</label>
                    <input type="text" />
                    <label htmlFor="">E-mail:</label>
                    <input type="text" />
                    <label htmlFor="">Senha:</label>
                    <input type="password" />
                    <label htmlFor="">Confirmar a senha:</label>
                    <input type="password" />
                    <label htmlFor="">Celular:</label>
                    <input type="text" />
                    <button>Cadastrar</button>
                </form>
            </main>
        </div>
    )
}