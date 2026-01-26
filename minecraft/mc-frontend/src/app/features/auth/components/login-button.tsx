"use client"

import { login } from "@/features/auth/actions/auth-actions"

export default function LoginButton() {

    return (
        <form action={login}>
            <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
                Login
            </button>
        </form>
    )
}