import axios from 'axios'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
})

// Adicione interceptors se necessário
api.interceptors.response.use(
  response => response,
  error => {
    // Tratamento global de erros
    return Promise.reject(error)
  }
)

export default api