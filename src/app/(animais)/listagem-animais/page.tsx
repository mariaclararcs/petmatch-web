"use client"

import Layout from "@/app/_layouts/root"
import ListAnimals from "@/components/animals/list-animals"
import { RouteGuard } from "@/components/auth/route-guard"

export default function Page() {
  return (
    <RouteGuard requiredPermission="canManageAnimals">
      <Layout breadCrumbItems={[{ title: "Listagem Animais", url: "/listagem-animais" }]} pageTitle="Listagem Animais">
        <ListAnimals />
      </Layout>
    </RouteGuard>
  )
}
