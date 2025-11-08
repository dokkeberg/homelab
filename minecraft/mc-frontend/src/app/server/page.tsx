import Server from "@/components/server";
import {ServerSummary} from "@/models/server";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";
import Link from "next/link";

export default async function Page() {
    const apiUrl = process.env.BACKEND_API;
    const session = await getServerSession(authOptions)
    const accessToken = session?.accessToken;

    if (!accessToken) {
        throw new Error("No access token found. Please sign in.");
    }

    const res = await fetch(`${apiUrl}/servers`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        console.log("res", res)
        throw new Error("Failed to fetch servers.");
    }

    const servers: ServerSummary[] = await res.json();

    return (
        <>
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-xl font-semibold">Servers</h1>
                <Link href="/server/create" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    Create new
                </Link>
            </div>
            <div className="flex flex-wrap gap-6">
                {servers.map((server) => (
                    <div key={server.id}>
                        <Server server={server} />
                    </div>
                ))}
            </div>
        </>
    )
}