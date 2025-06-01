"use client"

import { useState, useEffect, useCallback } from "react"
import { AnimatePresence, motion } from "framer-motion"
import Sidebar from "./components/sidebar"
import Johnny from "./components/Johnny"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import ToolsPage from "./pages/ToolsPage"
import RoadmapPage from "./pages/RoadmapPage"
import ContactsPage from "./pages/ContactsPage"
import CustomCursor from "./components/CustomCursor"

export type PageType = "home" | "profile" | "tools" | "roadmap" | "contacts"

function App() {
    const [currentPage, setCurrentPage] = useState<PageType>("home")
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const [isInitialLoad, setIsInitialLoad] = useState(true)

    // Cursor repel state
    const [cursorRepelCenter, setCursorRepelCenter] = useState({ x: 0, y: 0 })
    const [isAvatarAngry, setIsAvatarAngry] = useState(false)

    // Use a stable toggle function to avoid racing
    const toggleSidebar = useCallback(() => {
        setSidebarOpen((prev) => !prev)
    }, [])

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsInitialLoad(false)
        }, 100)
        return () => clearTimeout(timer)
    }, [])

    // Reset angry state when navigating away from profile page
    useEffect(() => {
        if (currentPage !== "profile") {
            setIsAvatarAngry(false)
            setCursorRepelCenter({ x: 0, y: 0 })
        }
    }, [currentPage])

    const handleNavigate = (page: PageType) => {
        setCurrentPage(page)
    }

    const renderPage = () => {
        const pageVariants = {
            initial: { opacity: 0, x: 20, scale: 0.98 },
            animate: { opacity: 1, x: 0, scale: 1 },
            exit: { opacity: 0, x: -20, scale: 0.98 },
        }

        const pageTransition = {
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
        }

        switch (currentPage) {
            case "home":
                return (
                    <motion.div
                        key="home"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="w-full h-full"
                    >
                        <HomePage onNavigate={handleNavigate} />
                    </motion.div>
                )

            case "profile":
                return (
                    <motion.div
                        key="profile"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="w-full h-full"
                    >
                        <ProfilePage
                            onCursorRepelUpdate={setCursorRepelCenter}
                            onAngryStateChange={setIsAvatarAngry}
                        />
                    </motion.div>
                )

            case "tools":
                return (
                    <motion.div
                        key="tools"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="w-full h-full"
                    >
                        <ToolsPage />
                    </motion.div>
                )

            case "roadmap":
                return (
                    <motion.div
                        key="roadmap"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="w-full h-full"
                    >
                        <RoadmapPage />
                    </motion.div>
                )

            case "contacts":
                return (
                    <motion.div
                        key="contacts"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="w-full h-full"
                    >
                        <ContactsPage />
                    </motion.div>
                )

            default:
                return (
                    <motion.div
                        key="home"
                        variants={pageVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        transition={pageTransition}
                        className="w-full h-full"
                    >
                        <HomePage onNavigate={handleNavigate} />
                    </motion.div>
                )
        }
    }

    return (
        <div className="relative h-screen w-screen bg-black overflow-hidden">
            <CustomCursor
                repelCenter={cursorRepelCenter}
                repelRadius={120}
                repelStrength={200}
                repelCooldown={1200}
                isAngry={isAvatarAngry}
                isSidebarOpen={sidebarOpen}
            />

            {/* Main content area */}
            <main className="w-full h-full overflow-hidden">
                <AnimatePresence mode="wait">{renderPage()}</AnimatePresence>
            </main>

            {/* Johnny – z-30 */}
            <Johnny
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                isInitialLoad={isInitialLoad}
            />

            {/* Sidebar – z-50 */}
            <Sidebar
                isOpen={sidebarOpen}
                onToggle={toggleSidebar}
                currentPage={currentPage}
                onNavigate={handleNavigate}
                isInitialLoad={isInitialLoad}
            />
        </div>
    )
}

export default App
