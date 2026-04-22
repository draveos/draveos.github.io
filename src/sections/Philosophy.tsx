import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import AlgorithmPopup from "./philosophy/AlgorithmPopup"
import { ALGORITHMS } from "./philosophy/algorithms"
import TerminalVisible from "./philosophy/TerminalVisible"

const NOISE_SVG =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.82' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")"

const LETTERS = [
    { char: "α", ascii: "a" },
    { char: "β", ascii: "b" },
    { char: "σ", ascii: "s" },
    { char: "τ", ascii: "t" },
    { char: "ρ", ascii: "r" },
    { char: "α", ascii: "a" },
    { char: "ε", ascii: "c" },
    { char: "τ", ascii: "t" },
]

const POPUP_POS: { left: string; top: string }[] = [
    { left: "5%", top: "38%" },
    { left: "2%", top: "58%" },
    { left: "7%", top: "78%" },
    { left: "23%", top: "90%" },
    { left: "71%", top: "90%" },
    { left: "83%", top: "78%" },
    { left: "86%", top: "58%" },
    { left: "89%", top: "38%" },
]

const POPUP_FLOAT = [
    { delay: 0.2, duration: 5.2, amp: 6 },
    { delay: 0.9, duration: 6.1, amp: 8 },
    { delay: 0.5, duration: 5.6, amp: 5 },
    { delay: 1.3, duration: 6.4, amp: 7 },
    { delay: 0.3, duration: 5.8, amp: 6 },
    { delay: 1.1, duration: 6.2, amp: 8 },
    { delay: 0.7, duration: 5.4, amp: 5 },
    { delay: 1.5, duration: 6.0, amp: 7 },
]

type Line = { x1: number; y1: number; x2: number; y2: number }

const Philosophy = () => {
    const ref = useRef<HTMLElement>(null)
    const stageRef = useRef<HTMLDivElement>(null)
    const letterRefs = useRef<(HTMLSpanElement | null)[]>([])
    const popupRefs = useRef<(HTMLDivElement | null)[]>([])

    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const sMouseX = useSpring(mouseX, { stiffness: 80, damping: 22 })
    const sMouseY = useSpring(mouseY, { stiffness: 80, damping: 22 })

    const [lines, setLines] = useState<Line[]>([])

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const rect = ref.current?.getBoundingClientRect()
            if (!rect) return
            const x =
                (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
            const y =
                (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
            mouseX.set(Math.max(-1, Math.min(1, x)))
            mouseY.set(Math.max(-1, Math.min(1, y)))
        }
        window.addEventListener("mousemove", onMove)
        return () => window.removeEventListener("mousemove", onMove)
    }, [mouseX, mouseY])

    useLayoutEffect(() => {
        const measure = () => {
            const stage = stageRef.current
            if (!stage) return
            const sRect = stage.getBoundingClientRect()
            const out: Line[] = []
            for (let i = 0; i < LETTERS.length; i++) {
                const letterEl = letterRefs.current[i]
                const popupEl = popupRefs.current[i]
                if (!letterEl || !popupEl) continue
                const lRect = letterEl.getBoundingClientRect()
                const pRect = popupEl.getBoundingClientRect()
                const x1 = lRect.left - sRect.left + lRect.width / 2
                const y1 = lRect.top - sRect.top + lRect.height * 0.9
                const popupCenterX = pRect.left - sRect.left + pRect.width / 2
                const popupEdgeY =
                    popupCenterX > x1
                        ? pRect.top - sRect.top
                        : pRect.top - sRect.top
                const x2 = popupCenterX
                const y2 = popupEdgeY
                out.push({ x1, y1, x2, y2 })
            }
            setLines(out)
        }

        measure()
        const ro = new ResizeObserver(measure)
        if (stageRef.current) ro.observe(stageRef.current)
        window.addEventListener("resize", measure)
        const t = window.setTimeout(measure, 500)
        return () => {
            ro.disconnect()
            window.removeEventListener("resize", measure)
            window.clearTimeout(t)
        }
    }, [])

    return (
        <section
            ref={ref}
            className="relative py-32 lg:py-40 overflow-hidden"
        >
            <h2 className="sr-only">Make the abstract visible.</h2>

            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay"
                style={{ backgroundImage: NOISE_SVG }}
            />

            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none"
                style={{
                    background:
                        "radial-gradient(ellipse 50% 60% at 50% 50%, rgba(255,255,255,0.06) 0%, transparent 70%)",
                }}
            />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-10 lg:px-20">
                <div className="flex items-center gap-4 mb-20">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog-500">
                        № 04 / pensée
                    </span>
                    <span className="flex-1 h-px bg-fog-500/25" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog-500/70">
                        sjk · 2026
                    </span>
                </div>

                <div
                    ref={stageRef}
                    className="relative min-h-[820px] lg:min-h-[780px]"
                >
                    <svg
                        className="absolute inset-0 w-full h-full pointer-events-none z-0"
                        style={{ overflow: "visible" }}
                    >
                        {lines.map((l, i) => (
                            <motion.line
                                key={i}
                                x1={l.x1}
                                y1={l.y1}
                                x2={l.x2}
                                y2={l.y2}
                                stroke="rgba(229,229,229,0.18)"
                                strokeWidth="0.6"
                                strokeDasharray="2 3"
                                initial={{ pathLength: 0, opacity: 0 }}
                                whileInView={{ pathLength: 1, opacity: 1 }}
                                viewport={{ once: true, margin: "-15%" }}
                                transition={{
                                    duration: 1.0,
                                    delay: 0.6 + i * 0.08,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                            />
                        ))}
                    </svg>

                    <div className="relative z-10 flex flex-wrap items-baseline gap-x-4 mb-6">
                        <motion.span
                            initial={{ opacity: 0, y: 18 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-15%" }}
                            transition={{
                                duration: 0.9,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="font-display text-[clamp(1.5rem,3.5vw,2.5rem)] text-fog-500"
                            style={{
                                fontVariationSettings:
                                    '"wght" 320, "opsz" 144, "SOFT" 60, "ital" 0',
                            }}
                        >
                            Make the
                        </motion.span>

                        <div
                            className="font-display text-[clamp(2.5rem,7vw,5.5rem)] text-fog-200 flex items-baseline gap-x-[0.05em]"
                            style={{
                                fontVariationSettings:
                                    '"wght" 420, "opsz" 144, "SOFT" 60, "ital" 1',
                            }}
                        >
                            {LETTERS.map((l, i) => (
                                <motion.span
                                    key={i}
                                    ref={(el) => {
                                        letterRefs.current[i] = el
                                    }}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-15%" }}
                                    transition={{
                                        duration: 0.7,
                                        delay: 0.15 + i * 0.06,
                                        ease: [0.22, 1, 0.36, 1],
                                    }}
                                    className="relative inline-block leading-none"
                                    title={l.ascii}
                                >
                                    {l.char}
                                    <span
                                        className="absolute top-full left-1/2 -translate-x-1/2 mt-2 font-mono text-[12px] text-fog-300/80 tracking-[0.18em] lowercase"
                                        style={{
                                            fontVariationSettings: "normal",
                                            fontStyle: "normal",
                                        }}
                                        aria-hidden
                                    >
                                        {l.ascii}
                                    </span>
                                </motion.span>
                            ))}
                        </div>
                    </div>

                    <div
                        className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 w-[min(640px,64vw)]"
                        style={{ perspective: 1500 }}
                    >
                        <TerminalVisible mouseX={sMouseX} mouseY={sMouseY} />
                    </div>

                    {ALGORITHMS.map((a, i) => {
                        const pos = POPUP_POS[i]
                        const f = POPUP_FLOAT[i]
                        return (
                            <AlgorithmPopup
                                key={a.id}
                                ref={(el) => {
                                    popupRefs.current[i] = el
                                }}
                                label={a.label}
                                name={a.name}
                                Component={a.Component}
                                floatDelay={f.delay}
                                floatDuration={f.duration}
                                floatAmplitude={f.amp}
                                entryDelay={1.2 + i * 0.1}
                                style={{ left: pos.left, top: pos.top }}
                            />
                        )
                    })}
                </div>

                <motion.div
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileInView={{ opacity: 1, scaleX: 1 }}
                    viewport={{ once: true, margin: "-15%" }}
                    transition={{
                        duration: 1.1,
                        delay: 2.2,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                    className="mt-16 flex items-center gap-3 font-mono text-[9px] text-fog-500/70"
                    style={{ transformOrigin: "center" }}
                >
                    <span>├</span>
                    <span className="flex-1 border-t border-dotted border-fog-500/40" />
                    <span className="uppercase tracking-[0.22em]">
                        meaning · form · shared
                    </span>
                    <span className="flex-1 border-t border-dotted border-fog-500/40" />
                    <span>┤</span>
                </motion.div>
            </div>
        </section>
    )
}

export default Philosophy
