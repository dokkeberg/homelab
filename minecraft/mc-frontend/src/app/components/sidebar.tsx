import SidebarLink from "./sidebar-link";

export default function Sidebar() {
    return (
        <aside className="w-72 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-8 shadow-2xl border-r border-gray-700/50">
            <nav className="space-y-3">
                <SidebarLink text="Home" href="/" icon="🏠" color="from-blue-400 to-blue-600" />
                <SidebarLink text="Servers" href="/server" icon="📊" color="from-emerald-400 to-emerald-600" />
            </nav>
        </aside>
    )
}
