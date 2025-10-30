import style from "@/styles/Font.module.css"
import Image from "next/image"
import { Check } from "lucide-react"

export default function AboutUs() {
  return (
    <div className="flex flex-col justify-center items-center mx-auto px-6 md:px-20 py-12 max-w-6xl">
      <div className="flex flex-col gap-2 items-center text-center mb-6">
        <Image
          alt="Pet Match Icon" 
          src="/icons/pet-house2.svg"
          className="mb-2"
          width={92}
          height={92}
        />
        <div className={style.textoLogo}>
          <span className="text-[52px] leading-[54px]">Pet Match</span>
        </div>
        <span className="text-lg">Sobre a plataforma</span>
      </div>

      <section className="px-8 pt-8">
        <p className="text-lg leading-relaxed">
          O Pet Match nasceu da necessidade de conectar animais resgatados a lares amorosos de forma mais ágil e eficiente, enquanto apoia as ONGs e abrigos que dedicam seus esforços a essa causa. Sabemos que o processo de adoção pode ser burocrático e que muitas instituições enfrentam desafios para divulgar seus animais e arrecadar recursos. Por isso, criamos uma plataforma intuitiva e acessível, onde adotantes podem encontrar seu novo melhor amigo com facilidade, e ONGs podem ampliar seu alcance, garantindo mais adoções responsáveis e doações seguras.
        </p>
      </section>
      
      <section className="px-8 pt-8">
        <h3 className="text-xl font-semibold mb-3">Nossa missão</h3>
        <p className="text-lg leading-relaxed">
          Nossa missão é transformar a realidade de milhares de animais abandonados, oferecendo uma ferramenta que simplifica a busca por um companheiro perfeito. No Pet Match, você encontrará:
        </p>

        {/* Cards de Destaque */}
        <div className="grid md:grid-cols-2 gap-6 p-8">
          <div className="bg-aprimary p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Para Adotantes</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check />
                <span>Encontre seu companheiro ideal com filtros personalizados</span>
              </li>
              <li className="flex items-start gap-2">
                <Check />
                <span>Conheça cada animal antes de adotar</span>
              </li>
              <li className="flex items-start gap-2">
                <Check />
                <span>Processo de adoção transparente e seguro</span>
              </li>
            </ul>
          </div>

          <div className="bg-aprimary p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Para ONGs</h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <Check />
                <span>Amplie o alcance dos seus animais para adoção</span>
              </li>
              <li className="flex items-start gap-2">
                <Check />
                <span>Ferramentas para gerenciar seus animais</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="text-center px-8 pt-8 rounded-xl">
        <h2 className="text-2xl font-bold mb-4 text-asecondary">
           Junte-se a nós nessa causa e ajude a transformar histórias! 💙
        </h2>
        <p className="text-lg font-medium">
          Adotar é um ato de amor. Aqui, cada match é uma vida salva!
        </p>
      </section>
    </div>
  )
}