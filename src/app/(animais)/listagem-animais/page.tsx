"use client"

import Layout from "@/app/_layouts/root"
import ListAnimals from "@/components/animals/list-animals"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Listagem Animais", url: "/listagem-animais" }]} pageTitle="Listagem Animais">
      <ListAnimals />
    </Layout>
  )
}
