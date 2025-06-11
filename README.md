# 🐶🐱 Pet Match

### 🎯 Sobre

O **Pet Match** é uma plataforma web desenvolvida para facilitar a conexão entre adotantes e ONGs/abrigos que resgatam animais. O projeto visa oferecer um ambiente intuitivo e acessível para que as ONGs possam divulgar animais para adoção, permitir que os usuários entrem em contato com as instituições e oferecer uma forma segura de realizar doações.

O principal objetivo é otimizar o processo de adoção de animais resgatados e fortalecer a visibilidade das ONGs, proporcionando um meio eficiente de divulgação e comunicação entre as partes interessadas.

### 🏗️ Arquitetura do Projeto

O projeto segue a **arquitetura de três camadas**, sendo dividido em:
- **Front-End:** Desenvolvido com Next.js (TypeScript), responsável pela interface do usuário.
- **Back-End:** Implementado com Laravel (PHP), encarregado do processamento de dados e regras de negócio.
- **Banco de Dados:** Utiliza MySQL para armazenar informações sobre usuários e animais.

Repositório do Back-End disponível em [petmatch-api](https://github.com/mariaclararcs/petmatch-api).

**O projeto foi desenvolvido com o objetivo de ser um Trabalho de Graduação do curso de Análise e Desenvolvimento de Sistemas.**

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.