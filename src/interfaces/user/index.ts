import { loginFormSchema } from "@/schemas/auth";
import { z } from "zod";
import { IApiRoot, IPaginate, ITimestamps } from "../api";

export interface IUser extends ITimestamps {
  name: string;
  email: string;
  password: string;
  type_user: string;
  avatar: string;
}

export interface IUserLogin extends IApiRoot {
  data: {
    user: IUser;
    token: string;
  };
}

export interface IGetUsers extends IApiRoot {
  data: IPaginate & {
    data: IUser[];
  };
}

export type LoginFormData = z.infer<typeof loginFormSchema>;
