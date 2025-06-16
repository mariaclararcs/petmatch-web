import Layout from "@/app/_layouts/root"
import AboutUs from "@/components/about-us"

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Sobre Nós", url: "/sobre-nos" }]} pageTitle="Sobre Nós">
      <AboutUs />
    </Layout>
  )
}
