import React from "react"

interface LayoutProps {
    sidebar: React.ReactNode
    children: React.ReactNode
}

const Layout: React.FC<LayoutProps> = ({ sidebar, children }) => {
    return (
        <div className="flex h-screen w-screen bg-black overflow-hidden">
            <aside className="transition-all duration-500 ease-in-out">
                {sidebar}
            </aside>
            <main className="flex-1 overflow-y-auto">
                {children}
            </main>
        </div>
    )
}

export default Layout
