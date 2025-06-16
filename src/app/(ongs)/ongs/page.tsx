"use client"

import Layout from "@/app/_layouts/root"
import ListOngs from "@/components/list-ongs"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "ONGs", url: "/ongs" }]} pageTitle="ONGs">
      <ListOngs />
    </Layout>
  )
}