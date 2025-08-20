import Footer from "@/components/global/footer"
import Header from "@/components/global/header"
import { Suspense } from "react"

interface BreadCrumbItem {
  title: string
  url: string
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
  breadCrumbItems: BreadCrumbItem[]
  pageTitle?: string
}) {
  return (
    <div className={`min-h-screen flex flex-col`}>
        <Header />
        <main className="px-4 pb-4 h-full w-[100%]">
          <Suspense>{children}</Suspense>
        </main>
        <Footer />
    </div>
  )
}
