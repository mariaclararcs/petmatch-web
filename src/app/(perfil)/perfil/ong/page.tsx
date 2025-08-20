"use client"

import Layout from "@/app/_layouts/root"
import ProfileOng from "@/components/profile/ong"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Perfil da ONG", url: "/perfil/ong" }]} pageTitle="Perfil da ONG">
      <ProfileOng />
    </Layout>
  )
}