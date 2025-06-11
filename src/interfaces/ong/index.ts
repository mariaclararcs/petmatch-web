import { IApiRoot, IPaginate, ITimestamps } from "../api";

export interface IOng extends ITimestamps {
  user_id: string;
  name_institution: string;
  name_responsible: string;
  document_responsible: string;
  cnpj: string;
  phone: string;
  address: string;
  cep: string;
  description: string;
  status: string;
}

export interface IGetOngs extends IApiRoot {
  date: IPaginate & {
    data: IOng[];
  };
}
