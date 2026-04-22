import { useCallback, useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

type DeckItem = {
    id: string
    title: string
    subtitle: string
    url: string
    src: string
    type: "video" | "image"
}

const DECK: DeckItem[] = [
    {
        id: "resume-draft",
        title: "AI Resume Master",
        subtitle: "Draft generator",
        url: "ai-resume-master / draft",
        src: "/media/resume_1.gif",
        type: "image",
    },
    {
        id: "v0-graph",
        title: "v0-linker",
        subtitle: "Graph generation",
        url: "v0-linker / graph",
        src: "/media/v0_graph.mp4",
        type: "video",
    },
    {
        id: "resume-template",
        title: "AI Resume Master",
        subtitle: "Template fill",
        url: "ai-resume-master / template",
        src: "/media/resume_2.gif",
        type: "image",
    },
    {
        id: "v0-analysis",
        title: "v0-linker",
        subtitle: "Analysis report",
        url: "v0-linker / analysis",
        src: "/media/v0_analysis.mp4",
        type: "video",
    },
    {
        id: "resume-export",
        title: "AI Resume Master",
        subtitle: "Export flow",
        url: "ai-resume-master / export",
        src: "/media/resume_3.gif",
        type: "image",
    },
]

const SHUFFLE_INTERVAL_MS = 6000

const Chrome = ({
    url,
    onSkip,
}: {
    url: string
    onSkip?: () => void
}) => (
    <div className="flex items-center gap-2 h-7 px-3 bg-ink-800/95 border-b border-white/10">
        <div className="flex gap-1.5">
            <button
                type="button"
                onClick={onSkip}
                disabled={!onSkip}
                aria-label="Skip to next project"
                className="group relative w-2.5 h-2.5 rounded-full bg-[#ff5f57] hover:scale-110 transition-transform disabled:pointer-events-none"
            >
                <span className="absolute inset-0 flex items-center justify-center font-mono text-[7px] text-black/60 opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                    ×
                </span>
            </button>
            <span className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex justify-center">
            <div className="px-3 py-0.5 rounded-sm bg-ink-900/80 border border-white/5 font-mono text-[10px] text-fog-400 tracking-wide truncate max-w-[220px]">
                {url}
            </div>
        </div>
        <div className="w-[42px]" aria-hidden />
    </div>
)

const ProjectDeck = () => {
    const [order, setOrder] = useState<number[]>(() => DECK.map((_, i) => i))
    const [shuffleTick, setShuffleTick] = useState(0)
    const [showTip, setShowTip] = useState(true)

    const shuffle = useCallback(() => {
        setOrder((prev) => [...prev.slice(1), prev[0]])
        setShuffleTick((t) => t + 1)
    }, [])

    const handleUserSkip = useCallback(() => {
        shuffle()
        setShowTip(false)
    }, [shuffle])

    useEffect(() => {
        const t = window.setTimeout(shuffle, SHUFFLE_INTERVAL_MS)
        return () => window.clearTimeout(t)
    }, [shuffleTick, shuffle])

    const visible = order.slice(0, 3)

    return (
        <div className="relative w-80 h-96">
            <AnimatePresence>
                {showTip && (
                    <motion.button
                        key="skip-tooltip"
                        type="button"
                        onClick={() => setShowTip(false)}
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6, transition: { duration: 0.25 } }}
                        transition={{ duration: 0.4, delay: 1.0 }}
                        className="absolute -top-8 left-0 z-30 cursor-pointer"
                    >
                        <motion.div
                            animate={{ y: [0, -3, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="relative left-7 top-6 px-4 py-1.5 bg-fog-200 text-ink-950 rounded-md font-mono text-[10px] tracking-wider uppercase shadow-[0_8px_24px_-8px_rgba(0,0,0,0.6)]"
                        >
                            press to skip!
                            <span
                                aria-hidden
                                className="absolute -bottom-1 left-3 w-2 h-2 bg-fog-200 rotate-45"
                            />
                        </motion.div>
                    </motion.button>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {visible.map((idx, pos) => {
                    const item = DECK[idx]
                    const depth = 2 - pos
                    const offset = depth * 14
                    const opacity = pos === 0 ? 1 : pos === 1 ? 0.55 : 0.25
                    const borderOpacity = pos === 0 ? 0.3 : pos === 1 ? 0.15 : 0.08
                    const isFront = pos === 0

                    return (
                        <motion.div
                            key={item.id}
                            initial={{
                                x: offset + 60,
                                y: offset + 60,
                                opacity: 0,
                                rotate: 6,
                            }}
                            animate={{
                                x: offset,
                                y: offset,
                                opacity,
                                rotate: 0,
                                zIndex: 10 - pos,
                            }}
                            exit={{
                                x: -120,
                                y: -40,
                                opacity: 0,
                                rotate: -8,
                                transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] },
                            }}
                            transition={{
                                type: "spring",
                                stiffness: 140,
                                damping: 22,
                            }}
                            style={{
                                border: `1px solid rgba(255,255,255,${borderOpacity})`,
                                boxShadow: isFront
                                    ? "0 30px 60px -20px rgba(0,0,0,0.7)"
                                    : "none",
                                pointerEvents: isFront ? "auto" : "none",
                            }}
                            className="absolute inset-0 overflow-hidden bg-ink-900 rounded-md flex flex-col"
                        >
                            <Chrome url={item.url} onSkip={isFront ? handleUserSkip : undefined} />

                            <div className="relative flex-1 overflow-hidden">
                                {item.type === "video" ? (
                                    <video
                                        src={item.src}
                                        autoPlay
                                        muted
                                        loop
                                        playsInline
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <img
                                        src={item.src}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                )}

                                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent pointer-events-none" />

                                <div className="absolute top-3 left-3 font-mono text-[10px] text-fog-300/80 tracking-wider">
                                    {String(idx + 1).padStart(2, "0")} / {DECK.length}
                                </div>

                                <div className="absolute bottom-4 left-4 right-4">
                                    <div className="font-mono text-[10px] text-fog-500 tracking-widest uppercase mb-1">
                                        {item.subtitle}
                                    </div>
                                    <div className="text-base font-light text-fog-200 leading-tight">
                                        {item.title}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )
                })}
            </AnimatePresence>
        </div>
    )
}

export default ProjectDeck
