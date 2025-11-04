export interface CreateAdopterData {
  user_id: string
  name: string
  birth_date: string
  phone: string
  address: string
  cep: string
}

export async function createAdopter(data: CreateAdopterData): Promise<any> {
  const response = await fetch('http://localhost:8000/api/adoption', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(data)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao criar formulário de adoção')
  }

  return response.json()
}
