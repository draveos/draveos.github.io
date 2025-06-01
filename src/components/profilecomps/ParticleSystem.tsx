"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import type { Particle } from "../../pages/ProfilePage"

interface ParticleSystemProps {
    particles: Particle[]
    setParticles: React.Dispatch<React.SetStateAction<Particle[]>>
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ particles, setParticles }) => {
    const animationRef = useRef<number>()

    // Update particles with cleanup for stuck particles
    useEffect(() => {
        const animate = () => {
            setParticles((prev) =>
                prev
                    .map((particle) => ({
                        ...particle,
                        x: particle.x + particle.vx,
                        y: particle.y + particle.vy,
                        vy: particle.vy + 0.1, // gravity
                        life: particle.life - 1,
                    }))
                    .filter((particle) => {
                        // Remove particles that are expired or stuck (not moving much)
                        const isAlive = particle.life > 0
                        const isMoving = Math.abs(particle.vx) > 0.1 || Math.abs(particle.vy) > 0.1
                        const isOnScreen = particle.y < window.innerHeight + 100

                        return isAlive && (isMoving || particle.life > 50) && isOnScreen
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
    }, [setParticles])

    return (
        <>
            {particles.map((particle) => (
                <motion.div
                    key={particle.id}
                    className="absolute w-2 h-2 bg-white rounded-full pointer-events-none"
                    style={{
                        left: particle.x,
                        top: particle.y,
                        opacity: particle.life / particle.maxLife,
                    }}
                />
            ))}
        </>
    )
}

export default ParticleSystem
