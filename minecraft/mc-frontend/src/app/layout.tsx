import "@/styles/globals.css"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import type { ReactNode } from "react"

export const metadata = {
    title: "Minecraft Provisioning",
    description: "A Minecraft server provisioning tool",
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