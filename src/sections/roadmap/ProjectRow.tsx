import { useEffect, useRef, useState, type RefObject } from "react"
import { motion } from "framer-motion"
import type { Project } from "./projects"

const STACK_COLORS: Record<string, string> = {
    TypeScript: "#3178c6",
    JavaScript: "#f7df1e",
    React: "#61dafb",
    "Next.js": "#ffffff",
    Vite: "#646cff",
    Python: "#3776ab",
    PyTorch: "#ee4c2c",
    OpenAI: "#10a37f",
    "Three.js": "#e5e5e5",
    Figma: "#a259ff",
    DDQN: "#a78bfa",
    LLM: "#f472b6",
    PyG: "#ee4c2c",
    GNN: "#06b6d4",
    v0: "#ffffff",
}

interface ProjectRowProps {
    project: Project
    side: "left" | "right"
    bulbRef: RefObject<HTMLDivElement | null>
}

const ProjectRow = ({ project, side, bulbRef }: ProjectRowProps) => {
    const markerRef = useRef<HTMLDivElement>(null)
    const [lit, setLit] = useState(false)

    useEffect(() => {
        let raf = 0
        const check = () => {
            const marker = markerRef.current
            const bulb = bulbRef.current
            if (!marker || !bulb) return
            const m = marker.getBoundingClientRect()
            const b = bulb.getBoundingClientRect()
            const mY = m.top + m.height / 2
            const bY = b.top + b.height / 2
            setLit(bY >= mY)
        }
        const onScroll = () => {
            cancelAnimationFrame(raf)
            raf = requestAnimationFrame(check)
        }
        check()
        window.addEventListener("scroll", onScroll, { passive: true })
        window.addEventListener("resize", onScroll)
        return () => {
            cancelAnimationFrame(raf)
            window.removeEventListener("scroll", onScroll)
            window.removeEventListener("resize", onScroll)
        }
    }, [bulbRef])

    const isLeft = side === "left"

    return (
        <div className="relative min-h-[38vh] flex items-center">
            <motion.div
                className="absolute top-1/2 h-px bg-white/30"
                style={{
                    left: isLeft ? "auto" : "50%",
                    right: isLeft ? "50%" : "auto",
                    width: "7%",
                    y: "-50%",
                    transformOrigin: isLeft ? "right center" : "left center",
                }}
                initial={{ opacity: 0.08, scaleX: 0.4 }}
                animate={
                    lit
                        ? { opacity: 0.9, scaleX: 1 }
                        : { opacity: 0.08, scaleX: 0.4 }
                }
                transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
            />

            <div
                className={
                    isLeft
                        ? "w-[45%] pr-[6%]"
                        : "w-[45%] pl-[6%] ml-auto"
                }
            >
                <motion.div
                    initial={{ opacity: 0.12 }}
                    animate={
                        lit
                            ? { opacity: 1 }
                            : { opacity: [1, 0.25, 0.65, 0.12, 0.18, 0.12] }
                    }
                    transition={{
                        duration: lit ? 0.7 : 1.0,
                        ease: lit ? [0.4, 0, 0.2, 1] : "easeOut",
                    }}
                >
                    <div className={isLeft ? "text-right" : "text-left"}>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-fog-500 mb-3">
                            {project.period} · {project.repo}
                        </div>

                        <motion.a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group relative inline-block ${
                                lit ? "pointer-events-auto" : "pointer-events-none"
                            }`}
                            whileHover={
                                lit ? { x: isLeft ? -3 : 3 } : undefined
                            }
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 22,
                            }}
                        >
                            <h3
                                className={`text-2xl md:text-3xl font-light leading-tight transition-colors duration-700 ${
                                    lit
                                        ? "text-fog-100 group-hover:text-white"
                                        : "text-fog-500"
                                }`}
                            >
                                {project.title}
                                <span
                                    className={`inline-block ml-2 align-middle text-[0.7em] transition-all duration-300 ${
                                        lit
                                            ? "opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0"
                                            : "opacity-0"
                                    }`}
                                    aria-hidden
                                >
                                    ↗
                                </span>
                            </h3>
                            <span
                                className={`absolute -bottom-0.5 h-px bg-fog-100/70 transition-[width] duration-500 ease-out ${
                                    isLeft ? "right-0" : "left-0"
                                } ${lit ? "w-0 group-hover:w-full" : "w-0"}`}
                                aria-hidden
                            />
                        </motion.a>

                        <p
                            className={`mt-3 text-sm leading-relaxed transition-colors duration-700 ${
                                lit ? "text-fog-300" : "text-fog-600"
                            }`}
                        >
                            {project.description}
                        </p>

                        <div
                            className={`mt-4 flex flex-wrap gap-1.5 ${
                                isLeft ? "justify-end" : ""
                            }`}
                        >
                            {project.stack.map((s) => {
                                const color = STACK_COLORS[s] ?? "#888888"
                                return (
                                    <span
                                        key={s}
                                        className="inline-flex items-center gap-1.5 px-2 py-0.5 border border-white/10 rounded-sm font-mono text-[9px] text-fog-300 tracking-wide"
                                    >
                                        <span
                                            className="w-1.5 h-1.5 rounded-full shrink-0"
                                            style={{
                                                backgroundColor: color,
                                                boxShadow: lit
                                                    ? `0 0 6px ${color}80`
                                                    : "none",
                                                transition: "box-shadow 0.6s",
                                            }}
                                        />
                                        {s}
                                    </span>
                                )
                            })}
                        </div>

                        {project.media && (
                            <div
                                className={`mt-5 border border-white/10 overflow-hidden rounded-md bg-ink-900 ${
                                    isLeft ? "ml-auto" : ""
                                }`}
                                style={{ maxWidth: 380 }}
                            >
                                {project.media.type === "image" ? (
                                    <img
                                        src={project.media.src}
                                        alt={project.title}
                                        className="w-full block"
                                    />
                                ) : (
                                    <video
                                        src={project.media.src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full block"
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            <motion.div
                ref={markerRef}
                className="absolute top-1/2 left-1/2 z-20"
                style={{ x: "-50%", y: "-50%" }}
                animate={{ scale: lit ? 1.25 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                <motion.div
                    className="w-3 h-3 rounded-full border"
                    animate={{
                        backgroundColor: lit ? "#ffffff" : "#0a0a0a",
                        borderColor: lit
                            ? "rgba(255,255,255,0.9)"
                            : "rgba(255,255,255,0.35)",
                        boxShadow: lit
                            ? "0 0 12px rgba(255,255,255,0.85), 0 0 28px rgba(255,255,255,0.4)"
                            : "0 0 0px rgba(255,255,255,0)",
                    }}
                    transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                />
            </motion.div>
        </div>
    )
}

export default ProjectRow
