"use client"

import React from "react"
import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { MousePosition, ShootingWord } from "../../pages/ProfilePage"

interface ProfileAvatarProps {
    centerX: number
    centerY: number
    mousePos: MousePosition
    clickCount: number
    glassShaking: boolean
    glassBroken: boolean
    glassShards: Array<{ id: number; x: number; y: number; vx: number; vy: number }>
    eyeGlow: boolean
    breathingPhase: number
    isDragging: boolean
    dragOffset: { x: number; y: number }
    onAvatarClick: () => void
    onAvatarMouseDown: (e: React.MouseEvent) => void
    onShootWords: React.Dispatch<React.SetStateAction<ShootingWord[]>>
}

const shootingWordsList = ["@", "?!", "##!!", "*&%", "wow!", "omg!", "lol", "wtf", "!!!", "???"]
const angryDialogues = [
    "I am done playing with you!",
    "Don't touch me!",
    "Leave me alone!",
    "Go away!",
    "Stop bothering me!",
    "I'm angry now!",
    "Back off!",
    "Enough!",
]

const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
                                                         centerX,
                                                         centerY,
                                                         mousePos,
                                                         clickCount,
                                                         glassShaking,
                                                         glassBroken,
                                                         glassShards,
                                                         eyeGlow,
                                                         breathingPhase,
                                                         isDragging,
                                                         dragOffset,
                                                         onAvatarClick,
                                                         onAvatarMouseDown,
                                                         onShootWords,
                                                     }) => {
    const [showAngryDialogue, setShowAngryDialogue] = useState(false)
    const [currentAngryText, setCurrentAngryText] = useState("")
    const angryDialogueTimeout = useRef<number | null>(null)
    const lastAngryDialogueTime = useRef<number>(0)

    // Enhanced face tracking with limits
    const maxOffset = 15
    const faceOffsetX = Math.max(-maxOffset, Math.min(maxOffset, (mousePos.x - centerX) * 0.03))
    const faceOffsetY = Math.max(-maxOffset, Math.min(maxOffset, (mousePos.y - centerY) * 0.03))

    // Eye tracking
    const eyeOffsetX = (mousePos.x - centerX) * 0.02
    const eyeOffsetY = (mousePos.y - centerY) * 0.02

    // Breathing effect
    const breathingScale = 1 + Math.sin(breathingPhase) * 0.02

    // Stretch effect when dragging
    const stretchDistance = Math.sqrt(dragOffset.x * dragOffset.x + dragOffset.y * dragOffset.y)
    const stretchScale = isDragging ? 1 + stretchDistance * 0.002 : 1
    const stretchSkew = isDragging ? dragOffset.x * 0.1 : 0

    // Cursor proximity detection for angry dialogue with 2-second cooldown
    const avatarCenterX = centerX + dragOffset.x
    const avatarCenterY = centerY + dragOffset.y
    const distanceToMouse = Math.sqrt(Math.pow(mousePos.x - avatarCenterX, 2) + Math.pow(mousePos.y - avatarCenterY, 2))

    // Handle angry dialogue with cooldown
    React.useEffect(() => {
        if (glassBroken && distanceToMouse < 120 && !isDragging) {
            const now = Date.now()
            const timeSinceLastDialogue = now - lastAngryDialogueTime.current

            // Only show dialogue if 2 seconds have passed since the last one
            if (timeSinceLastDialogue >= 2000) {
                const randomDialogue = angryDialogues[Math.floor(Math.random() * angryDialogues.length)]
                setCurrentAngryText(randomDialogue)
                setShowAngryDialogue(true)
                lastAngryDialogueTime.current = now

                // Clear any existing timeout
                if (angryDialogueTimeout.current) {
                    clearTimeout(angryDialogueTimeout.current)
                }

                // Hide dialogue after 1.5 seconds
                angryDialogueTimeout.current = setTimeout(() => {
                    setShowAngryDialogue(false)
                }, 1500)
            }
        } else if (distanceToMouse >= 120 || !glassBroken || isDragging) {
            // Hide dialogue when cursor moves away or conditions change
            setShowAngryDialogue(false)
            if (angryDialogueTimeout.current) {
                clearTimeout(angryDialogueTimeout.current)
                angryDialogueTimeout.current = null
            }
        }

        // Cleanup timeout on unmount
        return () => {
            if (angryDialogueTimeout.current) {
                clearTimeout(angryDialogueTimeout.current)
            }
        }
    }, [glassBroken, distanceToMouse, isDragging])

    const handleClick = () => {
        onAvatarClick()

        // Clear any particles/words that might be stuck in the center
        onShootWords((prev) => {
            // Remove words that are too close to the avatar center (stuck words)
            const filteredWords = prev.filter((word) => {
                const wordDistance = Math.sqrt(Math.pow(word.x - avatarCenterX, 2) + Math.pow(word.y - avatarCenterY, 2))
                return wordDistance > 100 // Remove words within 100px of avatar center
            })

            // Performance threshold: limit to 15 words maximum
            const currentWords = filteredWords.length
            let finalWords = filteredWords
            if (currentWords >= 15) {
                // Remove oldest words to make room for new ones
                const wordsToRemove = Math.min(5, currentWords - 10)
                finalWords = filteredWords.slice(wordsToRemove)
            }

            const numWords = Math.floor(Math.random() * 3) + 2 // 2-4 words
            const newWords = Array.from({ length: numWords }, (_, i) => ({
                id: Date.now() + i,
                text: shootingWordsList[Math.floor(Math.random() * shootingWordsList.length)],
                x: centerX + dragOffset.x,
                y: centerY + dragOffset.y,
                vx: (Math.random() - 0.5) * 8,
                vy: -Math.random() * 8 - 5, // Always shoot upward initially
                life: 180, // 3 seconds at 60fps
                rotation: Math.random() * 360,
                scale: 0.8 + Math.random() * 0.4,
            }))

            return [...finalWords, ...newWords]
        })
    }

    return (
        <motion.div
            className="absolute cursor-pointer z-20 select-none"
            style={{
                left: centerX - 100,
                top: centerY - 100,
                x: faceOffsetX + dragOffset.x,
                y: faceOffsetY + dragOffset.y,
                scale: breathingScale * stretchScale,
                skewX: stretchSkew,
            }}
            onClick={handleClick}
            onMouseDown={onAvatarMouseDown}
            animate={glassShaking ? { rotate: [0, -3, 3, -3, 3, 0] } : {}}
            transition={{ duration: 0.3 }}
            whileHover={{ scale: breathingScale * 1.05 }}
        >
            {/* Stretch indicator line when dragging */}
            {isDragging && stretchDistance > 20 && (
                <motion.div
                    className="absolute w-1 bg-yellow-400 opacity-60 z-0"
                    style={{
                        left: 100 - dragOffset.x,
                        top: 100 - dragOffset.y,
                        height: stretchDistance,
                        transformOrigin: "top center",
                        rotate: Math.atan2(dragOffset.y, dragOffset.x) * (180 / Math.PI) + 90,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.6 }}
                />
            )}

            {/* Angry dialogue with 2-second cooldown */}
            <AnimatePresence>
                {showAngryDialogue && (
                    <motion.div
                        className="absolute text-lg font-bold text-red-400 pointer-events-none z-30 whitespace-nowrap"
                        style={{
                            left: 100,
                            top: -60,
                            transform: "translateX(-50%)",
                            textShadow: "0 0 10px rgba(255,0,0,0.8)",
                        }}
                        initial={{ opacity: 0, scale: 0.5, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {currentAngryText}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Profile Image */}
            <div className="w-48 h-48 bg-gradient-to-br from-amber-200 to-amber-400 rounded-full relative flex items-center justify-center overflow-hidden shadow-2xl">
                {/* Face features */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-amber-600 opacity-30" />

                {/* PNG Mustache - Updated path and size */}
                <motion.img
                    src="/public/mustache.png"
                    alt="mustache"
                    className="absolute w-12 h-10 object-contain"
                    style={{
                        bottom: "68px", // Positioned above the mouth
                        left: "37.5%",
                        transform: "translateX(-50%)",
                    }}
                    animate={{
                        scaleY: 1 + Math.sin(breathingPhase * 0.5) * 0.05,
                        scaleX: 1 + Math.sin(breathingPhase * 0.3) * 0.05,
                    }}
                />

                {/* Eyes - improved angry state */}
                <div className="absolute top-16 flex gap-8">
                    <motion.div
                        className="relative"
                        style={{
                            x: eyeOffsetX,
                            y: eyeOffsetY,
                        }}
                    >
                        {/* Eye */}
                        <div
                            className="w-4 h-4 bg-black rounded-full relative"
                            style={{
                                boxShadow: eyeGlow ? "0 0 20px #60a5fa" : "none",
                                transform: glassBroken ? "scaleY(0.7)" : "none",
                            }}
                        >
                            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                        </div>
                        {/* Angry eyebrow */}
                        {glassBroken && (
                            <div className="absolute -top-2 -left-1 w-6 h-1 bg-red-700 rounded-full transform rotate-12" />
                        )}
                    </motion.div>

                    <motion.div
                        className="relative"
                        style={{
                            x: eyeOffsetX,
                            y: eyeOffsetY,
                        }}
                    >
                        {/* Eye */}
                        <div
                            className="w-4 h-4 bg-black rounded-full relative"
                            style={{
                                boxShadow: eyeGlow ? "0 0 20px #60a5fa" : "none",
                                transform: glassBroken ? "scaleY(0.7)" : "none",
                            }}
                        >
                            <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
                        </div>
                        {/* Angry eyebrow */}
                        {glassBroken && (
                            <div className="absolute -top-2 -left-1 w-6 h-1 bg-red-700 rounded-full transform -rotate-12" />
                        )}
                    </motion.div>
                </div>

                {/* Nose */}
                <div className="absolute top-20 w-2 h-3 bg-amber-600 rounded-full" />

                {/* Mouth - moved down and improved angry state */}
                <motion.div
                    className="absolute top-28" // Moved down from top-24 to top-28
                    animate={{
                        scaleX: glassBroken ? 1 : 1 + Math.sin(breathingPhase * 2) * 0.1,
                    }}
                >
                    {glassBroken ? (
                        // Angry frown - more natural curve
                        <div className="relative">
                            <div
                                className="w-8 h-2 bg-red-800 rounded-full transform rotate-180"
                                style={{ clipPath: "ellipse(16px 4px at 50% 25%)" }}
                            />
                            {/* Angry mouth corners */}
                            <div className="absolute -left-1 top-0 w-2 h-1 bg-red-900 rounded-full transform rotate-45" />
                            <div className="absolute -right-1 top-0 w-2 h-1 bg-red-900 rounded-full transform -rotate-45" />
                        </div>
                    ) : (
                        // Normal mouth
                        <div className="w-6 h-1 bg-amber-800 rounded-full" />
                    )}
                </motion.div>

                {/* Glasses */}
                <AnimatePresence>
                    {!glassBroken && (
                        <motion.div
                            className="absolute top-12 flex items-center gap-2"
                            animate={glassShaking ? { x: [-2, 2, -2, 2, 0] } : {}}
                            exit={{ opacity: 0, scale: 0, rotate: 180 }}
                            transition={{ duration: 0.5 }}
                        >
                            {/* Left lens */}
                            <div className="w-12 h-10 border-2 border-black rounded-lg bg-blue-100 bg-opacity-30 backdrop-blur-sm" />
                            {/* Bridge */}
                            <div className="w-3 h-1 bg-black rounded-full" />
                            {/* Right lens */}
                            <div className="w-12 h-10 border-2 border-black rounded-lg bg-blue-100 bg-opacity-30 backdrop-blur-sm" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Glass Shards */}
                <AnimatePresence>
                    {glassBroken &&
                        glassShards.map((shard) => (
                            <motion.div
                                key={shard.id}
                                className="absolute w-2 h-2 bg-blue-200 opacity-80 rotate-45"
                                initial={{ x: 0, y: -20, rotate: 0, scale: 1 }}
                                animate={{
                                    x: shard.vx * 20,
                                    y: shard.vy * 20,
                                    rotate: 720,
                                    opacity: 0,
                                    scale: 0,
                                }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                        ))}
                </AnimatePresence>
            </div>

            {/* Click Progress */}
            <motion.div
                className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-white text-lg font-light"
                animate={{ opacity: clickCount > 0 ? 1 : 0 }}
            >
                <div className="text-center">
                    <div className="text-sm opacity-70">Break the glasses</div>
                    <div className="text-xl">{clickCount}/100</div>
                    <div className="w-24 h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
                        <motion.div
                            className="h-full rounded-full"
                            style={{
                                background: glassBroken
                                    ? "linear-gradient(to right, #dc2626, #b91c1c)" // Red gradient when angry
                                    : "linear-gradient(to right, #3b82f6, #8b5cf6)", // Blue to purple when normal
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${clickCount}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

export default ProfileAvatar
