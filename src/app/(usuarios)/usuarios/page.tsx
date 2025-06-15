"use client"

import Layout from "@/app/_layouts/root"
import Users from "@/components/users"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Usuários", url: "/usuarios" }]} pageTitle="Usuários">
      <Users />
    </Layout>
  )
}
