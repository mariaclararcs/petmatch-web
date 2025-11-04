export interface UpdateONGData {
  name_institution: string
  name_responsible: string
  document_responsible: string
  cnpj: string
  phone: string
  address: string
  cep: string
  description: string
  status?: string
}

export async function updateONG(id: string, data: UpdateONGData): Promise<any> {
  // Inclui o id no body da requisição
  const requestData = {
    ...data,
    id: id
  }

  const response = await fetch(`http://localhost:8000/api/ongs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao atualizar ONG')
  }

  return response.json()
}
