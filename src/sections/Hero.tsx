import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import ProjectDeck from "./ProjectDeck"

const SCRAMBLE_POOL =
    "#$%&*@/\\{}<>+=-[]|^~?!;:.#$%&*@/<>+=-{}[]|^~?!;:#$%&*@/<>+=-AMXRN"

const randChar = () => SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)]

const KEYWORDS = ["architecture", "performance", "efficiency"]

const KeywordCycle = () => {
    const [active, setActive] = useState(0)

    useEffect(() => {
        const t = window.setInterval(
            () => setActive((a) => (a + 1) % KEYWORDS.length),
            2000
        )
        return () => window.clearInterval(t)
    }, [])

    return (
        <div className="mt-4 flex flex-wrap gap-x-3 text-xl md:text-2xl font-medium leading-tight">
            {KEYWORDS.map((w, i) => (
                <motion.span
                    key={w}
                    animate={{
                        color:
                            active === i
                                ? "#ffffff"
                                : "rgba(229,229,229,0.45)",
                        y: active === i ? -2 : 0,
                    }}
                    transition={{
                        duration: 0.6,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                    className="inline-block"
                >
                    {w}
                    {i < KEYWORDS.length - 1 ? "," : "."}
                </motion.span>
            ))}
        </div>
    )
}

const HoverLetter = ({ char }: { char: string }) => {
    const [display, setDisplay] = useState(char)
    const [hovering, setHovering] = useState(false)

    useEffect(() => {
        if (!hovering) {
            setDisplay(char)
            return
        }
        let raf = 0
        let start = 0
        let lastSwap = 0
        const duration = 420
        const stepMs = 80
        const tick = (t: number) => {
            if (!start) start = t
            const elapsed = t - start
            if (elapsed >= duration) {
                setDisplay(char)
                return
            }
            if (t - lastSwap >= stepMs) {
                setDisplay(randChar())
                lastSwap = t
            }
            raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [hovering, char])

    return (
        <motion.span
            onHoverStart={() => setHovering(true)}
            onHoverEnd={() => setHovering(false)}
            whileHover={{ y: "-0.06em", color: "#ffffff" }}
            transition={{ type: "spring", stiffness: 320, damping: 18 }}
            className="inline-block cursor-default will-change-transform"
        >
            {display}
        </motion.span>
    )
}

const NameDisplay = ({
    target,
    durationMs,
    startDelayMs,
}: {
    target: string
    durationMs: number
    startDelayMs: number
}) => {
    const [scrambled, setScrambled] = useState(() => target.replace(/[^\s]/g, randChar))
    const [settled, setSettled] = useState(false)

    useEffect(() => {
        let raf = 0
        let start = 0
        const startTimer = window.setTimeout(() => {
            const tick = (t: number) => {
                if (!start) start = t
                const elapsed = t - start
                const progress = Math.min(elapsed / durationMs, 1)
                const revealCount = Math.floor(target.length * progress)
                let out = ""
                for (let i = 0; i < target.length; i++) {
                    const ch = target[i]
                    if (i < revealCount || ch === " " || ch === "\n") {
                        out += ch
                    } else {
                        out += randChar()
                    }
                }
                setScrambled(out)
                if (progress < 1) {
                    raf = requestAnimationFrame(tick)
                } else {
                    setScrambled(target)
                    setSettled(true)
                }
            }
            raf = requestAnimationFrame(tick)
        }, startDelayMs)

        return () => {
            window.clearTimeout(startTimer)
            cancelAnimationFrame(raf)
        }
    }, [target, durationMs, startDelayMs])

    if (!settled) return <>{scrambled}</>

    return (
        <>
            {target.split("").map((ch, i) => (
                <HoverLetter key={i} char={ch} />
            ))}
        </>
    )
}

const Hero = () => {
    const ref = useRef<HTMLElement>(null)
    const [mouse, setMouse] = useState({ x: 0, y: 0 })

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    })

    const titleY = useTransform(scrollYProgress, [0, 1], [0, -80])
    const titleOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 2
            const y = (e.clientY / window.innerHeight - 0.5) * 2
            setMouse({ x, y })
        }
        window.addEventListener("mousemove", onMove)
        return () => window.removeEventListener("mousemove", onMove)
    }, [])

    return (
        <section
            ref={ref}
            className="relative h-screen w-full overflow-hidden flex items-center"
        >
            <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-[70%] pointer-events-none overflow-hidden"
                style={{
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.25) 55%, transparent 100%)",
                }}
            >
                <motion.div
                    className="absolute"
                    style={{
                        backgroundImage: "url(/media/nangman.jpg)",
                        backgroundSize: "cover",
                        backgroundPosition: "center 30%",
                        backgroundRepeat: "no-repeat",
                        inset: "-6%",
                        x: mouse.x * -18,
                        y: mouse.y * -18,
                    }}
                    transition={{ type: "spring", stiffness: 60, damping: 20 }}
                />
            </div>

            <div
                aria-hidden
                className="absolute inset-0 pointer-events-none overflow-hidden"
                style={{
                    maskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,1) 100%)",
                    WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,1) 100%)",
                }}
            >
                <div
                    className="absolute grid-translate opacity-[0.12]"
                    style={{
                        inset: "-60px",
                        backgroundImage:
                            "linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)",
                        backgroundSize: "56px 56px",
                    }}
                />
            </div>

            <div
                aria-hidden
                className="absolute -left-40 top-1/3 w-[520px] h-[520px] rounded-full blur-[120px] opacity-20"
                style={{ background: "radial-gradient(circle, #3a3a3a 0%, transparent 70%)" }}
            />

            <div className="relative z-10 w-full max-w-7xl mx-auto px-10 lg:px-20">
                <motion.div
                    style={{
                        y: titleY,
                        opacity: titleOpacity,
                        x: mouse.x * 6,
                    }}
                    transition={{ type: "spring", stiffness: 80, damping: 20 }}
                    className="relative"
                >
                    <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="absolute -left-4 -top-6 text-xs font-mono text-fog-500 tracking-widest uppercase"
                    >
                        <span className="inline-block w-8 h-px bg-fog-500 align-middle mr-3" />
                        01 — Intro
                    </motion.div>

                    <h1 className="text-[clamp(4rem,14vw,12rem)] leading-[0.9] tracking-tightest font-light">
                        <span className="block">
                            <NameDisplay target="Sejin" durationMs={900} startDelayMs={150} />
                        </span>
                        <span className="block relative">
                            <NameDisplay target="Kim" durationMs={900} startDelayMs={450} />
                            <motion.span
                                aria-hidden
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.8, delay: 1.4, ease: [0.4, 0, 0.2, 1] }}
                                style={{ transformOrigin: "left center" }}
                                className="absolute -right-8 top-1/2 hidden md:inline-block w-24 h-px bg-fog-500/40"
                            />
                        </span>
                    </h1>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.3 }}
                        className="mt-10 max-w-xl"
                    >
                        <p className="text-base md:text-lg text-fog-300 leading-relaxed">
                            AI student. Interested in what's{" "}
                            <em className="font-serif italic text-fog-200">inside</em> the model.
                        </p>
                        <KeywordCycle />
                    </motion.div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.35 }}
                    style={{
                        x: mouse.x * -18,
                        y: mouse.y * -18,
                    }}
                    aria-hidden
                    className="absolute right-10 lg:right-24 top-[18%] hidden md:block"
                >
                    <ProjectDeck />
                </motion.div>
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="absolute bottom-10 left-10 lg:left-20 flex items-center gap-3 z-10"
            >
                <motion.div
                    animate={{ y: [0, 6, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-px h-10 bg-fog-500/50"
                />
                <span className="font-mono text-[10px] text-fog-500 tracking-widest uppercase">
                    Scroll
                </span>
            </motion.div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 1.6 }}
                className="absolute bottom-10 right-10 lg:right-20 font-mono text-[10px] text-fog-500 tracking-widest uppercase z-10"
            >
                draveos / portfolio
            </motion.div>
        </section>
    )
}

export default Hero
