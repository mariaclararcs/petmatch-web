"use client"

import Home from "@/components/home"
import Layout from "./_layouts/root"

export default function Login() {
  return (
    <Layout breadCrumbItems={[{ title: "Home", url: "/home" }]} pageTitle="Home">
      <Home />
    </Layout>
  )
}
