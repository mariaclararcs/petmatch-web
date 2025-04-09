export default function registerUser() {
    return (
        <div>
            <h1>Cadastro de Usuário</h1>
            <form action="">
                <label htmlFor="">Nome:</label>
                <input type="text" />
                <label htmlFor="">E-mail:</label>
                <input type="text" />
                <label htmlFor="">Senha:</label>
                <input type="password" />
                <label htmlFor="">Confirmar a senha:</label>
                <input type="password" />
                <label htmlFor="">Data de Nascimento:</label>
                <input type="date" />
                <label htmlFor="">Celular:</label>
                <input type="text" />
                <button>Cadastrar</button>
            </form>
        </div>
    )
}