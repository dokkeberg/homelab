import { betterAuth, CookieOptions } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { genericOAuth } from "better-auth/plugins";
import Database from "better-sqlite3";


const crossSiteCookieAttributes: CookieOptions = {
  sameSite: 'none',
  secure: true,
} as const;

export const auth = betterAuth({
    advanced: {
        useSecureCookies: true,
        defaultCookieAttributes: crossSiteCookieAttributes
    },
    trustedOrigins: [
        process.env.BETTER_AUTH_URL as string,
        process.env.BETTER_AUTH_OAUTH_BASEURL as string,
    ],
    plugins: [
        nextCookies(),
        genericOAuth({
            config: [
                {
                    providerId: "authentik",
                    authorizationUrlParams: {
                        access_type: "offline",
                        prompt: "consent",
                    },
                    clientId: process.env.BETTER_AUTH_OAUTH_CLIENT_ID as string,
                    clientSecret: process.env.BETTER_AUTH_OAUTH_CLIENT_SECRET as string,
                    discoveryUrl: process.env.BETTER_AUTH_OAUTH_DISCOVERY_URL as string,
                    tokenUrl: process.env.BETTER_AUTH_OAUTH_TOKEN_URL as string | undefined,
                    authorizationUrl: process.env.BETTER_AUTH_OAUTH_AUTHORIZATION_URL as string | undefined,
                    scopes: ["openid", "profile", "email", "offline_access", "minecraft-provision"],
                    redirectURI: process.env.BETTER_AUTH_OAUTH_REDIRECT_URI as string      
                }
            ]
        })
    ],
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 60 * 2, // 2 hours
            strategy: 'jwt',
            refreshCache: true,
        },
    },
    account: {
        storeStateStrategy: 'cookie',
        storeAccountCookie: true,
        skipStateCookieCheck: true,
    },
});