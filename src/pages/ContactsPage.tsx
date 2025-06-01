"use client"

import { motion, AnimatePresence } from "framer-motion"

// (1) Define your “true” center coordinates here:
export const centerX = 760
export const centerY = 280

type ContactsPageProps = {}

const ContactsPage: React.FC<ContactsPageProps> = () => {
    // 폰을 화면 중앙 기준으로 얼마나 좌우/세로로 떨어뜨릴지
    const phoneOffsetX = 350 // 폰 컨테이너의 중심이 centerX±phoneOffsetX 에 놓임
    const phoneOffsetY = -100   // 폰 컨테이너의 중심이 centerY+phoneOffsetY 에 놓임

    return (
        <div className="w-full h-screen relative overflow-hidden">
            {/* ───────────────────────────────────────────────
          1) Gradient Background
      ─────────────────────────────────────────────── */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600" />

            {/* ───────────────────────────────────────────────
          2) Page Title (Top Center)
      ─────────────────────────────────────────────── */}
            <motion.h1
                className="absolute top-8 left-1/2 transform -translate-x-1/2 text-5xl md:text-6xl lg:text-7xl font-light text-white drop-shadow-xl"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.6 }}
            >
                Contacts
            </motion.h1>

            {/* ───────────────────────────────────────────────
          3) Floating Kakao Phone (왼쪽) - 화면 중앙 기준으로 절대 위치
      ─────────────────────────────────────────────── */}
            <motion.div
                className="relative w-64 h-[432px] md:w-72 md:h-[488px] lg:w-80 lg:h-[540px]"
                initial={{ opacity: 1, x: 0 }}
                animate={{
                    opacity: 1,
                    y: [0, -15, 0], // 부드럽게 위아래 흔들림
                }}
                transition={{
                    delay: 0.3,
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                }}
                style={{
                    position: "absolute",
                    left:  `${centerX - phoneOffsetX}px`,
                    top:   `${centerY + phoneOffsetY}px`,
                    transform: "translate(-50%, -50%) rotate(-40deg)",
                }}
            >
                {/* 폰 이미지 */}
                <img
                    src="/2.svg"
                    alt="Kakao Phone Placeholder"
                    className="w-full h-full object-fill scale-150"
                />

                {/* ID 캡션 (폰 바로 아래) */}
                <motion.div
                    className="absolute bottom-[-1rem] left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                >
          <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-yellow-200 drop-shadow-[0_0_8px_rgba(255,255,224,0.9)] animate-pulse">
            Kakao ID
          </span>
                </motion.div>
            </motion.div>

            {/* ───────────────────────────────────────────────
          4) Floating Holographic Ring (정중앙)
      ─────────────────────────────────────────────── */}
            <motion.div
                className="flex w-40 h-40 md:w-48 md:h-48 lg:w-56 lg:h-56"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                    opacity: [0.6, 1, 0.6],
                    scale: [0.95, 1.05, 0.95],
                    rotate: [0, 360, 0],
                }}
                transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 0.5,
                }}
                style={{
                    position: "absolute",
                    left: `${centerX}px`,
                    top:  `${centerY}px`,
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div className="absolute inset-0 rounded-full border-4 border-gradient-to-br from-white/50 via-pink-200 to-purple-200 opacity-60 blur-sm" />
                <div className="absolute inset-0 rounded-full border-2 border-white/30 animate-pulse" />
                <div className="absolute inset-1 rounded-full bg-white/10" />
            </motion.div>

            {/* ───────────────────────────────────────────────
          5) Floating Instagram Phone (오른쪽) - 화면 중앙 기준으로 절대 위치
      ─────────────────────────────────────────────── */}
            <motion.div
                className="relative w-64 h-[432px] md:w-72 md:h-[488px] lg:w-80 lg:h-[540px]"
                initial={{ opacity: 1, x: 0 }}
                animate={{
                    opacity: 1,
                    y: [0, -15, 0],
                }}
                transition={{
                    delay: 0.4,
                    duration: 4,
                    repeat: Infinity,
                    repeatType: "loop",
                    ease: "easeInOut",
                }}
                style={{
                    position: "absolute",
                    left:  `${centerX + phoneOffsetX - 65}px`,
                    top:   `${centerY + phoneOffsetY}px`,
                    transform: "translate(-50%, -50%) rotate(40deg)",
                }}
            >
                <img
                    src="/1.svg"
                    alt="Instagram Phone Placeholder"
                    className="w-full h-full object-fill scale-150"
                />

                {/* ID 캡션 (폰 바로 아래) */}
                <motion.div
                    className="absolute bottom-[-1rem] left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
          <span className="text-xl md:text-2xl lg:text-3xl font-semibold text-pink-200 drop-shadow-[0_0_8px_rgba(255,192,203,0.9)] animate-pulse">
            Insta ID
          </span>
                </motion.div>
            </motion.div>

            {/* ───────────────────────────────────────────────
          6) Floating Decorative Dots (optional, 배경)
      ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {Array.from({ length: 6 }).map((_, i) => {
                    const angle = (i / 6) * Math.PI * 2
                    return (
                        <motion.div
                            key={i}
                            className="absolute w-2 h-2 bg-white rounded-full opacity-50"
                            style={{
                                left: `calc(50% + ${Math.cos(angle) * 320}px)`,
                                top:  `calc(50% + ${Math.sin(angle) * 320}px)`,
                            }}
                            animate={{
                                y: [0, -15, 0, 15, 0],
                                opacity: [0.3, 0.8, 0.3],
                            }}
                            transition={{
                                duration: 6,
                                delay: i * 0.3,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                        />
                    )
                })}
            </AnimatePresence>
        </div>
    )
}

export default ContactsPage
