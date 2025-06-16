"use client"

import Layout from "@/app/_layouts/root"
import ListOngs from "@/components/ongs/list-ongs"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Listagem de ONGs", url: "/listagem-ongs" }]} pageTitle="Listagem de ONGs">
      <ListOngs />
    </Layout>
  )
}