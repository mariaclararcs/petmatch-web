import Layout from "@/app/_layouts/root"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Cadastro Usuário", url: "/cadastro/usuario" }]} pageTitle="Cadastro Usuário">
    </Layout>
  )
}
