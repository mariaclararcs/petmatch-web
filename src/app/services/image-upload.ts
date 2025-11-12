export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("image", file)

  try {
    const baseURL = process.env.API_URL || "http://localhost:8000"
    const uploadUrl = `${baseURL}/api/upload`
    
    console.log(`Fazendo upload para: ${uploadUrl}`)
    
    const response = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
      // Não definir Content-Type manualmente - o browser define automaticamente com o boundary correto
    })
    
    if (!response.ok) {
      let errorMessage = `Erro ${response.status}: ${response.statusText}`
      
      try {
        const errorText = await response.text()
        const errorData = JSON.parse(errorText)
        errorMessage = errorData.message || errorData.error || errorMessage
      } catch {
        // Se não conseguir parsear, usa a mensagem padrão
      }
      
      console.error("Erro na resposta do servidor:", {
        status: response.status,
        statusText: response.statusText,
        url: uploadUrl
      })
      
      throw new Error(errorMessage)
    }
    
    const responseText = await response.text()
    let data
    
    try {
      data = JSON.parse(responseText)
    } catch {
      // Se não for JSON, pode ser uma URL direta
      if (responseText.trim().startsWith('http://') || responseText.trim().startsWith('https://')) {
        return responseText.trim()
      }
      throw new Error("Resposta do servidor não é um JSON válido nem uma URL")
    }
    
    // Verifica diferentes formatos de resposta possíveis
    let imageUrl = ''
    if (data.url) {
      imageUrl = data.url
    } else if (data.data?.url) {
      imageUrl = data.data.url
    } else if (typeof data === 'string' && (data.startsWith('http://') || data.startsWith('https://'))) {
      imageUrl = data
    } else {
      console.error("Formato de resposta inesperado:", data)
      throw new Error(`Formato de resposta do servidor inválido. Resposta recebida: ${JSON.stringify(data)}`)
    }
    
    // Normaliza a URL (corrige localhost sem porta)
    if (imageUrl.startsWith('http://localhost/') || imageUrl.startsWith('http://localhost/storage/')) {
      imageUrl = imageUrl.replace('http://localhost/', 'http://localhost:8000/')
    }
    
    // Garante que a URL é completa e válida
    if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      throw new Error(`URL inválida retornada pelo servidor: ${imageUrl}`)
    }
    
    console.log('URL da imagem normalizada e validada:', imageUrl)
    return imageUrl
  } catch (error) {
    console.error("Erro no upload:", error)
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Falha ao fazer upload da imagem")
  }
}