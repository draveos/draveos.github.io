import { useEffect, useState } from "react"
import { motion } from "framer-motion"

type Line = {
    text: string
    delay: number
    typeSpeed: number
    done?: string
}

const LINES: Line[] = [
    { text: "$ portfolio init", delay: 0, typeSpeed: 18 },
    { text: "→ loading profile", delay: 250, typeSpeed: 14, done: "ok" },
    { text: "→ resolving projects", delay: 550, typeSpeed: 14, done: "ok" },
    { text: "→ compiling sections", delay: 900, typeSpeed: 14, done: "ok" },
    { text: "→ complete", delay: 1300, typeSpeed: 18, done: "✓" },
]

interface BootLoaderProps {
    onDone: () => void
}

const BootLoader = ({ onDone }: BootLoaderProps) => {
    const [rendered, setRendered] = useState<string[]>([])
    const [dones, setDones] = useState<(string | undefined)[]>([])

    useEffect(() => {
        const timers: number[] = []
        LINES.forEach((line, idx) => {
            const startAt = line.delay
            for (let i = 1; i <= line.text.length; i++) {
                const t = window.setTimeout(() => {
                    setRendered((prev) => {
                        const next = [...prev]
                        next[idx] = line.text.slice(0, i)
                        return next
                    })
                }, startAt + i * line.typeSpeed)
                timers.push(t)
            }
            if (line.done) {
                const doneAt = startAt + line.text.length * line.typeSpeed + 120
                const t = window.setTimeout(() => {
                    setDones((prev) => {
                        const next = [...prev]
                        next[idx] = line.done
                        return next
                    })
                }, doneAt)
                timers.push(t)
            }
        })

        const exitAt = 2000
        const exitTimer = window.setTimeout(() => onDone(), exitAt)
        timers.push(exitTimer)

        return () => timers.forEach((t) => window.clearTimeout(t))
    }, [onDone])

    return (
        <motion.div
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-[100] bg-ink-950 flex items-center justify-center"
        >
            <div className="font-mono text-xs md:text-sm text-fog-300 leading-relaxed w-[min(560px,90vw)]">
                <div className="mb-4 text-fog-500 tracking-widest uppercase text-[10px]">
                    sjk / boot
                </div>
                {LINES.map((line, idx) => {
                    const isFinal = idx === LINES.length - 1
                    const isDone = dones[idx] === "✓"
                    return (
                        <div
                            key={idx}
                            className={`flex items-center gap-2 ${
                                isFinal && isDone ? "text-emerald-400" : ""
                            }`}
                        >
                            <span>{rendered[idx] ?? ""}</span>
                            {rendered[idx]?.length === line.text.length && line.done && (
                                <>
                                    <span
                                        className={`flex-1 border-b border-dotted mx-2 ${
                                            isFinal && isDone
                                                ? "border-emerald-400/40"
                                                : "border-fog-500/40"
                                        }`}
                                    />
                                    <span
                                        className={
                                            isDone ? "text-emerald-400" : "text-fog-500"
                                        }
                                    >
                                        {dones[idx] ?? ""}
                                    </span>
                                </>
                            )}
                            {isFinal &&
                                rendered[idx]?.length === line.text.length &&
                                !dones[idx] && <span className="animate-pulse">▍</span>}
                        </div>
                    )
                })}
            </div>
        </motion.div>
    )
}

export default BootLoader
