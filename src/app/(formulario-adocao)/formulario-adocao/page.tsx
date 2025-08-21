"use client"

import Layout from "@/app/_layouts/root"
import AdoptionForm from "@/components/adoption-form"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Formulário de Adoção", url: "/formulario-adocao" }]} pageTitle="Formulário de Adoção">
      <AdoptionForm />
    </Layout>
  )
}