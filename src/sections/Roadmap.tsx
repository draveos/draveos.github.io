import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import ProjectRow from "./roadmap/ProjectRow"
import { PROJECTS } from "./roadmap/projects"

const N = PROJECTS.length
const LINE_END_PCT = ((N - 0.5) / N) * 100

const Roadmap = () => {
    const sectionRef = useRef<HTMLElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const bulbRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start 70%", "end end"],
    })

    const progressHeight = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", `${LINE_END_PCT}%`]
    )
    const bulbTop = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", `${LINE_END_PCT}%`]
    )
    const bulbOpacity = useTransform(
        scrollYProgress,
        [0, 0.02, 0.98, 1],
        [0, 1, 1, 0]
    )

    return (
        <section ref={sectionRef} className="relative">
            <header className="relative pt-32 pb-20 px-10 lg:px-20 max-w-7xl mx-auto">
                <div className="font-mono text-xs uppercase tracking-widest text-fog-500 mb-4">
                    <span className="inline-block w-8 h-px bg-fog-500 align-middle mr-3" />
                    03 — Roadmap
                </div>
                <h2 className="text-[clamp(2.5rem,6vw,5rem)] leading-[1.05] font-light tracking-tight text-fog-200 max-w-3xl">
                    A trail of{" "}
                    <em className="font-serif italic text-fog-100">small wins</em>,
                    <br />
                    leading somewhere.
                </h2>
                <p className="mt-6 font-mono text-[11px] text-fog-500 tracking-wider uppercase">
                    {N} projects · chronological
                </p>
            </header>

            <div ref={timelineRef} className="relative pb-20">
                <div
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-px bg-white/10 pointer-events-none"
                    style={{ height: `${LINE_END_PCT}%` }}
                />

                <motion.div
                    className="absolute left-1/2 -translate-x-1/2 top-0 w-px pointer-events-none"
                    style={{
                        height: progressHeight,
                        background:
                            "linear-gradient(to bottom, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.6) 70%, #ffffff 100%)",
                        boxShadow:
                            "0 0 4px rgba(255,255,255,0.6), 0 0 10px rgba(255,255,255,0.3)",
                    }}
                />

                <motion.div
                    ref={bulbRef}
                    className="absolute left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white pointer-events-none z-10"
                    style={{
                        top: bulbTop,
                        opacity: bulbOpacity,
                        marginTop: -4,
                    }}
                    animate={{
                        boxShadow: [
                            "0 0 8px rgba(255,255,255,0.7), 0 0 18px rgba(255,255,255,0.35)",
                            "0 0 20px rgba(255,255,255,0.95), 0 0 40px rgba(255,255,255,0.55)",
                            "0 0 8px rgba(255,255,255,0.7), 0 0 18px rgba(255,255,255,0.35)",
                        ],
                    }}
                    transition={{
                        duration: 2.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />

                {PROJECTS.map((p, i) => (
                    <ProjectRow
                        key={p.id}
                        project={p}
                        side={i % 2 === 0 ? "left" : "right"}
                        bulbRef={bulbRef}
                    />
                ))}
            </div>

            <div className="relative flex flex-col items-center pb-32">
                <div className="flex flex-col items-center gap-2">
                    {[0.45, 0.3, 0.18, 0.1].map((base, i) => (
                        <motion.div
                            key={i}
                            className="w-1 h-1 rounded-full bg-white"
                            style={{ opacity: base }}
                            animate={{ opacity: [base, base * 0.4, base] }}
                            transition={{
                                duration: 2.4,
                                delay: i * 0.25,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                    className="mt-8 font-serif italic text-fog-300 text-xl md:text-2xl"
                >
                    and many more.
                </motion.div>
            </div>
        </section>
    )
}

export default Roadmap
