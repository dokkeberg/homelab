"use server"

import { revalidatePath } from "next/cache"
import { provisionClient } from "@/app/lib/api/provision-client"

export async function deleteServer(formData: FormData) {
  const idRaw = formData.get("serverId")
  const serverId = idRaw ? Number(idRaw) : NaN

  if (!serverId || Number.isNaN(serverId)) {
    throw new Error("Invalid server id")
  }

  const res = await provisionClient.delete(`servers/${serverId}`)
  if (!res) {
    throw new Error("Failed to delete server.")
  }

  revalidatePath("/server")
}
