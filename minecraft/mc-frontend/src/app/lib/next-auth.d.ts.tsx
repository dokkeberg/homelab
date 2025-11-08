import { DefaultUser } from "next-auth"
import { DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        accessToken?: string
        apiProvisionAccessToken?: string
        apiMonitorAccessToken?: string
    }

    interface User extends DefaultUser {
        accessToken?: string
    }
}

declare module "next-auth/jwt" {
    interface JWT extends DefaultJWT {
        accessToken?: string
        refreshToken?: string
        apiProvisionAccessToken?: string
        apiMonitorAccessToken?: string
    }
}
