"use client"

import Layout from "@/app/_layouts/root"
import Animals from "@/components/animals"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Informações do Animal", url: "/infomacoes-animal" }]} pageTitle="Informações do Animal">
      <Animals />
    </Layout>
  )
}
