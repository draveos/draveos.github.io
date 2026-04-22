import { motion, useTransform, type MotionValue } from "framer-motion"

type LetterDef = {
    body: string
    middle?: string
    dot?: boolean
    points: [number, number][]
}

const LETTER_PATHS: Record<string, LetterDef> = {
    v: {
        body: "M 0 0 L 4 12 L 8 0",
        points: [[0, 0], [4, 12], [8, 0]],
    },
    i: {
        body: "M 4 0 L 4 12",
        dot: true,
        points: [[4, 0], [4, 12]],
    },
    s: {
        body: "M 8 1 L 0 1 L 0 6 L 8 6 L 8 11 L 0 11",
        points: [[8, 1], [0, 1], [0, 6], [8, 6], [8, 11], [0, 11]],
    },
    b: {
        body: "M 0 -4 L 0 12 L 8 12 L 8 6 L 0 6",
        points: [[0, -4], [0, 12], [8, 12], [8, 6], [0, 6]],
    },
    l: {
        body: "M 0 -4 L 0 12",
        points: [[0, -4], [0, 12]],
    },
    e: {
        body: "M 8 1 L 0 1 L 0 11 L 8 11",
        middle: "M 0 6 L 6 6",
        points: [[8, 1], [0, 1], [0, 11], [8, 11], [0, 6], [6, 6]],
    },
}

const LETTER_WIDTH = 10
const LETTER_GAP = 3

interface TerminalVisibleProps {
    mouseX: MotionValue<number>
    mouseY: MotionValue<number>
}

const TerminalVisible = ({ mouseX, mouseY }: TerminalVisibleProps) => {
    const rotX = useTransform(mouseY, [-1, 1], [2, -2])
    const rotY = useTransform(mouseX, [-1, 1], [-3, 3])

    const letters = "visible".split("")
    const positions = letters.map((ch, i) => ({
        char: ch,
        x: i * (LETTER_WIDTH + LETTER_GAP),
        delay: 0.6 + i * 0.32,
    }))
    const wordWidth =
        (letters.length - 1) * (LETTER_WIDTH + LETTER_GAP) + LETTER_WIDTH
    const periodX = wordWidth + 3
    const periodDelay = 0.6 + letters.length * 0.32

    return (
        <motion.div
            className="w-full max-w-[640px] mx-auto"
            style={{
                rotateX: rotX,
                rotateY: rotY,
                transformStyle: "preserve-3d",
            }}
        >
            <div className="border border-white/20 rounded-md bg-ink-900/85 backdrop-blur-sm overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.7)]">
                <div className="flex items-center gap-2 h-8 px-4 bg-ink-800/95 border-b border-white/10">
                    <div className="flex gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="flex-1 flex justify-center">
                        <span className="font-mono text-[10px] text-fog-400 tracking-wide">
                            matplotlib :: render_visible
                        </span>
                    </div>
                    <div className="w-[42px]" />
                </div>

                <div className="relative px-6 py-6 bg-ink-950/85">
                    <div
                        aria-hidden
                        className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{
                            backgroundImage:
                                "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                            backgroundSize: "28px 28px",
                        }}
                    />

                    <svg
                        viewBox={`-7 -8 ${wordWidth + 18} 28`}
                        className="w-full h-auto relative"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ maxHeight: 200 }}
                    >
                        <line
                            x1="-5"
                            y1="13"
                            x2={wordWidth + 6}
                            y2="13"
                            stroke="rgba(255,255,255,0.18)"
                            strokeWidth="0.12"
                        />
                        <line
                            x1="-5"
                            y1="-7"
                            x2="-5"
                            y2="13"
                            stroke="rgba(255,255,255,0.18)"
                            strokeWidth="0.12"
                        />

                        {[-6, 0, 6, 12].map((t) => (
                            <line
                                key={t}
                                x1="-5.6"
                                y1={t}
                                x2="-5"
                                y2={t}
                                stroke="rgba(255,255,255,0.25)"
                                strokeWidth="0.12"
                            />
                        ))}

                        <text
                            x="-5.8"
                            y="-5.5"
                            fontSize="1.5"
                            fill="rgba(163,163,163,0.45)"
                            fontFamily="monospace"
                            textAnchor="end"
                        >
                            y
                        </text>
                        <text
                            x={wordWidth + 5.5}
                            y="13.5"
                            fontSize="1.5"
                            fill="rgba(163,163,163,0.45)"
                            fontFamily="monospace"
                            textAnchor="end"
                        >
                            x
                        </text>

                        {positions.map((p, i) => {
                            const L = LETTER_PATHS[p.char]
                            if (!L) return null
                            return (
                                <g key={i} transform={`translate(${p.x}, 0)`}>
                                    <motion.path
                                        d={L.body}
                                        fill="none"
                                        stroke="white"
                                        strokeWidth="0.45"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        initial={{ pathLength: 0 }}
                                        whileInView={{ pathLength: 1 }}
                                        viewport={{ once: false, margin: "-15%" }}
                                        transition={{
                                            duration: 0.85,
                                            delay: p.delay,
                                            ease: [0.4, 0, 0.2, 1],
                                        }}
                                    />
                                    {L.middle && (
                                        <motion.path
                                            d={L.middle}
                                            fill="none"
                                            stroke="white"
                                            strokeWidth="0.45"
                                            strokeLinecap="round"
                                            initial={{ pathLength: 0 }}
                                            whileInView={{ pathLength: 1 }}
                                            viewport={{
                                                once: false,
                                                margin: "-15%",
                                            }}
                                            transition={{
                                                duration: 0.35,
                                                delay: p.delay + 0.55,
                                                ease: [0.4, 0, 0.2, 1],
                                            }}
                                        />
                                    )}
                                    {L.dot && (
                                        <motion.circle
                                            cx="4"
                                            cy="-3.5"
                                            r="0.65"
                                            fill="white"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{
                                                scale: 1,
                                                opacity: 1,
                                            }}
                                            viewport={{
                                                once: false,
                                                margin: "-15%",
                                            }}
                                            transition={{
                                                duration: 0.3,
                                                delay: p.delay + 0.75,
                                                ease: [0.34, 1.56, 0.64, 1],
                                            }}
                                        />
                                    )}
                                    {L.points.map((pt, j) => (
                                        <motion.circle
                                            key={j}
                                            cx={pt[0]}
                                            cy={pt[1]}
                                            r="0.45"
                                            fill="rgba(229,229,229,1)"
                                            stroke="rgba(10,10,10,1)"
                                            strokeWidth="0.12"
                                            initial={{ scale: 0, opacity: 0 }}
                                            whileInView={{
                                                scale: 1,
                                                opacity: 1,
                                            }}
                                            viewport={{
                                                once: false,
                                                margin: "-15%",
                                            }}
                                            transition={{
                                                duration: 0.25,
                                                delay:
                                                    p.delay + 0.1 + j * 0.05,
                                                ease: [0.34, 1.56, 0.64, 1],
                                            }}
                                        />
                                    ))}
                                </g>
                            )
                        })}

                        <motion.circle
                            cx={periodX}
                            cy="11"
                            r="0.9"
                            fill="white"
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: false, margin: "-15%" }}
                            transition={{
                                duration: 0.5,
                                delay: periodDelay + 0.3,
                                ease: [0.34, 1.56, 0.64, 1],
                            }}
                        />
                    </svg>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: false, margin: "-15%" }}
                        transition={{ duration: 0.5, delay: periodDelay + 0.8 }}
                        className="mt-5 font-mono text-[10px] text-fog-500 flex items-center gap-2 relative"
                    >
                        <span className="text-emerald-400">$</span>
                        <span>python render.py</span>
                        <span className="text-fog-500/60">·</span>
                        <span className="text-emerald-400/80">ok</span>
                        <motion.span
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="inline-block w-1.5 h-[11px] bg-fog-400 ml-0.5 align-middle"
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}

export default TerminalVisible
