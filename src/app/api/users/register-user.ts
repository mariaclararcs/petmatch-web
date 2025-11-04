import api from "@/app/services/api"

export interface RegisterUserData {
  name: string
  email: string
  password: string
  password_confirmation: string
  birth_date?: string
  phone?: string
  address?: string
  cep?: string
}

export interface RegisterUserResponse {
  id: string
  name: string
  email: string
  type_user: string
  avatar?: string
  created_at: string
  updated_at: string
}

export async function registerUser(data: RegisterUserData): Promise<RegisterUserResponse> {
  const response = await api.post('/api/users', {
    ...data,
    type_user: 'adotante'
  })
  
  return response.data
}
