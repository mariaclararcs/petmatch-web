export async function deleteUser(id: string): Promise<any> {
  const response = await fetch(`http://localhost:8000/api/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao deletar usuário')
  }

  return response.json()
}
