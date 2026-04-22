import { forwardRef, type ComponentType } from "react"
import { motion } from "framer-motion"

interface AlgorithmPopupProps {
    label: string
    name: string
    Component: ComponentType
    floatDelay: number
    floatDuration: number
    floatAmplitude: number
    entryDelay: number
    style?: React.CSSProperties
}

const AlgorithmPopup = forwardRef<HTMLDivElement, AlgorithmPopupProps>(
    (
        {
            label,
            name,
            Component,
            floatDelay,
            floatDuration,
            floatAmplitude,
            entryDelay,
            style,
        },
        ref
    ) => {
        return (
            <motion.div
                ref={ref}
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: false, margin: "-20%" }}
                transition={{
                    duration: 0.7,
                    delay: entryDelay,
                    ease: [0.22, 1, 0.36, 1],
                }}
                className="absolute"
                style={style}
            >
                <motion.div
                    animate={{
                        y: [0, -floatAmplitude, 0, floatAmplitude * 0.6, 0],
                    }}
                    transition={{
                        duration: floatDuration,
                        delay: floatDelay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    className="w-[118px] border border-white/15 rounded-md bg-ink-900/70 backdrop-blur-sm overflow-hidden shadow-[0_12px_32px_-12px_rgba(0,0,0,0.6)]"
                >
                    <div className="flex items-center justify-between px-2 py-1 border-b border-white/10 bg-ink-800/60">
                        <span className="font-mono text-[9px] text-fog-200 tracking-wide">
                            {label}
                        </span>
                        <span className="font-mono text-[8px] text-fog-500 uppercase tracking-widest">
                            {name}
                        </span>
                    </div>
                    <div className="h-14 px-1 py-1">
                        <Component />
                    </div>
                </motion.div>
            </motion.div>
        )
    }
)

AlgorithmPopup.displayName = "AlgorithmPopup"

export default AlgorithmPopup
