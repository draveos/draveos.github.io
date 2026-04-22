import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import EfficiencyCard from "./thesis/EfficiencyCard"
import LeaderboardCard from "./thesis/LeaderboardCard"
import TelemetryCard from "./thesis/TelemetryCard"
import BitField from "./thesis/BitField"

const Thesis = () => {
    const ref = useRef<HTMLElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end end"],
    })

    const w1Opacity = useTransform(scrollYProgress, [0.02, 0.12], [0, 1])
    const w1Y = useTransform(scrollYProgress, [0.02, 0.12], [20, 0])
    const w2Opacity = useTransform(scrollYProgress, [0.14, 0.24], [0, 1])
    const w2Y = useTransform(scrollYProgress, [0.14, 0.24], [20, 0])
    const w3Opacity = useTransform(scrollYProgress, [0.28, 0.42], [0, 1])
    const w3Y = useTransform(scrollYProgress, [0.28, 0.42], [20, 0])
    const w3Scale = useTransform(scrollYProgress, [0.28, 0.42], [0.94, 1])

    const cardsOpacity = useTransform(scrollYProgress, [0.5, 0.62], [0, 1])
    const cardsY = useTransform(scrollYProgress, [0.5, 0.62], [30, 0])

    const leaderboardProgress = useTransform(
        scrollYProgress,
        [0.62, 0.98],
        [0, 1]
    )

    return (
        <section ref={ref} className="relative h-[420vh]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center">
                <div className="relative z-10 w-full max-w-7xl mx-auto px-10 lg:px-20">
                    <div className="absolute -left-4 -top-4 text-xs font-mono text-fog-500 tracking-widest uppercase">
                        <span className="inline-block w-8 h-px bg-fog-500 align-middle mr-3" />
                        02 — Thesis
                    </div>

                    <div className="grid grid-cols-12 gap-8 items-center">
                        <div className="col-span-12 lg:col-span-7 relative">
                            <BitField />
                            <h2 className="relative z-10 text-[clamp(2.5rem,7vw,6rem)] leading-[1.05] font-light tracking-tight text-fog-300">
                                <motion.span
                                    style={{ opacity: w1Opacity, y: w1Y }}
                                    className="block"
                                >
                                    Not just
                                </motion.span>
                                <motion.span
                                    style={{ opacity: w2Opacity, y: w2Y }}
                                    className="block"
                                >
                                    using models.
                                </motion.span>
                                <motion.span
                                    style={{
                                        opacity: w3Opacity,
                                        y: w3Y,
                                        scale: w3Scale,
                                        transformOrigin: "left center",
                                    }}
                                    className="block text-fog-100 font-normal mt-6"
                                >
                                    <em className="font-serif italic">Understanding</em>{" "}
                                    them.
                                </motion.span>
                            </h2>
                        </div>

                        <motion.div
                            style={{ opacity: cardsOpacity, y: cardsY }}
                            className="col-span-12 lg:col-span-5"
                        >
                            <div className="flex flex-col gap-3">
                                <EfficiencyCard progress={leaderboardProgress} />
                                <LeaderboardCard progress={leaderboardProgress} />
                                <TelemetryCard />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Thesis
