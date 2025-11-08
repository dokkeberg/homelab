import "@/styles/globals.css"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import type { ReactNode } from "react"

export const metadata = {
    title: "My App",
    description: "With shared layout",
}

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body>
        <div className="layout">
            <Header />
            <div className="main-content">
                <Sidebar />
                <main className="page-content">{children}</main>
            </div>
        </div>
        </body>
        </html>
    )
}