"use client"

import Layout from "@/app/_layouts/root"
import AnimalInfo from "@/components/animals/animal-info"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Informações do Animal", url: "/infomacoes-animal" }]} pageTitle="Informações do Animal">
      <AnimalInfo />
    </Layout>
  )
}
