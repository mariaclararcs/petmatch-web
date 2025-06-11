"use client";

import Layout from "@/app/_layouts/root";
import Animals from "@/components/animals";

export default function Page() {
  return (
    <Layout breadCrumbItems={[{ title: "Animais", url: "/animais" }]} pageTitle="Animais">
      <Animals />
    </Layout>
  );
}
