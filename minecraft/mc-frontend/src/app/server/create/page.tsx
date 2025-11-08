import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { NewServerModel } from "@/models/newServerModel";
import { redirect } from "next/navigation";
import SubmitButton from "@/ui/submit-button";

export default async function Page() {
    const apiUrl = process.env.BACKEND_API;

    const session = await getServerSession(authOptions);
    const accessToken = session?.accessToken;

    if (!accessToken) {
        throw new Error("No access token found. Please sign in.");
    }

    const res = await fetch(`${apiUrl}/servers/create`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    if (!res.ok) {
        console.log("res", res);
        throw new Error("Failed to fetch server creation data.");
    }

    const model: NewServerModel = await res.json();
    console.log("model", model);
    async function createServer(formData: FormData) {
        'use server'
        const name = String(formData.get('name') || '').trim();
        const description = String(formData.get('description') || '').trim();
        const imageIdRaw = formData.get('imageId');
        const imageId = imageIdRaw ? Number(imageIdRaw) : NaN;

        if (!name || !description || Number.isNaN(imageId)) {
            throw new Error('Please provide name, description, and select an image.');
        }

        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        if (!token) {
            throw new Error('Not authenticated.');
        }

        const apiUrl = process.env.BACKEND_API;
        const resp = await fetch(`${apiUrl}/servers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                // Using server model fields plus the additional imageId for creation
                name,
                description,
                imageId,
            }),
        });

        if (!resp.ok) {
            const text = await resp.text().catch(() => '');
            console.error('Create server failed:', resp.status, text);
            throw new Error('Failed to create server.');
        }

        // Redirect to the servers list after successful creation
        redirect('/server');
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Create a new server</h1>
            <form action={createServer} className="space-y-6">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="My Minecraft Server"
                    />
                </div>

                <div>
                    <label htmlFor="description" className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        id="description"
                        name="description"
                        required
                        className="w-full border rounded px-3 py-2"
                        placeholder="Short description"
                        rows={3}
                    />
                </div>

                <div>
                    <p className="block text-sm font-medium mb-2">Select an image</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {model.images.map((img) => (
                            <label key={img.id} className="cursor-pointer">
                                <input
                                    type="radio"
                                    name="imageId"
                                    value={img.id}
                                    className="peer hidden"
                                    required
                                />
                                <div className="border rounded overflow-hidden peer-checked:ring-2 peer-checked:ring-blue-500">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img src={img.url} alt={`Image ${img.id}`} className="w-full h-32 object-cover" />
                                </div>
                            </label>
                        ))}
                    </div>
                </div>

                <div className="pt-2">
                    {/* Client submit button shows loading state while the server action is pending */}
                    <SubmitButton />
                </div>
            </form>
        </div>
    );
}