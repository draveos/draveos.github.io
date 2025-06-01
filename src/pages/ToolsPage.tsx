"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"

const tools = [
    { name: "HTML", icon: "🌐", color: "#E34F26" },
    { name: "CSS", icon: "🎨", color: "#1572B6" },
    { name: "JavaScript", icon: "⚡", color: "#F7DF1E" },
    { name: "React", icon: "⚛️", color: "#61DAFB" },
    { name: "TypeScript", icon: "📘", color: "#3178C6" },
    { name: "Python", icon: "🐍", color: "#3776AB" },
    { name: "Figma", icon: "🎯", color: "#F24E1E" },
]

// 원 반지름
const RADIUS = 300
// rotation = 0일 때 i=0(HTML)이 12시(위쪽)에 오도록 -90도 보정
const ANGLE_OFFSET = 10
const FRICTION = 0.92
const MIN_VEL = 0.02
// wrapper 바로 아래로 원 중심을 내릴 때 사용할 오프셋(px)
const OFFSET = 0

export default function ToolsPage() {
    // ────────────────────────────────────────────
    // [1] State: rotation, 관성 속도, 드래그 여부, 현재툴 인덱스
    // ────────────────────────────────────────────
    const [rotation, setRotation] = useState(0)
    const [velocity, setVelocity] = useState(0)
    const [isDragging, setIsDragging] = useState(false)
    const [currentTool, setCurrentTool] = useState(0)

    // ────────────────────────────────────────────
    // [2] 원 중심 좌표
    // ────────────────────────────────────────────
    const [centerX, setCenterX] = useState(0)
    const [centerY, setCenterY] = useState(0)

    const wrapperRef = useRef<HTMLDivElement>(null)
    const lastAngleRef = useRef(0)
    const rafRef = useRef<number>()
    const lastTouchRef = useRef(Date.now())

    // ────────────────────────────────────────────
    // [A] wrapper 크기 변경 → centerX, centerY 갱신
    // ────────────────────────────────────────────
    useEffect(() => {
        if (!wrapperRef.current) return
        const el = wrapperRef.current

        const onResize = () => {
            const { width, height } = el.getBoundingClientRect()
            setCenterX(width / 2)
            setCenterY(height + OFFSET)
        }

        onResize()
        const ro = new ResizeObserver(onResize)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    // ────────────────────────────────────────────
    // [B] rotation 변경 시 currentTool 재계산
    // ────────────────────────────────────────────
    const getCurrentTool = useCallback(
        (rot: number) => {
            const step = 360 / tools.length
            const norm = ((rot % 360) + 360) % 360
            return Math.floor(((norm + step / 2) % 360) / step)
        },
        []
    )

    useEffect(() => {
        setCurrentTool(getCurrentTool(-(rotation + ANGLE_OFFSET)))
    }, [rotation, getCurrentTool])

    // ────────────────────────────────────────────
    // [C] getPos(i): i번째 아이콘 위치 계산
    // ────────────────────────────────────────────
    const getPos = (i: number) => {
        const step = 360 / tools.length
        const angleDeg = i * step + rotation - 90
        const rad = (angleDeg * Math.PI) / 180

        return {
            x: centerX + Math.cos(rad) * RADIUS,
            y: centerY + Math.sin(rad) * RADIUS,
            rot: angleDeg + 90, // 아이콘이 세로로 보이도록 +90°
        }
    }

    // ────────────────────────────────────────────
    // [D] RAF 루프: 관성 회전 + 일정 시간 후 스냅
    // ────────────────────────────────────────────
    useEffect(() => {
        const stepAngle = 360 / tools.length

        const loop = () => {
            // 관성 회전
            if (!isDragging && Math.abs(velocity) > MIN_VEL) {
                setRotation((r) => r + velocity)
                setVelocity((v) => v * FRICTION)
                rafRef.current = requestAnimationFrame(loop)
                return
            }

            // 아이들 상태
            if (!isDragging) {
                const idle = Date.now() - lastTouchRef.current
                // 3초 이상 idle → 즉시 스냅
                if (idle > 3000) {
                    const snapAngle = -currentTool * stepAngle
                    setRotation(snapAngle)
                    setVelocity(0)
                    return
                }
                // 3초 미만이라면 서서히 보정
                const snapAngle = -currentTool * stepAngle
                if (Math.abs(rotation - snapAngle) > 0.5) {
                    setRotation((r) => r + (snapAngle - r) * 0.08)
                    rafRef.current = requestAnimationFrame(loop)
                }
            }
        }

        rafRef.current = requestAnimationFrame(loop)
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [velocity, isDragging, rotation, currentTool])

    // ────────────────────────────────────────────
    // [E] (x,y) → 각도(°) 계산
    // ────────────────────────────────────────────
    const angle = (x: number, y: number) =>
        (Math.atan2(y - centerY, x - centerX) * 180) / Math.PI

    // ────────────────────────────────────────────
    // [F] 드래그 핸들러: down, move, up
    // ────────────────────────────────────────────
    const down = (e: React.MouseEvent) => {
        setIsDragging(true)
        setVelocity(0)
        lastAngleRef.current = angle(e.clientX, e.clientY)
        lastTouchRef.current = Date.now()
    }

    const move = (e: React.MouseEvent) => {
        if (!isDragging) return
        const cur = angle(e.clientX, e.clientY)
        let delta = cur - lastAngleRef.current
        if (delta > 180) delta -= 360
        if (delta < -180) delta += 360

        // ★ 현재툴이 HTML(0)일 때, delta>0(왼쪽→반시계) 방지
        // ★ 현재툴이 Figma(6)일 때, delta<0(오른쪽→시계) 방지
        const figmaIndex = tools.findIndex((t) => t.name === "Figma")
        if ((currentTool === 0 && delta > 0) || (currentTool === figmaIndex && delta < 0)) {
            delta = 0
        }

        setRotation((r) => r + delta)
        setVelocity(delta * 0.6)
        lastAngleRef.current = cur
        lastTouchRef.current = Date.now()
    }

    const up = () => {
        setIsDragging(false)
        lastTouchRef.current = Date.now()
    }

    // ────────────────────────────────────────────
    // [G] 한 칸씩 회전: next(), prev()
    // ────────────────────────────────────────────
    const stepAngle = 360 / tools.length
    const htmlIndex = 0
    const figmaIndex = tools.findIndex((t) => t.name === "Figma")

    const prev = () => {
        if (currentTool !== htmlIndex) {
            setRotation((r) => r + stepAngle)
            setVelocity(0)
            lastTouchRef.current = Date.now()
        }
    }

    const next = () => {
        if (currentTool !== figmaIndex) {
            setRotation((r) => r - stepAngle)
            setVelocity(0)
            lastTouchRef.current = Date.now()
        }
    }

    // ────────────────────────────────────────────
    // [H] 키보드 & 휠: prev/next 호출
    // ────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") prev()
            if (e.key === "ArrowRight") next()
        }
        const onWheel = (e: WheelEvent) => {
            e.deltaY > 0 ? next() : prev()
        }
        window.addEventListener("keydown", onKey)
        window.addEventListener("wheel", onWheel, { passive: true })
        return () => {
            window.removeEventListener("keydown", onKey)
            window.removeEventListener("wheel", onWheel)
        }
    })

    return (
        <div className="relative w-full h-screen bg-neutral-900 flex flex-col items-center pl-[300px] pt-12 overflow-hidden">
            {/* 헤더: “I can use…” + 좌/우 화살표 버튼 */}
            <div className="headerContainer relative flex items-center mb-6">
                {/* 왼쪽 화살표: HTML(0)일 때 비활성화 */}
                <motion.button
                    onClick={prev}
                    whileTap={currentTool === htmlIndex ? {} : { scale: 0.9 }}
                    className={`ml-4 w-12 h-12 bg-white/10 backdrop-blur border border-white/30 
                      rounded-full flex items-center justify-center text-white transition z-50 ${
                        currentTool === htmlIndex
                            ? "opacity-20 cursor-default"
                            : "hover:bg-white/20"
                    }`}
                >
                    <ChevronLeft />
                </motion.button>

                <motion.h1
                    className="text-6xl lg:text-7xl font-extralight text-white italic mx-8"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    I&nbsp;can&nbsp;use…
                </motion.h1>

                {/* 오른쪽 화살표: Figma(6)일 때 비활성화 */}
                <motion.button
                    onClick={next}
                    whileTap={currentTool === figmaIndex ? {} : { scale: 0.9 }}
                    className={`mr-4 w-12 h-12 bg-white/10 backdrop-blur border border-white/30 
                      rounded-full flex items-center justify-center text-white transition z-50 ${
                        currentTool === figmaIndex
                            ? "opacity-20 cursor-default"
                            : "hover:bg-white/20"
                    }`}
                >
                    <ChevronRight />
                </motion.button>
            </div>

            {/* Figma 선택 시 “That’s it!” 표시 */}
            <AnimatePresence>
                {currentTool === figmaIndex && (
                    <motion.div
                        className="mb-4 text-white text-xl font-semibold"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.3 }}
                    >
                        That’s it!
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 현재 선택된 툴 아이콘 + 이름 */}
            <div className="flex items-center justify-center mb-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentTool}
                        initial={{ opacity: 0, scale: 0.8, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: -12 }}
                        transition={{ duration: 0.25 }}
                        className="px-10 py-4 rounded-3xl font-semibold text-4xl text-center"
                        style={{
                            color: tools[currentTool].color,
                            backgroundColor: `${tools[currentTool].color}18`,
                            boxShadow: `0 0 40px ${tools[currentTool].color}55`,
                            backdropFilter: "blur(4px)",
                        }}
                    >
                        {tools[currentTool].icon}&nbsp;{tools[currentTool].name}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Wheel 영역 (반원) */}
            <div
                ref={wrapperRef}
                className="toolsContainer relative w-full h-[60vh] flex flex-grow items-start justify-center overflow-hidden"
            >
                {/* 실제 Wheel (drag/move/up 이벤트) */}
                <div
                    className="absolute inset-0 cursor-grab active:cursor-grabbing"
                    onMouseDown={down}
                    onMouseMove={move}
                    onMouseUp={up}
                    onMouseLeave={up}
                >
                    {tools.map((t, i) => {
                        const p = getPos(i)
                        const act = i === currentTool
                        return (
                            <motion.div
                                key={t.name}
                                className="absolute w-24 h-24 md:w-28 md:h-28 rounded-3xl flex items-center justify-center text-4xl md:text-5xl font-bold select-none"
                                style={{
                                    left: p.x - 48,
                                    top: p.y - 48,
                                    backgroundColor: t.color,
                                    boxShadow: act
                                        ? `0 0 30px ${t.color}aa, 0 0 60px ${t.color}66`
                                        : `0 0 14px ${t.color}55`,
                                    zIndex: act ? 20 : 10,
                                }}
                                animate={{ scale: act ? 1.3 : 1, rotate: p.rot }}
                                whileHover={{ scale: act ? 1.4 : 1.2 }}
                                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                                onClick={() => {
                                    // 클릭 시 i번째가 12시로 오도록
                                    setRotation(-i * (360 / tools.length))
                                    setVelocity(0)
                                    lastTouchRef.current = Date.now()
                                }}
                            >
                                {t.icon}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Wheel 안내문 */}
                <motion.p
                    className="flex bottom-48 text-white/60 text-sm md:text-base"
                    style={{
                        top: centerY - RADIUS / 2,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    Drag to spin • Scroll / Arrow keys or use buttons to navigate
                </motion.p>
            </div>
        </div>
    )
}
