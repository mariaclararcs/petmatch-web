import Layout from "@/app/_layouts/root"
import RegisterONG from "@/components/register/ong-form"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Cadastro ONG", url: "/cadastro/ong" }]} pageTitle="Cadastro ONG">
      <RegisterONG />
    </Layout>
  )
}
