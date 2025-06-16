"use client"

import Layout from "@/app/_layouts/root"
import ListUsers from "@/components/list-users"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Usuários", url: "/usuarios" }]} pageTitle="Usuários">
      <ListUsers />
    </Layout>
  )
}
