import { useState } from "react"
import {
    motion,
    useMotionValueEvent,
    useTransform,
    type MotionValue,
} from "framer-motion"

const START = 8.2
const END = 1.9

interface EfficiencyCardProps {
    progress: MotionValue<number>
}

const EfficiencyCard = ({ progress }: EfficiencyCardProps) => {
    const valueMV = useTransform(progress, [0, 1], [START, END])
    const [display, setDisplay] = useState(START)
    const [barWidth, setBarWidth] = useState(100)

    useMotionValueEvent(valueMV, "change", (v) => {
        setDisplay(Math.round(v * 10) / 10)
        setBarWidth(((v - END) / (START - END)) * (100 - 23) + 23)
    })

    const reduction = Math.round(((START - display) / START) * 100)

    return (
        <div className="border border-white/10 rounded-md p-5 bg-ink-900/40 backdrop-blur-sm flex flex-col gap-3">
            <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] uppercase tracking-widest text-fog-500">
                    efficiency
                </div>
                <div className="font-mono text-[9px] text-fog-500/60">01</div>
            </div>

            <div className="flex-1 flex flex-col justify-center gap-4">
                <div className="flex items-end justify-between font-mono">
                    <span className="text-3xl text-fog-200 tabular-nums tracking-tight">
                        {display.toFixed(1)}
                        <span className="text-sm text-fog-500 ml-1">GB</span>
                    </span>
                    <span className="text-[10px] text-emerald-400">
                        -{reduction}%
                    </span>
                </div>

                <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="absolute inset-y-0 left-0 bg-fog-300 rounded-full"
                        style={{ width: `${barWidth}%` }}
                        transition={{ duration: 0.2 }}
                    />
                </div>

                <div className="flex justify-between font-mono text-[9px] text-fog-500">
                    <span>after: {END.toFixed(1)} GB</span>
                    <span>before: {START.toFixed(1)} GB</span>
                </div>
            </div>

            <div className="font-mono text-[10px] text-fog-400 leading-relaxed">
                same output,
                <br />
                smaller footprint.
            </div>
        </div>
    )
}

export default EfficiencyCard
