'use client'

import Header from "@/components/header"
import { ReactNode } from "react"

interface ILayout {
    children: ReactNode
    className?: string
}

export default function Layout({ children, className }: ILayout) {
    return (
        <div className={`min-h-screen flex flex-col bg-white ${className}`}>
            <Header />
            <div className="flex-grow flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    )
}