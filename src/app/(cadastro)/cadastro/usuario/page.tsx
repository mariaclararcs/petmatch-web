import Layout from "@/app/_layouts/root"
import RegisterUser from "@/components/register/user-form"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Cadastro Usuário", url: "/cadastro/usuario" }]} pageTitle="Cadastro Usuário">
      <RegisterUser />
    </Layout>
  )
}
