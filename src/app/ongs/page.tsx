/* Página contendo:
- Seção de filtragem por:
    - Ordenação alfabética dos nomes (A-Z, Z-A)
    - Tipo de animais que abriga (cachorros, gatos, outros)
    - Estado
    - Cidade
- Listagem de cards de ongs
*/

import Footer from "@/components/footer"
import Header from "@/components/header"

export default function Ongs() {
    return (
        <>
            <Header />
            <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 min-h-screen">
                ONGs
            </div>
            <Footer />
        </>
    )
}