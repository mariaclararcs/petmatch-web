import Layout from "@/app/_layouts/root"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Cadastro ONG", url: "/cadastro/ong" }]} pageTitle="Cadastro ONG">
    </Layout>
  )
}
