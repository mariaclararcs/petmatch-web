'use client';

import NavbarAdministrative from "@/components/navbar_adm";
import { ReactNode } from "react";

interface ILayout {
    children: ReactNode;
    className?: string;
}

export default function Layout({ children, className }: ILayout) {
    return (
        <div className={`min-h-screen flex flex-col bg-white ${className}`}>
            <NavbarAdministrative />
            <div className="flex-grow flex items-center justify-center p-4">
                {children}
            </div>
        </div>
    );
}
