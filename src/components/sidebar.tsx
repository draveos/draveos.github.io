"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { PageType } from "../App"

interface SidebarProps {
    isOpen: boolean
    onToggle: () => void
    currentPage: PageType
    onNavigate: (page: PageType) => void
    isInitialLoad: boolean
}

const menuItems: { key: PageType; label: string; delay: number }[] = [
    { key: "profile", label: "Profile", delay: 0.1 },
    { key: "tools", label: "Tools I use", delay: 0.2 },
    { key: "roadmap", label: "Roadmap", delay: 0.3 },
    { key: "contacts", label: "Contacts", delay: 0.4 },
]

const Sidebar = ({ isOpen, onToggle, currentPage, onNavigate, isInitialLoad }: SidebarProps) => {
    const [showShockwave, setShowShockwave] = useState(false)

    const handleToggle = () => {
        setShowShockwave(true)
        setTimeout(() => setShowShockwave(false), 600)
        onToggle()
    }

    const handleNavigate = (page: PageType) => {
        onNavigate(page)
    }

    return (
        <motion.div
            className="fixed left-0 top-0 h-screen z-50 overflow-hidden" // z-50으로 Johnny보다 위
            initial={isInitialLoad ? { width: 0 } : false}
            animate={{
                width: isOpen ? "348px" : "140px",
                x: isOpen ? 0 : -10,
            }}
            transition={{
                duration: 0.8,
                ease: [0.4, 0, 0.2, 1],
                x: { duration: 0.4 },
            }}
        >
            {/* Professional Background */}
            <motion.div
                className="absolute inset-0 rounded-r-[50px] shadow-2xl backdrop-blur-sm"
                initial={isInitialLoad ? { scaleX: 0 } : false}
                animate={{
                    scaleX: 1,
                    opacity: isOpen ? 0.97 : 0.85,
                    backgroundColor: "#ffffff",
                }}
                transition={{
                    duration: 0.8,
                    ease: [0.4, 0, 0.2, 1],
                    delay: isInitialLoad ? 0.2 : 0,
                }}
                style={{ transformOrigin: "left center" }}
            />

            {/* Gradient Overlay */}
            <motion.div
                className="absolute inset-0 rounded-r-[50px]"
                animate={{
                    opacity: isOpen ? 0.95 : 0.85,
                    background:
                        "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.98) 50%, rgba(255,255,255,1) 100%)",
                    backdropFilter: "blur(8px)",
                }}
                transition={{ duration: 0.8, ease: "easeInOut" }}
            />

            {/* Border */}
            <motion.div
                className="absolute inset-0 rounded-r-[50px] border-r border-t border-b"
                animate={{
                    borderColor: "rgba(229, 231, 235, 0.3)",
                    opacity: isOpen ? 0.3 : 0.2,
                }}
                transition={{ duration: 0.6 }}
            />

            {/* Content */}
            <div className="relative h-full p-8 flex flex-col z-10">
                {/* Header */}
                <motion.div
                    className="mb-8"
                    initial={isInitialLoad ? { opacity: 0, y: -20 } : false}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        duration: 0.6,
                        delay: isInitialLoad ? 0.8 : 0,
                    }}
                >
                    <AnimatePresence mode="sync">
                        {isOpen ? (
                            <motion.div
                                key="header-open"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{
                                    duration: 0.4,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            >
                                <button
                                    onClick={() => handleNavigate("home")}
                                    className="text-left hover:opacity-70 transition-opacity w-full group"
                                >
                                    <motion.h1
                                        className="text-4xl font-extralight text-zinc-950 text-center leading-tight"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        SeJin
                                        <br />
                                        Kim
                                    </motion.h1>
                                </button>

                                {/* Division line */}
                                <motion.div
                                    className="w-full h-0.5 mt-4 bg-gradient-to-r from-gray-300 via-gray-600 to-gray-300"
                                    initial={{ scaleX: 0 }}
                                    animate={{ scaleX: 1 }}
                                    exit={{ scaleX: 0, transition: { duration: 0.3 } }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.2,
                                        ease: [0.4, 0, 0.2, 1],
                                    }}
                                    style={{ transformOrigin: "left center" }}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="header-closed"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex justify-center"
                            >
                                <motion.div
                                    className="text-2xl font-light text-zinc-950 cursor-pointer"
                                    whileHover={{
                                        scale: 1.1,
                                        color: "#666666",
                                    }}
                                    onClick={() => handleNavigate("home")}
                                >
                                    SJ
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Menu Items */}
                <motion.nav className="flex-1 flex flex-col gap-8 mt-8">
                    {menuItems.map((item, index) => (
                        <motion.button
                            key={item.key}
                            className={`relative text-center py-3 text-3xl font-extralight transition-all w-full overflow-hidden ${
                                currentPage === item.key ? "text-gray-800 font-medium" : "text-black"
                            }`}
                            onClick={() => handleNavigate(item.key)}
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                                duration: 0.5,
                                delay: isInitialLoad ? 1.0 + item.delay : 0.1 + index * 0.1,
                                ease: [0.4, 0, 0.2, 1],
                            }}
                            whileTap={{ scale: 0.95 }}
                            whileHover={{
                                scale: 1.05,
                                transition: { duration: 0.2 },
                            }}
                        >
                            {isOpen ? (
                                <>
                                    <motion.span className="relative">
                                        {item.label}
                                        <motion.div
                                            className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: currentPage === item.key ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                            style={{ transformOrigin: "left center" }}
                                        />
                                    </motion.span>
                                </>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3 }}
                                    className="w-8 h-8 mx-auto"
                                    whileHover={{
                                        scale: 1.2,
                                        rotate: 5,
                                        filter: "brightness(1.2)",
                                    }}
                                >
                                    <img
                                        src={`/icons/${item.key}.png`}
                                        alt={item.label}
                                        className="w-full h-full object-contain opacity-80"
                                    />
                                </motion.div>
                            )}
                        </motion.button>
                    ))}
                </motion.nav>

                {/* Toggle Button */}
                <motion.button
                    className="relative w-12 h-12 rounded-full flex items-center justify-center cursor-pointer transition-all hover:scale-110 mt-auto mx-auto"
                    style={{
                        backgroundColor: "#171717",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                    }}
                    onClick={handleToggle}
                    whileTap={{ scale: 0.9 }}
                    whileHover={{
                        scale: 1.15,
                        transition: { duration: 0.2 },
                        boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
                    }}
                >
                    <motion.div
                        animate={{
                            rotate: isOpen ? 180 : 0,
                            x: isOpen ? 0 : -2,
                            color: "#ffffff",
                        }}
                        transition={{
                            duration: 0.6,
                            ease: [0.4, 0, 0.2, 1],
                            rotate: {
                                type: "spring",
                                stiffness: 200,
                                damping: 20,
                            },
                        }}
                        className="text-xl font-bold"
                    >
                        →
                    </motion.div>

                    {/* Shockwave Effect */}
                    <AnimatePresence mode="sync">
                        {showShockwave && (
                            <>
                                <motion.div
                                    key="shockwave-border"
                                    className="absolute inset-0 border-2 rounded-full pointer-events-none border-white"
                                    initial={{ scale: 1, opacity: 1 }}
                                    animate={{ scale: 4, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.6, ease: "easeOut" }}
                                />
                                <motion.div
                                    key="shockwave-bg"
                                    className="absolute inset-0 rounded-full pointer-events-none bg-white"
                                    initial={{ scale: 1, opacity: 0.2 }}
                                    animate={{ scale: 2.5, opacity: 0 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                />
                            </>
                        )}
                    </AnimatePresence>
                </motion.button>
            </div>
        </motion.div>
    )
}

export default Sidebar
