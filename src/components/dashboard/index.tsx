import { useState } from "react";

export function Dashboard() {
    const [animalData, setAnimalData] = useState([
        { id: 1, nome: 'Anderson Oliveira', especie: 'Dinheiro', habitat: 'R$ 3.000', status: 'Vulnerável', populacao: 20000 },
        { id: 2, nome: 'Maria Luiza Ferreira', especie: 'Ração', habitat: '4kg', status: 'Ameaçado', populacao: 3900 },
        { id: 3, nome: 'Ana Maria de Jesus', especie: 'Ração', habitat: '3kg', status: 'Vulnerável', populacao: 415000 },
        { id: 4, nome: 'José Carlos', especie: 'Dinheiro', habitat: 'R$ 5.000', status: 'Vulnerável', populacao: 1864 },
        { id: 5, nome: 'Antônio Perkinson', especie: 'Vacinas', habitat: '20', status: 'Criticamente Ameaçado', populacao: 1000 },
    ]);

    const stats = [
        { name: 'Animais em espera', value: animalData.length },
        { name: 'Animais adotados', value: animalData.reduce((sum, animal) => sum + animal.populacao, 0).toLocaleString() },
        { name: 'ONGs Cadastradas', value: animalData.filter(animal => animal.status.includes('Ameaçado')).length },
    ];

    return (
        <div className="w-full h-screen bg-gray-100 flex flex-col">
            <main className="flex-1 max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mb-8">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="px-4 py-5 sm:p-6">
                                <div className="text-sm font-medium text-gray-500 truncate">{stat.name}</div>
                                <div className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Registro de Doações</h3>
                        <p className="mt-1 text-sm text-gray-500">Lista das últimas doações</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Doador
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Item
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Quantidade
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Recebido por
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {animalData.map((animal) => (
                                    <tr key={animal.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {animal.nome}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {animal.especie}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {animal.habitat}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                ${animal.status === 'Criticamente Ameaçado' ? 'bg-red-100 text-red-800' :
                                                    animal.status === 'Ameaçado' ? 'bg-orange-100 text-orange-800' :
                                                        'bg-yellow-100 text-yellow-800'}`}>
                                                {animal.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {animal.populacao.toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}