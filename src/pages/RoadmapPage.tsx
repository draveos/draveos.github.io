"use client"

import type React from "react"
import { motion } from "framer-motion"

type RoadmapPageProps = {}

const RoadmapPage: React.FC<RoadmapPageProps> = () => {
    return (
        <div className="relative w-full h-screen bg-neutral-900 flex flex-col items-center pl-[300px] pt-12 overflow-hidden">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 opacity-5">
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
            `,
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            {/* Celestial Stars - Optimized */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 40 }).map((_, i) => (
                    <motion.div
                        key={`star-${i}`}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            opacity: Math.random() * 0.5 + 0.2,
                        }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: Math.random() * 1, duration: 0.5 }}
                    >
                        <div
                            className={`${i % 3 === 0 ? "w-1 h-1 rounded-full" : "w-1.5 h-1.5 rotate-45"} bg-white`}
                            style={{
                                boxShadow: `0 0 ${2 + Math.random() * 3}px rgba(255, 255, 255, 0.8)`,
                            }}
                        />
                        <motion.div
                            className="absolute inset-0"
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{
                                duration: 1.5 + Math.random() * 3,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: Math.random() * 2,
                            }}
                        />
                    </motion.div>
                ))}
            </div>

            {/* Nebula Clouds - Monochrome */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                        key={`nebula-${i}`}
                        className="absolute rounded-full bg-white opacity-[0.02]"
                        style={{
                            width: `${150 + Math.random() * 200}px`,
                            height: `${150 + Math.random() * 200}px`,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            filter: `blur(${30 + Math.random() * 40}px)`,
                        }}
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.02, 0.04, 0.02],
                        }}
                        transition={{
                            duration: 10 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            {/* Title - Moved Left */}
            <motion.h1
                className="absolute top-16  text-8xl font-thin text-white tracking-[0.2em] z-10"
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
            >
                ROADMAP
                <motion.div
                    className="h-px bg-white/30 mt-4 w-full"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 1 }}
                />
            </motion.h1>

            {/* Connection Lines SVG - Optimized */}
            <svg className="absolute translate-y-10 translate-x-20 inset-0 w-full h-full z-5" style={{ zIndex: 5 }}>
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
                        <stop offset="50%" stopColor="rgba(255, 255, 255, 0.8)" />
                        <stop offset="100%" stopColor="rgba(255, 255, 255, 0.4)" />
                    </linearGradient>
                </defs>

                {/* Line from Project Node to Current */}
                <motion.line
                    x1="35%"
                    y1="35%"
                    x2="55%"
                    y2="55%"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1.2, duration: 1.5 }}
                />

                {/* Line from Current to CAS */}
                <motion.line
                    x1="55%"
                    y1="55%"
                    x2="75%"
                    y2="40%"
                    stroke="url(#lineGradient)"
                    strokeWidth="2"
                    strokeDasharray="6,6"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 1.8, duration: 1.5 }}
                />

                {/* Single animated particle for efficiency */}
                <motion.circle
                    r="2"
                    fill="white"
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: [0, 1, 0],
                        cx: ["35%", "55%", "75%"],
                        cy: ["35%", "55%", "40%"],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: 2,
                        ease: "linear",
                    }}
                />
            </svg>

            {/* Project Node - Diamond Shape */}
            <motion.div
                className="absolute z-10 -translate-y-20"
                style={{ left: "35%", top: "35%" }}
                initial={{ opacity: 0, scale: 0, rotate: 45 }}
                animate={{ opacity: 1, scale: 1, rotate: 45 }}
                transition={{ delay: 0.6, duration: 0.8 }}
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 w-48 h-48 bg-white opacity-5 rounded-lg blur-2xl transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

                {/* Node Content */}
                <div className="relative w-40 h-40 -translate-y-20 bg-black border border-white/20 rounded-lg flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.1)] rotate-[-45deg]">
                    {/* Inner light effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-lg">
                        <motion.div
                            className="absolute w-20 h-60 bg-white/10 blur-md -rotate-45"
                            animate={{
                                left: ["-100%", "200%"],
                                top: ["-100%", "200%"],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 5,
                            }}
                        />
                    </div>

                    <h3 className="text-white text-sm font-bold mb-1">CAS : Project Node</h3>
                    <p className="text-gray-300 text-xs mb-1">Frontend / Designer</p>
                    <span className="text-gray-400 text-xs leading-tight">
            UI / UX Develop
            <br />
            Interaction Design Develop
          </span>
                </div>
            </motion.div>

            {/* Current Node (청룡톤) - Circle */}
            <motion.div
                className="absolute z-10 -translate-y-20"
                style={{ left: "55%", top: "55%" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8, duration: 0.8 }}
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 w-56 h-56 bg-white opacity-5 rounded-full blur-2xl transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

                {/* Node Content */}
                <div className="relative w-44 h-44 bg-black border border-white/30 rounded-full flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                    {/* Inner light effect */}
                    <div className="absolute inset-0 overflow-hidden rounded-full">
                        <motion.div
                            className="absolute w-full h-20 bg-white/10 blur-md"
                            animate={{
                                top: ["-100%", "200%"],
                            }}
                            transition={{
                                duration: 4,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatDelay: 4,
                            }}
                        />
                    </div>

                    <h3 className="text-white text-base font-bold mb-2">청룡톤</h3>
                    <p className="text-gray-300 text-sm">Frontend / Designer</p>

                    {/* Subtle pulsing ring */}
                    <motion.div
                        className="absolute inset-0 rounded-full border border-white/10"
                        animate={{ scale: [1, 1.05, 1], opacity: [0.2, 0.4, 0.2] }}
                        transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                    />
                </div>
            </motion.div>

            {/* CAS Node - Diamond with Rotation */}
            <motion.div
                className="absolute z-10 -translate-y-20"
                style={{ left: "75%", top: "40%" }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.0, duration: 0.8 }}
            >
                {/* Glow Effect */}
                <div className="absolute inset-0 w-64 h-64 bg-white opacity-5 blur-3xl transform -translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2" />

                {/* Node Content */}
                <div className="relative">
                    {/* Diamond shape using two squares */}
                    <div className="w-48 h-48 relative">
                        <div className="absolute inset-0 bg-black border border-white/30 rotate-45 shadow-[0_0_25px_rgba(255,255,255,0.1)]" />
                        <div className="absolute inset-4 bg-black border border-white/20 rotate-45 backdrop-blur-sm" />

                        {/* Inner light effect */}
                        <div className="absolute inset-4 overflow-hidden rotate-45">
                            <motion.div
                                className="absolute w-20 h-80 bg-white/15 blur-md -rotate-45"
                                animate={{
                                    left: ["-100%", "200%"],
                                    top: ["-100%", "200%"],
                                }}
                                transition={{
                                    duration: 2.5,
                                    repeat: Number.POSITIVE_INFINITY,
                                    repeatDelay: 3,
                                }}
                            />
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <h3 className="text-white text-lg font-bold mb-2">CAS</h3>
                            <p className="text-gray-300 text-sm mb-1">Beginner Team</p>
                            <span className="text-gray-400 text-xs">Web Development Coach</span>
                        </div>

                        {/* Rotating corner accents */}
                        <motion.div
                            className="absolute w-2 h-2 bg-white/50 rounded-full"
                            style={{ top: "-4px", left: "50%", transform: "translateX(-50%)" }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                        />
                        <motion.div
                            className="absolute w-2 h-2 bg-white/50 rounded-full"
                            style={{ bottom: "-4px", left: "50%", transform: "translateX(-50%)" }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
                        />
                        <motion.div
                            className="absolute w-2 h-2 bg-white/50 rounded-full"
                            style={{ left: "-4px", top: "50%", transform: "translateY(-50%)" }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
                        />
                        <motion.div
                            className="absolute w-2 h-2 bg-white/50 rounded-full"
                            style={{ right: "-4px", top: "50%", transform: "translateY(-50%)" }}
                            animate={{ opacity: [0.3, 1, 0.3] }}
                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1.5 }}
                        />
                    </div>
                </div>
            </motion.div>

            {/* Explanation Text - Moved to Middle/Left */}
            <motion.div
                className="absolute bottom-4 left-[40%] transform -translate-x-1/2 text-center z-10 max-w-xl"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.0, duration: 0.8 }}
            >
                <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-lg p-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                    <p className="text-xl mb-4 font-light text-white">Front-End Developer in CAS</p>
                    <p className="text-base leading-relaxed text-gray-300">
                        I mainly work on UI/UX designs and front-end developing, and this is my roadmap. Not fancy for now but there will be more in the future.
                    </p>
                </div>
            </motion.div>

            {/* Minimal Floating Particles - Optimized */}
            <div className="absolute inset-0 pointer-events-none">
                {Array.from({ length: 8 }).map((_, i) => (
                    <motion.div
                        key={`particle-${i}`}
                        className="absolute"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            opacity: [0.2, 0.5, 0.2],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            repeat: Number.POSITIVE_INFINITY,
                            delay: Math.random() * 2,
                        }}
                    >
                        <div className={`${i % 2 === 0 ? "w-1.5 h-1.5 rounded-full" : "w-2 h-2 rotate-45"} bg-white/30`} />
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default RoadmapPage
