import Link from "next/link"

type SidebarLinkProps = {
    text: string,
    icon: string,
    color: string,
    href: string,
}

export default function SidebarLink({text, icon, color, href }: SidebarLinkProps) {

    return (
        <Link 
            href={href} 
            className="group flex items-center w-full px-5 py-4 text-gray-300 bg-white/5 backdrop-blur-sm rounded-sm border border-white/10 hover:bg-white/10 hover:text-white hover:border-blue-400/50 transition-all duration-300 ease-out"
        >
            <div className={`w-8 h-8 bg-gradient-to-br ${color} rounded-sm flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-sm">{icon}</span>
            </div>
            <span className="font-medium">{text}</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                →
            </div>
        </Link>
    )
}