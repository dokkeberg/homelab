
import { useSession } from "@/app/lib/auth/auth-client"
import LogoutButton from "@/features/auth/components/logout-button";
import LoginButton from "@/features/auth/components/login-button";

export default function AuthPanel() {
    const {data: session, isPending } = useSession();
   
    return (
        <>
            {session ? (
                    <>
                        <h1>Welcome {session.user?.name ?? "user"}</h1>
                        <LogoutButton />
                    </>
                ) : (
                    <>
                        <h1>You are not logged in</h1>
                        <LoginButton />
                    </>
                )}
        </>
    )
}