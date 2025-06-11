/* eslint-disable @typescript-eslint/no-explicit-any */
import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import api from "@/app/services/api";
import { IUser, IUserLogin } from "@/interfaces/user";

const nextAuthOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) throw new Error("Credenciais não informadas.");
        try {
          const response = await api.post<IUserLogin>("/auth/login", {
            email: credentials.email,
            password: credentials.password,
          });

          const { user, token } = response.data.data;

          if (!user || !token) {
            throw new Error("Falha na autenticação: dados de usuário ou token ausentes.");
          }

          return { ...user, token };
        } catch (error: any) {
          console.error("Erro na função de autorização: ", error);
          if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
          }
          throw new Error("Falha na autenticação.");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user as unknown as IUser;
        token.token = (user as any).token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) session.user = token.user as IUser;
      if (token.token) session.token = token.token as string;

      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}/home`;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/",
  },
};

const handler = NextAuth(nextAuthOptions);

export { handler as GET, handler as POST };
