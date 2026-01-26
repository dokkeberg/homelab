"use server"

import { cookies, headers } from "next/headers";
import { auth } from "@/app/lib/auth/auth";
import { symmetricDecodeJWT } from "better-auth/crypto";
import { getCookieCache } from "better-auth/cookies";

// import { jwtDecode } from 'jwt-decode';


type AccessToken = {
    accessToken: string; 
    accessTokenExpiresAt: Date | undefined; 
    scopes: string[]; 
    idToken: string | undefined; 
};

export async function getAccessToken(): Promise<AccessToken | null> {
    const headersList = await headers();
    
    const session = await auth.api.getSession({
        headers: headersList
    });

    console.log("session", JSON.stringify(session));

    if(!session) {
        return null;
    }

    return await auth.api.getAccessToken({
        body: {
            userId: session.session.userId,
            providerId: "authentik",
        },
        headers: headersList
    });
}