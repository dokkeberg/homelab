import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"

export default async function Header() {
    const session = await getServerSession(authOptions)

    return (
        <header className="header">
            <h1>MC Provisioning</h1>
            <div className="header-right">
                {session ? (
                    <>
                        <h1>Welcome {session.user?.name ?? "user"}</h1>
                        <form action="/api/auth/signout" method="post">
                            <button
                                type="submit"
                                className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                            >
                                Logout
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1>You are not logged in</h1>
                        <form action="/api/auth/signin" method="get">
                            <button
                                type="submit"
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                            >
                                Login
                            </button>
                        </form>
                    </>
                )}
            </div>
        </header>
    )
}
