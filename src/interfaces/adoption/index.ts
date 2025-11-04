import { IApiRoot, IPaginate, ITimestamps } from "../api"
import { IAdopter } from "../adopter"
import { IAnimal } from "../animal"

export interface IAdoption extends ITimestamps {
  id: string
  adopter_id: string
  animal_id: string
  status: "pending" | "approved" | "rejected"
  request_date: string
  adopter?: IAdopter
  animal?: IAnimal
}

export interface IGetAdoptions extends IApiRoot {
  data: IPaginate & {
    data: IAdoption[]
  }
}

