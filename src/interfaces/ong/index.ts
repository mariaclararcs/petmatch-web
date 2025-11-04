import { IApiRoot, IPaginate, ITimestamps } from "../api"
import { IUser } from "../user"

export interface IOng extends ITimestamps {
  user_id: string
  name_institution: string
  name_responsible: string
  document_responsible: string
  cnpj: string
  phone: string
  address: string
  cep: string
  description: string
  status: string
  user: IUser
}

export interface IGetOngs extends IApiRoot {
  data: IPaginate & {
    data: IOng[]
  }
}
