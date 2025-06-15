"use client"

import Layout from "@/app/_layouts/root"
import Ongs from "@/components/list-ongs"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "ONGs", url: "/ongs" }]} pageTitle="ONGs">
      <Ongs />
    </Layout>
  )
}