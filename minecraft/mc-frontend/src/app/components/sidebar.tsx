import Link from "next/link"
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/authOptions";

export default function Sidebar() {
    return (
        <aside className="w-72 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 shadow-2xl border-r border-gray-700/50">
            <div className="mb-8">
                <h2 className="text-xl font-bold text-white mb-2">Navigation</h2>
                <div className="h-px bg-gradient-to-r from-blue-400 to-purple-400"></div>
            </div>

            <nav className="space-y-3">
                <Link 
                    href="/" 
                    className="group flex items-center w-full px-5 py-4 text-gray-300 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:text-white hover:border-blue-400/50 transition-all duration-300 ease-out"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-sm">🏠</span>
                    </div>
                    <span className="font-medium">Home</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                    </div>
                </Link>

                <Link 
                    href="/server"
                    className="group flex items-center w-full px-5 py-4 text-gray-300 bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 hover:bg-white/10 hover:text-white hover:border-emerald-400/50 transition-all duration-300 ease-out"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                        <span className="text-white text-sm">📊</span>
                    </div>
                    <span className="font-medium">Servers</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        →
                    </div>
                </Link>
            </nav>
        </aside>
    )
}
