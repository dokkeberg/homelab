import { NextAuthOptions } from "next-auth"
import KeycloakProvider from "next-auth/providers/keycloak"

export const authOptions: NextAuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_ID!,
            clientSecret: process.env.KEYCLOAK_SECRET!,
            issuer: process.env.KEYCLOAK_ISSUER!,
            authorization: {
                params: {
                    scope: "openid profile email offline_access minecraft-api-provision:write minecraft-api-provision:read",
                },
            },
        }),
    ],

    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token

                const expiresAtSec =
                    (account as any).expires_at ??
                    ((account as any).expires_in
                        ? Math.floor(Date.now() / 1000) + (account as any).expires_in
                        : undefined)

                token.accessTokenExpires = expiresAtSec
                console.log("token", token)
                return token
            }

            if (!token.accessTokenExpires) {
                return token
            }

            const nowSec = Math.floor(Date.now() / 1000)
            if (nowSec < (token.accessTokenExpires as number) - 30) {
                return token
            }

            try {
                const refreshed = await refreshAccessToken(
                    token.refreshToken as string
                )

                token.accessToken = refreshed.access_token
                token.accessTokenExpires = Math.floor(Date.now() / 1000) + refreshed.expires_in
                console.log("refreshed token", refreshed)
                if (refreshed.refresh_token) {
                    token.refreshToken = refreshed.refresh_token
                }

                return token
            } catch (err) {
                token.error = "RefreshAccessTokenError"
                return token
            }
        },

        async session({ session, token }) {
            session.accessToken = token.accessToken as string | undefined
            session.apiProvisionAccessToken = token.apiProvisionAccessToken as string | undefined
            session.apiMonitorAccessToken = token.apiMonitorAccessToken as string | undefined
            ;(session as any).error = token.error
            return session
        },
    },
}

async function refreshAccessToken(refreshToken: string): Promise<{
    access_token: string
    expires_in: number
    refresh_token?: string
}> {
    const params = new URLSearchParams({
        grant_type: "refresh_token",
        client_id: process.env.KEYCLOAK_ID!,
        client_secret: process.env.KEYCLOAK_SECRET!,
        refresh_token: refreshToken,
    })

    const response = await fetch(
        `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`,
        {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: params.toString(),
        }
    )

    if (!response.ok) {
        const body = await response.text().catch(() => "")
        throw new Error(`Failed to refresh access token: ${response.status} ${response.statusText} ${body}`)
    }

    return response.json()
}
