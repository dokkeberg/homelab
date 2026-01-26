import Server from "@/features/server/components/server";
import { ServerSummary } from "@/models/server";
import Link from "next/link";
import { provisionClient } from "@/app/lib/api/provision-client";

export default async function Page() {

    const servers = await provisionClient.get<ServerSummary[]>("servers", { cache: "no-store" }) || [];

        return (
        <>
            <div className="mb-4 flex items-center min-h-12 justify-between">
                <h1 className="text-xl font-semibold">Servers</h1>
                <Link href="/server/create" className="px-4 py-2 w-30 bg-blue-600 text-white rounded hover:bg-blue-700">
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