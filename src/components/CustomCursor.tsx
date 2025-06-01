/* --- CustomCursor.tsx (변경 분 포함 전체 예시) --- */
"use client"

import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface CustomCursorProps {
    repelCenter: { x: number; y: number }
    repelRadius?: number
    repelStrength?: number
    repelCooldown?: number
    isAngry?: boolean
    isSidebarOpen?: boolean
}

interface OrbitStar {
    id: number
    baseAngle: number
    radius: number
    size: number
    speed: number
}

const ORBIT_COUNT = 6
const DIAMOND_POINTS = 8
const COLLAPSED_WIDTH = 140   // <-- sidebar 닫혔을 때 실제 픽셀

export default function CustomCursor({
                                         repelCenter,
                                         repelRadius = 120,
                                         repelStrength = 150,
                                         repelCooldown = 1200,
                                         isAngry = false,
                                         isSidebarOpen = true,
                                     }: CustomCursorProps) {
    /* ---------- state & refs ---------- */
    const [mouse, setMouse] = useState({ x: innerWidth / 2, y: innerHeight / 2 })
    const [cursor, setCursor] = useState({ x: innerWidth / 2, y: innerHeight / 2 })
    const [isRepelling, setIsRepelling] = useState(false)
    const [isOverSidebar, setIsOverSidebar] = useState(false)
    const [isOverIcon, setIsOverIcon] = useState(false)

    /* 궤도별 정보 */
    const [orbits] = useState<OrbitStar[]>(() =>
        Array.from({ length: ORBIT_COUNT }, (_, i) => ({
            id: i,
            baseAngle: (i / ORBIT_COUNT) * Math.PI * 2,
            radius: 18 + (i % 2) * 6,
            size: 2.5 + (i % 3) * 0.8,
            speed: 0.9 + i * 0.15,
        })),
    )

    const timeRef   = useRef(0)
    const rafRef    = useRef<number>()
    const lastRepel = useRef(0)

    /* ---------- helper ---------- */
    const diamondPoints = (radius: number, t: number) =>
        Array.from({ length: DIAMOND_POINTS }, (_, i) => {
            const a = (i / DIAMOND_POINTS) * Math.PI * 2 + t
            const r = radius * (1 + Math.sin(t * 2) * 0.1)
            return { x: Math.cos(a) * r, y: Math.sin(a) * r, delay: i * 0.1 }
        })

    /* ---------- mouse listener ---------- */
    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            setMouse({ x: e.clientX, y: e.clientY })

            /* 실제로 커서가 “사이드바 영역” 안에 있는지 체크  */
            const barWidth = isSidebarOpen ? 348 : COLLAPSED_WIDTH
            setIsOverSidebar(e.clientX <= barWidth)

            /* 아이콘(버튼) 위인지 – sidebar 접힌 상태에서만 */
            if (!isSidebarOpen && e.clientX <= COLLAPSED_WIDTH) {
                setIsOverIcon((e.target as HTMLElement).closest("button") !== null)
            } else {
                setIsOverIcon(false)
            }
        }
        addEventListener("mousemove", onMove)
        return () => removeEventListener("mousemove", onMove)
    }, [isSidebarOpen])

    /* ---------- hide system cursor (전역) ---------- */
    useEffect(() => {
        /* 한 번만 CSS 주입 */
        const style = document.createElement("style")
        style.textContent = `*{cursor:none!important}`
        document.head.appendChild(style)
        return () => style.remove()
    }, [])

    /* ---------- main RAF loop ---------- */
    // @ts-ignore
    useEffect(() => {
        const step = () => {
            timeRef.current += 0.016
            const now = Date.now()

            const dx = mouse.x - repelCenter.x
            const dy = mouse.y - repelCenter.y
            const dist = Math.hypot(dx, dy)

            if (
                !isRepelling &&
                isAngry &&
                dist < repelRadius &&
                now - lastRepel.current > repelCooldown
            ) {
                /* 밀어내기 */
                const nx = dx / (dist || 1)
                const ny = dy / (dist || 1)
                setCursor(p => ({ x: p.x + nx * repelStrength, y: p.y + ny * repelStrength }))
                setIsRepelling(true)
                lastRepel.current = now
                setTimeout(() => setIsRepelling(false), repelCooldown)
            } else if (!isRepelling) {
                /* 스무딩 */
                setCursor(p => ({ x: p.x + (mouse.x - p.x) * 0.2, y: p.y + (mouse.y - p.y) * 0.2 }))
            }

            rafRef.current = requestAnimationFrame(step)
        }

        rafRef.current = requestAnimationFrame(step)
        return () => rafRef.current && cancelAnimationFrame(rafRef.current)
    }, [mouse, repelCenter, isAngry, isRepelling, repelRadius, repelStrength, repelCooldown])

    /* ---------- 파생 상태 ---------- */
    /* ‘닫힌 사이드바 접힘 영역 안’에 들어왔을 때 다크 모드 */
    const darkInSidebar = (isSidebarOpen && isOverSidebar) || (!isSidebarOpen && isOverSidebar)
    /* 궤도·코어에 적용할 색상 */
    const coreIsBlack = darkInSidebar

    /* ---------- render ---------- */
    return (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 99999 }}>
            {/* ◆ 1. 다이아몬드(사이드바 아이콘 hover 용) */}
            {isOverIcon && !isSidebarOpen && (
                <>
                    {diamondPoints(30, timeRef.current).map((pt, i) => (
                        <motion.div
                            key={i}
                            style={{
                                position: "absolute",
                                left: cursor.x + pt.x,
                                top: cursor.y + pt.y,
                                width: 4,
                                height: 4,
                                transform: "translate(-50%,-50%) rotate(45deg)",
                                borderRadius: 2,
                                background:
                                    "radial-gradient(circle,#fff 0%,rgba(255,255,255,.8) 50%,transparent 100%)",
                                boxShadow: "0 0 8px rgba(255,255,255,.8),0 0 12px rgba(255,255,255,.4)",
                            }}
                            animate={{ scale: [1, 1.5, 1], opacity: [0.4, 1, 0.4] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: pt.delay }}
                        />
                    ))}
                </>
            )}

            {/* ◆ 2. 궤도 별 */}
            {(!isOverIcon || isSidebarOpen) && (
                <>
                    {orbits.map(o => {
                        const a = o.baseAngle + timeRef.current * o.speed
                        const ox = Math.cos(a) * o.radius
                        const oy = Math.sin(a) * o.radius
                        const starColor = coreIsBlack
                            ? "radial-gradient(circle,#000 0%,#000 60%,transparent 100%)"
                            : "radial-gradient(circle,#ffffff 0%,rgba(255,255,255,.6) 60%,transparent 100%)"

                        return (
                            <motion.div
                                key={o.id}
                                style={{
                                    position: "absolute",
                                    left: cursor.x + ox,
                                    top: cursor.y + oy,
                                    width: o.size,
                                    height: o.size,
                                    transform: "translate(-50%,-50%)",
                                    borderRadius: "50%",
                                    background: starColor,
                                    boxShadow: coreIsBlack ? "0 0 4px #000000a0" : "0 0 4px #ffffffa0",
                                }}
                                animate={{ opacity: [0.6, 1, 0.6] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut",
                                    delay: o.id * 0.1,
                                }}
                            />
                        )
                    })}
                </>
            )}

            {/* ◆ 3. 코어 + (Angry) 경고 애니메이션 */}
            <motion.div
                style={{
                    position: "absolute",
                    left: cursor.x,
                    top: cursor.y,
                    transform: "translate(-50%,-50%)",
                }}
                animate={{ scale: isRepelling ? (isAngry ? 2 : 1.5) : 1 }}
                transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            >
                <AnimatePresence mode="wait">
                    {coreIsBlack ? (
                        /* --- 검정 코어 --- */
                        <motion.div
                            key="core-dark"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: "black",
                                boxShadow: "0 0 40px #000",
                            }}
                        />
                    ) : (
                        /* --- 기본 흰 코어 --- */
                        <motion.div
                            key="core-light"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background:
                                    "radial-gradient(circle,#ffffff 0%,#ffffffc0 40%,transparent 100%)",
                                boxShadow: "0 0 22px #ffffff,0 0 50px #ffffff70",
                            }}
                        />
                    )}
                </AnimatePresence>

                {/* === Angry 상태일 때 빨간 ‘!’ 경고 === */}
                <AnimatePresence>
                    {isAngry && isRepelling && (
                        <motion.span
                            key="alert"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: [0, 1.4, 1], opacity: [0, 1, 0.8] }}
                            exit={{ opacity: 0, scale: 0 }}
                            transition={{
                                duration: 0.6,
                                ease: "easeOut",
                                repeat: Infinity,
                                repeatType: "reverse",
                            }}
                            style={{
                                position: "absolute",
                                left: "50%",
                                top: "50%",
                                translate: "-50% -65%",
                                fontSize: 26,
                                fontWeight: 900,
                                color: "#ff1a1a",
                                textShadow: "0 0 8px #ff5e5e,0 0 14px #ff1a1a",
                                pointerEvents: "none",
                            }}
                        >
                            !
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    )
}
