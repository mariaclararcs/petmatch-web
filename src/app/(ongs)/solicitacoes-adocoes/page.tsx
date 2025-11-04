"use client"

import Layout from "@/app/_layouts/root"
import { RouteGuard } from "@/components/auth/route-guard"
import ListAdopters from "@/components/adopter/list-adopters"

export default function Page() {
  return (
    <RouteGuard requiredPermission="canManageOngs">
      <Layout
        breadCrumbItems={[
          { title: "Solicitação de Adoções", url: "/solicitacoes-adocoes" },
        ]}
        pageTitle="Solicitação de Adoções"
      >
        <ListAdopters />
      </Layout>
    </RouteGuard>
  )
}

