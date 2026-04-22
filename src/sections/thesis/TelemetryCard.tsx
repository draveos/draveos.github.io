import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const ENTRIES = [
    { text: "loss=0.412  acc=0.882", kind: "metric" },
    { text: "step=1842   lr=3e-5", kind: "info" },
    { text: "throughput=781 tok/s", kind: "metric" },
    { text: "loss=0.398  acc=0.887", kind: "metric" },
    { text: "p95=24.3ms", kind: "metric" },
    { text: "eval/acc=88.9%", kind: "metric" },
    { text: "step=1867   lr=3e-5", kind: "info" },
    { text: "loss=0.384  acc=0.891", kind: "metric" },
    { text: "mem=1.94 GB", kind: "metric" },
    { text: "grad_norm=0.412", kind: "metric" },
    { text: "throughput=803 tok/s", kind: "metric" },
    { text: "loss=0.371  acc=0.894", kind: "metric" },
    { text: "eval/acc=89.4%", kind: "metric" },
    { text: "step=1891   lr=2.8e-5", kind: "info" },
    { text: "p95=22.1ms", kind: "metric" },
    { text: "loss=0.358  acc=0.898", kind: "metric" },
    { text: "throughput=821 tok/s", kind: "metric" },
    { text: "mem=1.91 GB", kind: "metric" },
    { text: "eval/acc=89.8%", kind: "metric" },
    { text: "loss=0.342  acc=0.902", kind: "metric" },
] as const

const START_SEC = 13 * 3600 + 22 * 60 + 1

const formatTime = (idx: number) => {
    const total = (START_SEC + idx * 3) % (24 * 3600)
    const h = Math.floor(total / 3600)
    const m = Math.floor((total % 3600) / 60)
    const s = total % 60
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
}

type Line = {
    id: number
    text: string
    kind: "metric" | "info"
    time: string
}

const WINDOW = 6
const TICK_MS = 900

const buildLine = (id: number): Line => {
    const entry = ENTRIES[id % ENTRIES.length]
    return { id, text: entry.text, kind: entry.kind, time: formatTime(id) }
}

const TelemetryCard = () => {
    const [lines, setLines] = useState<Line[]>(() =>
        Array.from({ length: WINDOW }, (_, i) => buildLine(i))
    )

    useEffect(() => {
        const interval = window.setInterval(() => {
            setLines((prev) => {
                const nextId = prev[prev.length - 1].id + 1
                return [...prev.slice(1), buildLine(nextId)]
            })
        }, TICK_MS)
        return () => window.clearInterval(interval)
    }, [])

    return (
        <div className="border border-white/10 rounded-md p-5 bg-ink-900/40 backdrop-blur-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest text-fog-500">
                    telemetry
                </div>
                <div className="font-mono text-[9px] text-fog-500/60">03</div>
            </div>

            <div className="relative h-[136px] overflow-hidden">
                <div
                    className="absolute inset-0 pointer-events-none z-10"
                    style={{
                        background:
                            "linear-gradient(to bottom, rgba(10,10,10,0.8) 0%, transparent 18%, transparent 82%, rgba(10,10,10,0.5) 100%)",
                    }}
                />
                <div className="flex flex-col gap-1">
                    <AnimatePresence mode="popLayout">
                        {lines.map((line) => (
                            <motion.div
                                key={line.id}
                                layout
                                initial={{ opacity: 0, y: 14 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -14 }}
                                transition={{
                                    duration: 0.5,
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                                className="flex items-center gap-3 font-mono text-[10px] whitespace-nowrap"
                            >
                                <span className="text-fog-500/60">{line.time}</span>
                                <span
                                    className={
                                        line.kind === "metric"
                                            ? "text-fog-200"
                                            : "text-fog-500"
                                    }
                                >
                                    {line.text}
                                </span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <div className="font-mono text-[10px] text-fog-400 leading-relaxed">
                numbers moving,
                <br />
                work in progress.
            </div>
        </div>
    )
}

export default TelemetryCard
