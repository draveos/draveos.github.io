"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { ShootingWord } from "../../pages/ProfilePage"

interface ShootingWordsProps {
    shootingWords: ShootingWord[]
    setShootingWords: React.Dispatch<React.SetStateAction<ShootingWord[]>>
}

const MAX_WORDS = 5 // Performance threshold

const ShootingWords: React.FC<ShootingWordsProps> = ({ shootingWords, setShootingWords }) => {
    const animationRef = useRef<number>()

    // Animate shooting words with performance optimization
    useEffect(() => {
        const animate = () => {
            setShootingWords((prev) => {
                let updatedWords = prev
                    .map((word) => ({
                        ...word,
                        x: word.x + word.vx,
                        y: word.y + word.vy,
                        vy: word.vy + 0.3, // gravity
                        life: word.life - 1,
                        rotation: word.rotation + 5,
                    }))
                    .filter((word) => word.life > 0 && word.y < window.innerHeight + 100) // Remove when off screen

                // Performance optimization: if too many words, remove oldest ones
                if (updatedWords.length > MAX_WORDS) {
                    updatedWords = updatedWords.slice(-MAX_WORDS)
                }

                return updatedWords
            })

            animationRef.current = requestAnimationFrame(animate)
        }

        animationRef.current = requestAnimationFrame(animate)
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [setShootingWords])

    return (
        <AnimatePresence>
            {shootingWords.map((word) => (
                <motion.div
                    key={word.id}
                    className="absolute pointer-events-none select-none z-20 font-bold text-yellow-300"
                    style={{
                        left: word.x,
                        top: word.y,
                        fontSize: `${20 * word.scale}px`,
                        rotate: `${word.rotation}deg`,
                        textShadow: "0 0 10px rgba(255,255,0,0.8), 0 0 20px rgba(255,255,0,0.4)",
                        opacity: Math.min(1, word.life / 60), // Fade out in last second
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: word.scale }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                >
                    {word.text}
                </motion.div>
            ))}
        </AnimatePresence>
    )
}

export default ShootingWords
