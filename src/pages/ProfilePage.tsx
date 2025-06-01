"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import ProfileAvatar from "../components/profilecomps/ProfileAvatar"
import SwimmingTexts from "../components/profilecomps/SwimmingTexts"
import ShootingWords from "../components/profilecomps/ShootingWords"
import ParticleSystem from "../components/profilecomps/ParticleSystem"

export interface MousePosition {
    x: number
    y: number
}

export interface Particle {
    id: number
    x: number
    y: number
    vx: number
    vy: number
    life: number
    maxLife: number
}

export interface ShootingWord {
    id: number
    text: string
    x: number
    y: number
    vx: number
    vy: number
    life: number
    rotation: number
    scale: number
}

// Updated center position
export const centerX = 840
export const centerY = 350

interface ProfilePageProps {
    onCursorRepelUpdate?: (center: { x: number; y: number }) => void
    onAngryStateChange?: (isAngry: boolean) => void
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onCursorRepelUpdate, onAngryStateChange }) => {
    const [mousePos, setMousePos] = useState<MousePosition>({ x: centerX, y: centerY })
    const [clickCount, setClickCount] = useState(0)
    const [glassShaking, setGlassShaking] = useState(false)
    const [glassBroken, setGlassBroken] = useState(false)
    const [glassShards, setGlassShards] = useState<Array<{ id: number; x: number; y: number; vx: number; vy: number }>>(
        [],
    )
    const [particles, setParticles] = useState<Particle[]>([])
    const [shootingWords, setShootingWords] = useState<ShootingWord[]>([])
    const [eyeGlow, setEyeGlow] = useState(false)
    const [breathingPhase, setBreathingPhase] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
    const [stretchPhrase, setStretchPhrase] = useState("")
    const [showStretchPhrase, setShowStretchPhrase] = useState(false)

    const breathingRef = useRef<number>()

    // Update cursor repel center and angry state
    useEffect(() => {
        const avatarCenterX = centerX + dragOffset.x
        const avatarCenterY = centerY + dragOffset.y

        if (onCursorRepelUpdate) {
            onCursorRepelUpdate({ x: avatarCenterX, y: avatarCenterY })
        }

        if (onAngryStateChange) {
            onAngryStateChange(glassBroken)
        }
    }, [dragOffset.x, dragOffset.y, glassBroken, onCursorRepelUpdate, onAngryStateChange])

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setMousePos({ x: e.clientX, y: e.clientY })

            if (isDragging) {
                const newOffset = {
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                }
                setDragOffset(newOffset)
            }
        }

        const handleMouseUp = () => {
            if (isDragging) {
                setIsDragging(false)
                setShowStretchPhrase(false)
                // Rubber band back to original position
                setDragOffset({ x: 0, y: 0 })
            }
        }

        window.addEventListener("mousemove", handleMouseMove)
        window.addEventListener("mouseup", handleMouseUp)
        return () => {
            window.removeEventListener("mousemove", handleMouseMove)
            window.removeEventListener("mouseup", handleMouseUp)
        }
    }, [isDragging, dragStart])

    // Breathing animation
    useEffect(() => {
        const breathe = () => {
            setBreathingPhase((prev) => prev + 0.02)
            breathingRef.current = requestAnimationFrame(breathe)
        }
        breathingRef.current = requestAnimationFrame(breathe)
        return () => {
            if (breathingRef.current) {
                cancelAnimationFrame(breathingRef.current)
            }
        }
    }, [])

    const handleAvatarClick = () => {
        if (glassBroken) return

        setClickCount((prev) => prev + 1)
        setGlassShaking(true)
        setEyeGlow(true)

        // Create particles on click with performance limit and cleanup
        setParticles((prev) => {
            // Remove particles that are stuck in the center
            const filteredParticles = prev.filter((particle) => {
                const particleDistance = Math.sqrt(
                    Math.pow(particle.x - (centerX + dragOffset.x), 2) + Math.pow(particle.y - (centerY + dragOffset.y), 2),
                )
                return particleDistance > 80 // Remove particles within 80px of avatar center
            })

            // Limit particles to prevent performance issues
            const currentParticles = filteredParticles.length
            let finalParticles = filteredParticles
            if (currentParticles >= 30) {
                finalParticles = filteredParticles.slice(-20) // Keep only the 20 most recent particles
            }

            const newParticles = Array.from({ length: 8 }, (_, i) => ({
                id: Date.now() + i,
                x: centerX + dragOffset.x,
                y: centerY + dragOffset.y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                life: 60,
                maxLife: 60,
            }))

            return [...finalParticles, ...newParticles]
        })

        setTimeout(() => {
            setGlassShaking(false)
            setEyeGlow(false)
        }, 300)

        if (clickCount >= 99) {
            setGlassBroken(true)
            // Create glass shards
            const shards = Array.from({ length: 20 }, (_, i) => ({
                id: i,
                x: 0,
                y: 0,
                vx: (Math.random() - 0.5) * 15,
                vy: (Math.random() - 0.5) * 15,
            }))
            setGlassShards(shards)
        }
    }

    const handleAvatarMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true)
        setDragStart({ x: e.clientX, y: e.clientY })

        // Random stretch phrase
        const phrases = ["hey!", "leave me alone!", "aw", "that hurts", "stop it!", "ouch!", "why?!", "help!"]
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)]
        setStretchPhrase(randomPhrase)
        setShowStretchPhrase(true)
    }

    return (
        <div className="w-full h-screen bg-neutral-900 relative overflow-hidden">
            {/* Particle System */}
            <ParticleSystem particles={particles} setParticles={setParticles} />

            {/* Shooting Words */}
            <ShootingWords shootingWords={shootingWords} setShootingWords={setShootingWords} />

            {/* Swimming Texts */}
            <SwimmingTexts mousePos={mousePos} centerX={centerX - 80} centerY={centerY} />

            {/* Main Title */}
            <motion.h1
                className="absolute text-6xl font-extralight text-white text-center select-none"
                style={{
                    left: centerX - 140,
                    top: centerY + 400,
                    transform: "translateX(-40%)",
                    textShadow: "0 0 30px rgba(255,255,255,0.5)",
                }}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.8 }}
            >
                SeJin Kim
            </motion.h1>

            {/* Profile Avatar */}
            <ProfileAvatar
                centerX={centerX}
                centerY={centerY}
                mousePos={mousePos}
                clickCount={clickCount}
                glassShaking={glassShaking}
                glassBroken={glassBroken}
                glassShards={glassShards}
                eyeGlow={eyeGlow}
                breathingPhase={breathingPhase}
                isDragging={isDragging}
                dragOffset={dragOffset}
                onAvatarClick={handleAvatarClick}
                onAvatarMouseDown={handleAvatarMouseDown}
                onShootWords={setShootingWords}
            />

            {/* Stretch Phrase */}
            {showStretchPhrase && (
                <motion.div
                    className="absolute text-2xl font-bold text-yellow-300 pointer-events-none z-30"
                    style={{
                        left: centerX + dragOffset.x,
                        top: centerY + dragOffset.y - 150,
                        transform: "translateX(-50%)",
                        textShadow: "0 0 10px rgba(255,255,0,0.8)",
                    }}
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: -20 }}
                >
                    {stretchPhrase}
                </motion.div>
            )}

            {/* Floating decorative elements */}
            {Array.from({ length: 6 }).map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full opacity-50"
                    style={{
                        left: centerX + Math.cos((i * Math.PI) / 3) * 300,
                        top: centerY + Math.sin((i * Math.PI) / 3) * 300,
                    }}
                    animate={{
                        y: [0, -10, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: 3,
                        delay: i * 0.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    )
}

export default ProfilePage
