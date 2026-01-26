"use client"

import AuthPanel from "@/features/auth/components/auth-panel"

export default function Header() {
    
    return (
        <header className="header">
            <h1>MC Provisioning</h1>
            <div className="header-right">
                <AuthPanel />
            </div>
        </header>
    )
}
