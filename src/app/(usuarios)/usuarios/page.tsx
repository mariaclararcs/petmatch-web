"use client"

import Layout from "@/app/_layouts/root"
import ListUsers from "@/components/users/list-users"
import { RouteGuard } from "@/components/auth/route-guard"

export default function Page() {
  return (
    <RouteGuard requiredPermission="canManageUsers">
      <Layout breadCrumbItems={[{ title: "Usuários", url: "/usuarios" }]} pageTitle="Usuários">
        <ListUsers />
      </Layout>
    </RouteGuard>
  )
}
