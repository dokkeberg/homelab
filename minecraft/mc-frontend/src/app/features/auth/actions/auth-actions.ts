"use server"

import { auth } from "@/app/lib/auth/auth"
import { redirect } from "next/navigation";

export async function login() {
    const result = await auth.api.signInWithOAuth2({
        body: {
            providerId: "authentik",
        }
    });

    if(result.url) {
        redirect(result.url);
    }

    throw new Error("Failed to login");
}