export interface UpdateUserData {
  id?: string
  name: string
  email: string
  type_user?: string
  password?: string
  password_confirmation?: string
}

export async function updateUser(id: string, data: UpdateUserData): Promise<any> {
  // Inclui o id no body da requisição
  const requestData = {
    ...data,
    id: id
  }

  const response = await fetch(`http://localhost:8000/api/users/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(requestData)
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao atualizar usuário')
  }

  return response.json()
}
