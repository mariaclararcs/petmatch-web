import Home from "@/components/home";
import Layout from "../_layouts/root";

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Home", url: "/home" }]} pageTitle="Home">
      <Home />
    </Layout>
  );
}
