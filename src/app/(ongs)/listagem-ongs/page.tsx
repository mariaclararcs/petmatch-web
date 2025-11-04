"use client"

import Layout from "@/app/_layouts/root"
import ListOngs from "@/components/ongs/list-ongs"
import { RouteGuard } from "@/components/auth/route-guard"

export default function Page() {
  return (
    <RouteGuard requiredPermission="canManageOngs">
      <Layout breadCrumbItems={[{ title: "Listagem de ONGs", url: "/listagem-ongs" }]} pageTitle="Listagem de ONGs">
        <ListOngs />
      </Layout>
    </RouteGuard>
  )
}