import { IApiRoot, IPaginate, ITimestamps } from "../api"
import { IUser } from "../user"

export interface IAdopter extends ITimestamps {
  id: string
  user_id: string
  name: string
  birth_date: string
  phone: string
  address: string
  cep: string
  user?: IUser
}

export interface IGetAdopters extends IApiRoot {
  data: IPaginate & {
    data: IAdopter[]
  }
}
