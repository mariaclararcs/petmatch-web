'use client';

import { ReactNode } from "react";

interface ILayout {
    children: ReactNode;
    className?: string;
}

export default function Layout({ children, className }: ILayout) {
    return (
        <div className={`${className}`}>
            <div className="">
                {children}
            </div>
        </div>
    );
}
