export async function deleteONG(id: string): Promise<any> {
  const response = await fetch(`http://localhost:8000/api/ongs/${id}`, {
    method: 'DELETE',
    headers: {
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    const errorData = await response.json()
    throw new Error(errorData.message || 'Erro ao deletar ONG')
  }

  return response.json()
}
