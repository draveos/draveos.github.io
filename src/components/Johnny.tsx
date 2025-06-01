"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface JohnnyProps {
    isOpen: boolean
    onToggle: () => void
    isInitialLoad: boolean
}

const slayMessages = [
    "That tickles..",
    "Don’t you dare…",
    "You’ll regret this…",
    "AH! My face!"
]
const finalSlayText = "(Johnny has been slain, he won't appear again.)"

const Johnny = ({ isOpen, onToggle, isInitialLoad }: JohnnyProps) => {
    const [showJohnny, setShowJohnny] = useState(false)
    const [slayed, setSlayed] = useState(false)
    const [isShaking, setIsShaking] = useState(false)
    const [clickCount, setClickCount] = useState(0)
    const [subtitleText, setSubtitleText] = useState<string | null>(null)
    const [showSubtitle, setShowSubtitle] = useState(false)

    // Timers
    const appearTimeout = useRef<number | null>(null)
    const subtitleTimeout = useRef<number | null>(null)
    const slayExitTimeout = useRef<number | null>(null)

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (appearTimeout.current !== null) window.clearTimeout(appearTimeout.current)
            if (subtitleTimeout.current !== null) window.clearTimeout(subtitleTimeout.current)
            if (slayExitTimeout.current !== null) window.clearTimeout(slayExitTimeout.current)
        }
    }, [])

    /**
     * When the sidebar is fully open (isOpen === true):
     * 1) Wait 5 seconds.
     * 2) Fade Johnny in → show “– Ah, I found you!” → shrink (close) the sidebar.
     * 3) Do NOT auto-hide—Johnny remains visible until slayed.
     */
    useEffect(() => {
        if (slayed) {
            setShowJohnny(false)
            return
        }

        if (isOpen) {
            // Sidebar is open → schedule Johnny’s appearance
            appearTimeout.current = window.setTimeout(() => {
                // 2a) Fade in
                setShowJohnny(true)

                // 2b) Subtitle “– Ah, I found you!”
                setSubtitleText("– Ah, I found you!")
                setShowSubtitle(true)
                if (subtitleTimeout.current) clearTimeout(subtitleTimeout.current)
                subtitleTimeout.current = window.setTimeout(() => {
                    setShowSubtitle(false)
                }, 2000)

                // 2c) Immediately shrink/close the sidebar
                onToggle()

                // ✂️ Removed hideTimeout → Johnny now stays visible indefinitely
            }, 1500)
        } else {
            // Sidebar is closed → cancel any pending appearance
            // But we do NOT hide Johnny here; if he’s already visible, he stays up.
            if (appearTimeout.current !== null) window.clearTimeout(appearTimeout.current)
        }

        return () => {
            if (appearTimeout.current !== null) window.clearTimeout(appearTimeout.current)
        }
    }, [isOpen, slayed, onToggle])

    /** Handle user clicks (5 total to slay) */
    const handleClick = () => {
        if (!showJohnny || slayed) return

        const next = clickCount + 1
        setClickCount(next)
        setIsShaking(true)

        // Stop shaking after 0.7s
        window.setTimeout(() => setIsShaking(false), 700)

        if (next < 5) {
            // Show one of the four threat lines
            const msg = `– ${slayMessages[next - 1]}`
            setSubtitleText(msg)
            setShowSubtitle(true)
            if (subtitleTimeout.current) clearTimeout(subtitleTimeout.current)
            subtitleTimeout.current = window.setTimeout(() => {
                setShowSubtitle(false)
            }, 2000)
        } else {
            // Fifth click → final slay
            setSubtitleText(finalSlayText)
            setShowSubtitle(true)
            if (subtitleTimeout.current) clearTimeout(subtitleTimeout.current)
            subtitleTimeout.current = window.setTimeout(() => {
                setShowSubtitle(false)
            }, 2500)

            // Fade Johnny out with an exit animation
            setShowJohnny(false)

            // After 600ms (exit animation), mark as slayed so he never reappears
            slayExitTimeout.current = window.setTimeout(() => {
                setSlayed(true)
            }, 600)
        }
    }

    // If Johnny is slayed, render nothing
    if (slayed) return null

    return (
        <>
            {/* Subtitle at bottom-center */}
            <AnimatePresence>
                {showSubtitle && subtitleText && (
                    <motion.div
                        className="fixed left-1/2 bottom-8 transform -translate-x-1/3 bg-black bg-opacity-75 text-white px-4 py-2 rounded"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        transition={{ duration: 0.3 }}
                        key={subtitleText + showSubtitle}
                    >
                        <span className="text-sm">{subtitleText}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Johnny (visible only when showJohnny === true) */}
            <AnimatePresence>
                {showJohnny && (
                    <motion.div
                        className="fixed left-0 -translate-x-16 top-0 h-screen z-30 overflow-hidden"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
                        transition={{ duration: isInitialLoad ? 0.5 : 4.3 }}
                    >
                        <motion.button
                            style={{
                                all: "unset",
                                display: "block",
                                width: "100%",
                                height: "100%",
                                cursor: isShaking ? "default" : "pointer",
                            }}
                            onClick={handleClick}
                        >
                            <motion.img
                                src="/johnny.png"
                                alt="Johnny the Monster"
                                className="w-full h-full object-cover object-center rounded-r-[50px]"
                                animate={{
                                    filter: isShaking
                                        ? "brightness(0.6) contrast(1.4) saturate(1.8) hue-rotate(10deg)"
                                        : "brightness(1) contrast(1) saturate(1)",
                                }}
                                transition={{ duration: 0.3 }}
                            />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

export default Johnny
