// app/server/[serverId]/page.tsx
export default async function ServerPage({ params }: { params: Promise<{ serverId: string }> }) {
    // Await the dynamic route params (Next.js 14.2+/15 convention)
    const { serverId } = await params;

    return (
        <div>
            <h1>Server: {serverId}</h1>
            {/* Display other server details based on the serverId */}
        </div>
    );
}