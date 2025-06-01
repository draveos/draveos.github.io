"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { MousePosition } from "../../pages/ProfilePage"

interface SwimmingText {
    id: string
    text: string
    originalX: number
    originalY: number
    x: number
    y: number
    vx: number
    vy: number
    side: "left" | "right"
    fontSize: number
    color: string
}

interface SwimmingTextsProps {
    mousePos: MousePosition
    centerX: number
    centerY: number
}

const leftTexts = [
    { text: "UI/UX Designer", size: 32, color: "#e5e7eb" },
    { text: "Interactive", size: 28, color: "#d1d5db" },
    { text: "Developer", size: 36, color: "#f3f4f6" },
    { text: "from Seoul", size: 24, color: "#9ca3af" },
    { text: "CAU", size: 40, color: "#ffffff" },
    { text: "AI Department", size: 20, color: "#6b7280" },
]

const rightTexts = [
    { text: "Design for fun", size: 30, color: "#e5e7eb" },
    { text: "for life", size: 26, color: "#d1d5db" },
    { text: "and most", size: 22, color: "#9ca3af" },
    { text: "importantly", size: 34, color: "#f3f4f6" },
    { text: "with passion", size: 38, color: "#ffffff" },
    { text: "& creativity", size: 28, color: "#d1d5db" },
]

const SwimmingTexts: React.FC<SwimmingTextsProps> = ({ mousePos, centerX, centerY }) => {
    const [swimmingTexts, setSwimmingTexts] = useState<SwimmingText[]>([])
    const animationRef = useRef<number>()

    // Initialize swimming texts with better positioning
    useEffect(() => {
        const initTexts: SwimmingText[] = [
            ...leftTexts.map((item, index) => {
                const angle = (index / leftTexts.length) * Math.PI - Math.PI / 2
                const radius = 280 + index * 20
                const originalX = centerX + Math.cos(angle + Math.PI) * radius
                const originalY = centerY + Math.sin(angle + Math.PI) * radius * 0.8

                return {
                    id: `left-${index}`,
                    text: item.text,
                    originalX,
                    originalY,
                    x: originalX,
                    y: originalY,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    side: "left" as const,
                    fontSize: item.size,
                    color: item.color,
                }
            }),
            ...rightTexts.map((item, index) => {
                const angle = (index / rightTexts.length) * Math.PI - Math.PI / 2
                const radius = 280 + index * 20
                const originalX = centerX + Math.cos(angle) * radius
                const originalY = centerY + Math.sin(angle) * radius * 0.8

                return {
                    id: `right-${index}`,
                    text: item.text,
                    originalX,
                    originalY,
                    x: originalX,
                    y: originalY,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    side: "right" as const,
                    fontSize: item.size,
                    color: item.color,
                }
            }),
        ]
        setSwimmingTexts(initTexts)
    }, [centerX, centerY])

    // Enhanced swimming animation with return-to-origin behavior
    useEffect(() => {
        const animate = () => {
            setSwimmingTexts((prev) =>
                prev.map((text) => {
                    let { x, y, vx, vy, originalX, originalY } = text

                    // Distance from mouse
                    const dx = mousePos.x - x
                    const dy = mousePos.y - y
                    const distance = Math.sqrt(dx * dx + dy * dy)

                    // Strong avoidance when mouse is near
                    if (distance < 150) {
                        const avoidanceForce = 0.12 // Increased force
                        const avoidX = ((-dx / distance) * avoidanceForce * (150 - distance)) / 150
                        const avoidY = ((-dy / distance) * avoidanceForce * (150 - distance)) / 150
                        vx += avoidX
                        vy += avoidY
                    }

                    // Return to original position when mouse is far
                    const returnDx = originalX - x
                    const returnDy = originalY - y
                    const returnDistance = Math.sqrt(returnDx * returnDx + returnDy * returnDy)

                    if (distance > 200 && returnDistance > 5) {
                        const returnForce = 0.03 // Increased return force
                        vx += (returnDx / returnDistance) * returnForce
                        vy += (returnDy / returnDistance) * returnForce
                    }

                    // Natural swimming motion around original position
                    const timeOffset = Date.now() * 0.001 + text.id.charCodeAt(0)
                    const swimX = Math.sin(timeOffset * 0.5) * 2
                    const swimY = Math.cos(timeOffset * 0.3) * 1.5

                    if (distance > 200) {
                        vx += swimX * 0.01
                        vy += swimY * 0.01
                    }

                    // Apply velocity
                    x += vx
                    y += vy

                    // Damping
                    vx *= 0.95
                    vy *= 0.95

                    return { ...text, x, y, vx, vy }
                }),
            )

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [mousePos])

    return (
        <>
            {swimmingTexts.map((text) => (
                <motion.div
                    key={text.id}
                    className="absolute pointer-events-none select-none z-10 font-light"
                    style={{
                        x: text.x,
                        y: text.y,
                        fontSize: text.fontSize,
                        color: text.color,
                        textShadow: "0 0 20px rgba(255,255,255,0.3)",
                    }}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + Math.random() * 0.5, duration: 0.8 }}
                    whileHover={{ scale: 1.1, color: "#ffffff" }}
                >
                    {text.text}
                </motion.div>
            ))}
        </>
    )
}

export default SwimmingTexts
