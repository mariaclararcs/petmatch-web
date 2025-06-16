import { IApiRoot, IPaginate, ITimestamps } from "../api";
import { IOng } from "../ong";

export interface IAnimal extends ITimestamps {
  ong_id: string;
  name: string;
  age: number;
  gender: string;
  type: string;
  size: string;
  shelter_date: Date;
  image: string;
  description: string;
  ong: IOng;
}

export interface IGetAnimals extends IApiRoot {
  data: IPaginate & {
    data: IAnimal[];
  };
}
