"use client"
import { authClient } from "@/app/lib/auth/auth-client"

export default function LogoutButton() {
    
    const handleSignOut = () => {
        authClient.signOut();
    };
    
    return (
        <button
            type="button"
            onClick={handleSignOut}
            className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
        >
            Logout
        </button>

    )
}