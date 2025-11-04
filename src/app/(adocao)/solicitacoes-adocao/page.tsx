"use client"

import Layout from "@/app/_layouts/root"
import ListAdopters from "@/components/adopter/list-adopters"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Formulário de Adoção", url: "/formulario-adocao" }]} pageTitle="Formulário de Adoção">
      <ListAdopters />
    </Layout>
  )
}