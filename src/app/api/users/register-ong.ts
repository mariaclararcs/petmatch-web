import api from "@/app/services/api"

export interface RegisterONGData {
  name: string
  responsible_name: string
  email: string
  password: string
  password_confirmation: string
  cnpj: string
  phone: string
  address: string
  cep: string
  description?: string
}

export interface RegisterONGResponse {
  id: string
  name: string
  email: string
  type_user: string
  avatar?: string
  created_at: string
  updated_at: string
}

export async function registerONG(data: RegisterONGData): Promise<RegisterONGResponse> {
  const response = await api.post('/api/users', {
    name: data.name,
    email: data.email,
    password: data.password,
    password_confirmation: data.password_confirmation,
    type_user: 'ONG',
    // Campos específicos da ONG podem ser enviados como metadados ou em campos adicionais
    responsible_name: data.responsible_name,
    cnpj: data.cnpj,
    phone: data.phone,
    address: data.address,
    cep: data.cep,
    description: data.description,
  })
  
  return response.data
}
