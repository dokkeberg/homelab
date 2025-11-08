import Image from "next/image"
import Link from "next/link";
import StopServerButton from "@/components/stopServerButton";
import DeleteServerButton from "@/components/deleteServerButton";
import StartServerButton from "@/components/startServerButton";
import {ServerSummary} from "@/models/server";


export default async function Server({ server }: { server: ServerSummary }) {
  return (
    <div className="relative h-64 w-64 rounded-lg overflow-hidden shadow-md group">
      {/* Background image */}
      <Image src={server.imageUrl} alt="Server Logo" fill={true} objectFit="cover" unoptimized={true} />

      {/* Clickable overlay linking to details (covers card except floating controls) */}
      <Link href={`/server/${server.id}`} className="absolute inset-0 z-10 block" aria-label={`Open server ${server.name}`}> 
        {/* gradient overlay and text as part of the clickable area */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-16 p-4 text-white">
          <h1 className="text-lg font-semibold">{server.name}</h1>
          <p className="text-sm">{server.description}</p>
        </div>
      </Link>

      {/* Control buttons (not inside the Link) */}
      <div className="absolute bottom-0 right-0 p-4 z-20 pointer-events-auto">
        <div className="flex space-x-1">
          {server.status === 'stopped' && <StartServerButton />}
          {server.status === 'running' && <StopServerButton />}
          <DeleteServerButton serverId={server.id} />
        </div>
      </div>
    </div>
  )
}
