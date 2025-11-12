/**
 * Normaliza URLs de imagens retornadas pelo back-end
 * Converte URLs relativas ou com localhost sem porta para a URL correta da API
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  
  // Se já é uma URL completa e válida, retorna como está
  if (url.startsWith('http://') || url.startsWith('https://')) {
    // Se for localhost sem porta, adiciona a porta 8000
    if (url.startsWith('http://localhost/') || url.startsWith('http://localhost/storage/')) {
      return url.replace('http://localhost/', 'http://localhost:8000/')
    }
    return url
  }
  
  // Se for uma URL relativa (começa com /), adiciona a base da API
  if (url.startsWith('/')) {
    const baseURL = process.env.API_URL || 'http://localhost:8000'
    return `${baseURL}${url}`
  }
  
  // Se não começar com /, assume que é relativa e adiciona /storage/
  const baseURL = process.env.API_URL || 'http://localhost:8000'
  return `${baseURL}/storage/${url}`
}

