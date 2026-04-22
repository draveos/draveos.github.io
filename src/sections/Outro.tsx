import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const STACK_GROUPS = [
    {
        title: "core",
        items: [
            { name: "Python", color: "#3776ab" },
            { name: "PyTorch", color: "#ee4c2c" },
            { name: "scikit-learn", color: "#f7931e" },
        ],
    },
    {
        title: "frontend",
        items: [
            { name: "TypeScript", color: "#3178c6" },
            { name: "React", color: "#61dafb" },
            { name: "Vite", color: "#646cff" },
            { name: "Tailwind", color: "#06b6d4" },
        ],
    },
    {
        title: "data",
        items: [
            { name: "Pandas", color: "#e70488" },
            { name: "NumPy", color: "#4d77cf" },
            { name: "Matplotlib", color: "#11557c" },
            { name: "MySQL", color: "#4479a1" },
        ],
    },
    {
        title: "tools",
        items: [
            { name: "Git", color: "#f05032" },
            { name: "GitHub", color: "#e5e5e5" },
            { name: "Figma", color: "#a259ff" },
        ],
    },
]

const CONTACTS = [
    {
        label: "email",
        handle: "draveos20@gmail.com",
        href: "mailto:draveos20@gmail.com",
    },
    {
        label: "github",
        handle: "@draveos",
        href: "https://github.com/draveos",
    },
]

const CYCLE_WORDS = ["something", "anything", "visible", "useful", "mine"]

const CyclingWord = () => {
    const [idx, setIdx] = useState(0)
    const [paused, setPaused] = useState(false)

    useEffect(() => {
        if (paused) return
        const t = window.setInterval(() => {
            setIdx((i) => (i + 1) % CYCLE_WORDS.length)
        }, 2400)
        return () => window.clearInterval(t)
    }, [paused])

    return (
        <span
            className="relative inline-block align-top cursor-default"
            style={{ minWidth: "10ch" }}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
        >
            <AnimatePresence mode="wait">
                <motion.span
                    key={CYCLE_WORDS[idx]}
                    initial={{ opacity: 0, y: 18, filter: "blur(3px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -18, filter: "blur(3px)" }}
                    transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                    className="font-serif italic text-fog-100 inline-block"
                >
                    {CYCLE_WORDS[idx]}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

const CopyTag = ({ value }: { value: string }) => {
    const [copied, setCopied] = useState(false)

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            window.setTimeout(() => setCopied(false), 1600)
        } catch {
            // ignore
        }
    }

    return (
        <button
            type="button"
            onClick={handleClick}
            className="inline-flex items-center gap-1 px-2 py-1 ml-3 border border-white/10 rounded-sm font-mono text-[9px] uppercase tracking-[0.2em] text-fog-500 hover:text-fog-100 hover:border-white/25 transition-colors align-middle relative"
        >
            <AnimatePresence mode="wait">
                {copied ? (
                    <motion.span
                        key="copied"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                        className="text-emerald-400"
                    >
                        ✓ copied
                    </motion.span>
                ) : (
                    <motion.span
                        key="copy"
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.25 }}
                    >
                        copy
                    </motion.span>
                )}
            </AnimatePresence>
        </button>
    )
}

const StackBadge = ({
    name,
    color,
}: {
    name: string
    color: string
}) => (
    <motion.span
        initial="idle"
        whileHover="hover"
        animate="idle"
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="relative inline-flex items-center gap-1.5 px-2.5 py-1 border border-white/10 rounded-sm font-mono text-[10px] text-fog-300 cursor-default"
        variants={{
            idle: { x: 0, borderColor: "rgba(255,255,255,0.1)" },
            hover: { x: 2, borderColor: "rgba(255,255,255,0.25)" },
        }}
    >
        <span className="relative w-1.5 h-1.5 shrink-0">
            <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                    backgroundColor: color,
                    boxShadow: `0 0 6px ${color}70`,
                }}
                variants={{
                    idle: { scale: 1 },
                    hover: { scale: 1.35 },
                }}
                transition={{ type: "spring", stiffness: 320, damping: 18 }}
            />
            <motion.span
                className="absolute inset-0 rounded-full border"
                style={{ borderColor: color }}
                variants={{
                    idle: { scale: 1, opacity: 0 },
                    hover: { scale: 3, opacity: [0.8, 0] },
                }}
                transition={{ duration: 0.8, ease: "easeOut" }}
            />
        </span>
        {name}
    </motion.span>
)

const Outro = () => {
    return (
        <section className="relative py-32 lg:py-40 overflow-hidden">
            <div className="relative z-10 w-full max-w-7xl mx-auto px-10 lg:px-20">
                <div className="flex items-center gap-4 mb-16 lg:mb-24">
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog-500">
                        № 05 / outro
                    </span>
                    <span className="flex-1 h-px bg-fog-500/25" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog-500/70">
                        end of transmission
                    </span>
                </div>

                <div className="grid grid-cols-12 gap-10 mb-24">
                    <div className="col-span-12 lg:col-span-7">
                        <motion.h2
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-15%" }}
                            transition={{
                                duration: 1.0,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="text-[clamp(3rem,9vw,8rem)] leading-[0.95] tracking-tight font-light text-fog-200"
                        >
                            Let's make
                            <br />
                            <CyclingWord />
                            <span className="text-fog-100">.</span>
                        </motion.h2>

                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-15%" }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-10 font-mono text-[11px] text-fog-500 tracking-[0.22em] uppercase flex items-center gap-3"
                        >
                            <span className="inline-block w-8 h-px bg-fog-500" />
                            sejin kim · 2026
                        </motion.div>
                    </div>

                    <div className="col-span-12 lg:col-span-5 lg:pt-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog-500 mb-6 pb-3 border-b border-white/10"
                        >
                            stack
                        </motion.div>

                        <div className="flex flex-col gap-5">
                            {STACK_GROUPS.map((group, gi) => (
                                <motion.div
                                    key={group.title}
                                    initial={{ opacity: 0, y: 8 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-10%" }}
                                    transition={{
                                        duration: 0.5,
                                        delay: 0.1 + gi * 0.1,
                                    }}
                                    className="grid grid-cols-[80px_1fr] gap-4 items-start"
                                >
                                    <span className="font-mono text-[9px] uppercase tracking-widest text-fog-500/70 mt-1.5">
                                        {group.title}
                                    </span>
                                    <div className="flex flex-wrap gap-1.5">
                                        {group.items.map((it) => (
                                            <StackBadge
                                                key={it.name}
                                                name={it.name}
                                                color={it.color}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-12">
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="font-mono text-[10px] uppercase tracking-[0.22em] text-fog-500 mb-8"
                    >
                        reach
                    </motion.div>

                    <div className="flex flex-wrap gap-12 lg:gap-24 items-start">
                        {CONTACTS.map((c, i) => (
                            <motion.div
                                key={c.label}
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.5,
                                    delay: 0.1 + i * 0.1,
                                }}
                                className="flex items-end gap-1"
                            >
                                <motion.a
                                    href={c.href}
                                    target={
                                        c.href.startsWith("mailto")
                                            ? undefined
                                            : "_blank"
                                    }
                                    rel="noopener noreferrer"
                                    whileHover={{ x: 2 }}
                                    className="group relative inline-block"
                                >
                                    <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-fog-500 mb-2">
                                        {c.label}
                                    </span>
                                    <span className="block text-2xl lg:text-3xl font-light text-fog-200 group-hover:text-white transition-colors duration-500">
                                        {c.handle}
                                        <span className="inline-block ml-2 align-middle text-xl opacity-0 -translate-x-1 group-hover:opacity-70 group-hover:translate-x-0 transition-all duration-300">
                                            ↗
                                        </span>
                                    </span>
                                    <span className="absolute -bottom-1 left-0 h-px bg-fog-100/60 w-0 group-hover:w-full transition-[width] duration-500 ease-out" />
                                </motion.a>
                                {c.label === "email" && (
                                    <CopyTag value={c.handle} />
                                )}
                            </motion.div>
                        ))}
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="mt-24 pt-8 border-t border-white/5 font-mono text-[10px] text-fog-500/60 tracking-wider flex flex-wrap items-center justify-between gap-3"
                >
                    <span>draveos.github.io</span>
                    <span>built with react + vite · 2026</span>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, margin: "0px" }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    className="mt-10 font-mono text-[10px] text-fog-500/55 tracking-wider flex items-center gap-1"
                >
                    <span>// end of file</span>
                    <motion.span
                        animate={{ opacity: [0, 1, 0] }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                        className="inline-block w-1 h-3 bg-fog-400 ml-1 align-middle"
                    />
                </motion.div>
            </div>
        </section>
    )
}

export default Outro
