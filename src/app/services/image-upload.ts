import api from "./api"

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append("image", file)

  try {
    const response = await api.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    
    return response.data.url // Assume que o backend retorna { url: "https://..." }
  } catch (error) {
    console.error("Erro no upload:", error)
    throw new Error("Falha ao fazer upload da imagem")
  }
}