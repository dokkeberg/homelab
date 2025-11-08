"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { revalidatePath } from "next/cache"

export async function deleteServer(formData: FormData) {
  const idRaw = formData.get("serverId")
  const serverId = idRaw ? Number(idRaw) : NaN

  if (!serverId || Number.isNaN(serverId)) {
    throw new Error("Invalid server id")
  }

  const session = await getServerSession(authOptions)
  const token = session?.accessToken
  if (!token) {
    throw new Error("Not authenticated.")
  }

  const apiUrl = process.env.BACKEND_API
  if (!apiUrl) {
    throw new Error("BACKEND_API is not configured")
  }

  const resp = await fetch(`${apiUrl}/servers/${serverId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })
  if (!resp.ok) {
    const text = await resp.text().catch(() => "")
    console.error("Delete failed:", resp.status, text)
    throw new Error("Failed to delete server.")
  }

  // Revalidate the servers list page
  revalidatePath("/server")
}
