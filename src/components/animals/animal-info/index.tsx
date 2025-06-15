import Image from "next/image";

export default function AnimalInfo() {
    return (
        <>
            <div className="flex flex-col mx-auto px-20 py-6 xl:py-8 max-h-auto">
                <Image
                    className="rounded-lg bg-aprimary object-cover group-hover:opacity-75"
                    alt="{animal.name}"
                    src="/images/login-ong.svg"
                    width={248}
                    height={248}
                    style={{
                        width: '100%',
                        height: '248px'
                    }}
                    unoptimized
                />
                <span>Nome:</span>
                <span>Idade:</span>
                <span>Sexo:</span>
                <span>Tipo de Animal:</span>
                <span>Porte:</span>
                <span>ONG:</span>
                <span>Data de Abrigo:</span>
                <span>Descrição:</span>
            </div>
        </>
    )
}