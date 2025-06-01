"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { PageType } from "../App"
import BIG_FONT_LIST from "../components/fonts" // 폰트 리스트 import

const LETTERS = [
    { letter: "P", x: 470, y: 60, rotate: -6 },
    { letter: "O", x: 580, y: 80, rotate: 7 },
    { letter: "R", x: 700, y: 115, rotate: 18 },
    { letter: "T", x: 800, y: 175, rotate: 29 },
    { letter: "F", x: 875, y: 250, rotate: 44 },
    { letter: "O", x: 930, y: 335, rotate: 58 },
    { letter: "L", x: 990, y: 445, rotate: 71 },
    { letter: "I", x: 1040, y: 540, rotate: 83 },
    { letter: "O", x: 1020, y: 650, rotate: 98 },
]

// BOX 크기: contacts > roadmap > tools > profile (큰 → 작은)
const BOXES = [
    {
        x: 440,
        y: 195,
        rotate: 0,
        size: 90,
        icon: "public/icons/profile.png",
        label: "Profile",
        page: "profile",
    },
    {
        x: 560,
        y: 225,
        rotate: 5,
        size: 120,
        icon: "public/icons/tools.png",
        label: "Tools",
        page: "tools",
    },
    {
        x: 700,
        y: 300,
        rotate: 35,
        size: 150,
        icon: "public/icons/roadmap.png",
        label: "Roadmap",
        page: "roadmap",
    },
    {
        x: 790,
        y: 480,
        rotate: 68,
        size: 180,
        icon: "public/icons/contacts.png",
        label: "Contacts",
        page: "contacts",
    },
]

interface HomePageProps {
    onNavigate: (page: PageType) => void
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
    const [fontMap, setFontMap] = useState<string[]>(() => LETTERS.map((_, i) => BIG_FONT_LIST[i % BIG_FONT_LIST.length]))
    const [hovered, setHovered] = useState<number | null>(null)
    const [expandingIdx, setExpandingIdx] = useState<number | null>(null)
    const [showBoxes, setShowBoxes] = useState(false)
    const [animationPhase, setAnimationPhase] = useState<"idle" | "fadeOut" | "flyToCenter" | "shockwave" | "finalFade">(
        "idle",
    )

    // 글자 애니메이션 끝나고 박스 등장
    useEffect(() => {
        const t = setTimeout(() => setShowBoxes(true), LETTERS.length * 90 + 700)
        return () => clearTimeout(t)
    }, [])

    // 박스 클릭 - 새로운 애니메이션 시퀀스
    const handleBoxClick = (target: PageType, idx: number) => {
        setExpandingIdx(idx)

        // Phase 1: Fade out everything else
        setAnimationPhase("fadeOut")

        setTimeout(() => {
            // Phase 2: Fly to center
            setAnimationPhase("flyToCenter")
        }, 600)

        setTimeout(() => {
            // Phase 3: Shockwave
            setAnimationPhase("shockwave")
        }, 1200)

        setTimeout(() => {
            // Phase 4: Final fade
            setAnimationPhase("finalFade")
        }, 2000)

        setTimeout(() => {
            onNavigate(target)
        }, 3000)
    }

    // 박스 등장 delay 설정
    const boxAppearDelay = [0.15, 0.45, 0.75, 1.05] // profile→contacts

    // 중앙 위치(확대 애니메이션용)
    const centerX = 830
    const centerY = 350

    // hover 시 글자 폰트 랜덤 교체
    const handleLetterHover = (idx: number) => {
        if (animationPhase !== "idle") return
        setFontMap((prev) =>
            prev.map((font, i) => (i === idx ? BIG_FONT_LIST[Math.floor(Math.random() * BIG_FONT_LIST.length)] : font)),
        )
        setHovered(idx)
    }

    return (
        <div className="relative w-full h-screen overflow-hidden bg-neutral-900 rounded-[48px]">
            {/* Shockwave Effects */}
            <AnimatePresence>
                {animationPhase === "shockwave" && (
                    <>
                        {/* Main shockwave rings */}
                        {[0, 1, 2, 3, 4].map((i) => (
                            <motion.div
                                key={`shockwave-${i}`}
                                className="absolute rounded-full border-4 border-white"
                                style={{
                                    left: centerX,
                                    top: centerY,
                                    transformOrigin: "center",
                                }}
                                initial={{
                                    width: 0,
                                    height: 0,
                                    opacity: 0.8,
                                    x: "-50%",
                                    y: "-50%",
                                }}
                                animate={{
                                    width: 2000 + i * 200,
                                    height: 2000 + i * 200,
                                    opacity: 0,
                                }}
                                transition={{
                                    duration: 1.5,
                                    delay: i * 0.1,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                            />
                        ))}

                        {/* Radial gradient shockwave */}
                        <motion.div
                            className="absolute inset-0 pointer-events-none"
                            style={{
                                background: `radial-gradient(circle at ${centerX}px ${centerY}px, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.1) 20%, transparent 50%)`,
                            }}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 3 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                        />

                        {/* Particle-like effects */}
                        {Array.from({ length: 20 }).map((_, i) => (
                            <motion.div
                                key={`particle-${i}`}
                                className="absolute w-2 h-2 bg-white rounded-full"
                                style={{
                                    left: centerX,
                                    top: centerY,
                                }}
                                initial={{
                                    opacity: 1,
                                    scale: 0,
                                    x: "-50%",
                                    y: "-50%",
                                }}
                                animate={{
                                    opacity: 0,
                                    scale: [0, 1, 0],
                                    x: Math.cos((i / 20) * Math.PI * 2) * (300 + Math.random() * 200) - 4,
                                    y: Math.sin((i / 20) * Math.PI * 2) * (300 + Math.random() * 200) - 4,
                                }}
                                transition={{
                                    duration: 1.5,
                                    delay: Math.random() * 0.3,
                                    ease: "easeOut",
                                }}
                            />
                        ))}

                        {/* Energy burst effect */}
                        <motion.div
                            className="absolute rounded-full"
                            style={{
                                left: centerX,
                                top: centerY,
                                background:
                                    "radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0.4) 30%, transparent 70%)",
                                transformOrigin: "center",
                            }}
                            initial={{
                                width: 20,
                                height: 20,
                                opacity: 0,
                                x: "-50%",
                                y: "-50%",
                            }}
                            animate={{
                                width: 400,
                                height: 400,
                                opacity: [0, 1, 0],
                            }}
                            transition={{
                                duration: 0.8,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            }}
                        />
                    </>
                )}
            </AnimatePresence>

            {/* PORTFOLIO Letters */}
            {LETTERS.map((item, i) => (
                <motion.div
                    key={i}
                    className="absolute select-none text-white drop-shadow-lg pointer-events-auto"
                    style={{
                        fontFamily: fontMap[i],
                        fontSize: 88,
                        fontWeight: 800,
                        left: item.x,
                        top: item.y,
                        rotate: `${item.rotate}deg`,
                        textShadow: "0 8px 32px #fff, 0 2px 2px #0005",
                        filter: hovered === i ? "brightness(1.25) blur(0.5px)" : "",
                        transition: "filter 0.25s",
                    }}
                    initial={{ opacity: 0, y: -80, scale: 0.7 }}
                    animate={
                        animationPhase === "fadeOut" ||
                        animationPhase === "flyToCenter" ||
                        animationPhase === "shockwave" ||
                        animationPhase === "finalFade"
                            ? {
                                opacity: 0,
                                y: -120,
                                scale: 0.8,
                                filter: "blur(4px)",
                            }
                            : { opacity: 1, y: 0, scale: 1 }
                    }
                    transition={{
                        duration: animationPhase === "fadeOut" ? 0.6 : 1.0,
                        delay: animationPhase === "fadeOut" ? i * 0.05 : 0.09 * i,
                        ease: [0.4, 0, 0.2, 1],
                    }}
                    onMouseEnter={() => handleLetterHover(i)}
                    onMouseLeave={() => setHovered(null)}
                >
                    {item.letter}
                </motion.div>
            ))}

            {/* Boxes */}
            <AnimatePresence>
                {showBoxes &&
                    BOXES.map((box, i) => {
                        // 클릭된 박스: 중앙으로 이동 후 특별한 애니메이션
                        if (expandingIdx === i) {
                            return (
                                <motion.div
                                    key={i}
                                    className="absolute z-40 flex items-center justify-center bg-white shadow-2xl rounded-2xl"
                                    style={{
                                        left: box.x,
                                        top: box.y,
                                        width: box.size,
                                        height: box.size,
                                        rotate: `${box.rotate}deg`,
                                    }}
                                    initial={{
                                        opacity: 1,
                                        scale: 1,
                                        left: box.x,
                                        top: box.y,
                                        rotate: box.rotate,
                                        filter: "brightness(1)",
                                    }}
                                    animate={
                                        animationPhase === "flyToCenter"
                                            ? {
                                                left: centerX - box.size / 2,
                                                top: centerY - box.size / 2,
                                                scale: 1.5,
                                                rotate: 0,
                                                filter: "brightness(1.2) drop-shadow(0 0 30px rgba(255,255,255,0.8))",
                                            }
                                            : animationPhase === "shockwave"
                                                ? {
                                                    left: centerX - box.size / 2,
                                                    top: centerY - box.size / 2,
                                                    scale: 2,
                                                    rotate: 0,
                                                    filter: "brightness(2) drop-shadow(0 0 50px rgba(255,255,255,1))",
                                                }
                                                : animationPhase === "finalFade"
                                                    ? {
                                                        left: centerX - box.size / 2,
                                                        top: centerY - box.size / 2,
                                                        scale: 0.5,
                                                        opacity: 0,
                                                        filter: "brightness(0.5) blur(10px)",
                                                    }
                                                    : {}
                                    }
                                    transition={{
                                        duration:
                                            animationPhase === "flyToCenter"
                                                ? 0.8
                                                : animationPhase === "shockwave"
                                                    ? 0.3
                                                    : animationPhase === "finalFade"
                                                        ? 2.2
                                                        : 1.5,
                                        ease:
                                            animationPhase === "flyToCenter"
                                                ? [0.25, 0.46, 0.45, 0.94]
                                                : animationPhase === "shockwave"
                                                    ? [0.68, -0.55, 0.265, 1.55]
                                                    : [0.4, 0, 1, 1],
                                    }}
                                >
                                    <motion.img
                                        src={box.icon}
                                        alt={box.label}
                                        className="w-1/2 h-1/2"
                                        animate={
                                            animationPhase === "shockwave"
                                                ? {
                                                    scale: [1, 1.3, 1],
                                                }
                                                : {}
                                        }
                                        transition={{
                                            duration: 0.6,
                                            repeat: animationPhase === "shockwave" ? 2 : 0,
                                        }}
                                    />
                                </motion.div>
                            )
                        }

                        // 나머지 박스들: 빠르게 fade out
                        return (
                            <motion.button
                                key={i}
                                className="absolute z-30 flex items-center justify-center bg-white shadow-xl rounded-2xl border-4 border-neutral-900"
                                style={{
                                    left: box.x,
                                    top: box.y,
                                    width: box.size,
                                    height: box.size,
                                    rotate: `${box.rotate}deg`,
                                    filter: hovered === i + 10 ? "brightness(1.2) drop-shadow(0 0 24px #fff8)" : "",
                                }}
                                initial={{ opacity: 0, y: 100, scale: 0.7 }}
                                animate={
                                    animationPhase === "fadeOut" ||
                                    animationPhase === "flyToCenter" ||
                                    animationPhase === "shockwave" ||
                                    animationPhase === "finalFade"
                                        ? {
                                            opacity: 0,
                                            scale: 0.3,
                                            y: 50,
                                            filter: "blur(8px) brightness(0.5)",
                                        }
                                        : { x: 0, y: 0, opacity: 1, scale: 1 }
                                }
                                transition={{
                                    duration: animationPhase === "fadeOut" ? 0.5 : 1.2,
                                    delay: animationPhase === "fadeOut" ? i * 0.1 : boxAppearDelay[i],
                                    ease: [0.4, 0, 0.2, 1],
                                }}
                                onMouseEnter={() => animationPhase === "idle" && setHovered(i + 10)}
                                onMouseLeave={() => setHovered(null)}
                                onClick={() => animationPhase === "idle" && handleBoxClick(box.page as PageType, i)}
                                whileHover={animationPhase === "idle" ? { scale: 1.09 } : {}}
                                disabled={animationPhase !== "idle"}
                            >
                                <img src={box.icon || "/placeholder.svg"} alt={box.label} className="w-1/2 h-1/2" />
                            </motion.button>
                        )
                    })}
            </AnimatePresence>
        </div>
    )
}

export default HomePage
