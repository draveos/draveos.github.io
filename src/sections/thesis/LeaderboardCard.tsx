import { useState } from "react"
import {
    motion,
    useMotionValueEvent,
    type MotionValue,
    useTransform,
} from "framer-motion"

type Row = {
    id: string
    name: string
    score: number
}

const STATIC_ROWS: Row[] = [
    { id: "zlzone", name: "extra-E", score: 0.64701 },
    { id: "cvlab", name: "CVLab-ACE", score: 0.64521 },
    { id: "hide", name: "hide-your-code", score: 0.64127 },
    { id: "gnat", name: "lucky-gnat", score: 0.63981 },
    { id: "caffeine", name: "caffeine-overflow", score: 0.63705 },
    { id: "null", name: "TEAM_NULL", score: 0.63416 },
]

interface LeaderboardCardProps {
    progress: MotionValue<number>
}

const LeaderboardCard = ({ progress }: LeaderboardCardProps) => {
    const oursMV = useTransform(progress, [0, 1], [0.62910, 0.64792])
    const [oursScore, setOursScore] = useState(0.62910)

    useMotionValueEvent(oursMV, "change", (v) => {
        setOursScore(Math.round(v * 100000) / 100000)
    })

    const rows: Row[] = [
        ...STATIC_ROWS,
        { id: "ours", name: "draveos", score: oursScore },
    ]
    const sorted = [...rows].sort((a, b) => b.score - a.score)

    return (
        <div className="border border-white/10 rounded-md p-5 bg-ink-900/40 backdrop-blur-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest text-fog-500">
                    performance
                </div>
                <div className="font-mono text-[9px] text-fog-500/60">02</div>
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between font-mono text-[9px] text-fog-500/70 pb-1 border-b border-white/5">
                    <span className="w-6">#</span>
                    <span className="flex-1">model</span>
                    <span>score</span>
                </div>
                {sorted.map((row, idx) => {
                    const isOurs = row.id === "ours"
                    return (
                        <motion.div
                            key={row.id}
                            layout
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 32,
                            }}
                            className={`flex items-center justify-between font-mono text-[11px] px-2 py-1 rounded-sm ${
                                isOurs
                                    ? "bg-white/10 text-fog-200"
                                    : "text-fog-400"
                            }`}
                        >
                            <span className="w-6 text-fog-500">
                                {String(idx + 1).padStart(2, "0")}
                            </span>
                            <span className="flex-1 truncate">
                                {row.name}
                                {isOurs && (
                                    <span className="ml-1 text-emerald-400">●</span>
                                )}
                            </span>
                            <span
                                className={
                                    isOurs ? "text-fog-100 tabular-nums" : "tabular-nums"
                                }
                            >
                                {row.score.toFixed(5)}
                            </span>
                        </motion.div>
                    )
                })}
            </div>

            <div className="font-mono text-[10px] text-fog-400 leading-relaxed">
                every point earned,
                <br />
                not borrowed.
            </div>
        </div>
    )
}

export default LeaderboardCard
