import { IUser } from '@/interfaces/user'; 

declare module 'next-auth' {
  interface Session {
    user: IUser;
    token: string;
  }

  interface JWT {
    user?: IUser;
    token?: string;
  }
}