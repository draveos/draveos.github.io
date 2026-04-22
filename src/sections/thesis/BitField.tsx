import { useMemo } from "react"
import { motion } from "framer-motion"

const TOKENS = [
    "∂x/∂t",
    "∫f(x)dx",
    "∇²u",
    "Σᵢxᵢ",
    "√2",
    "π",
    "e^x",
    "ln(x)",
    "lim x→0",
    "d²y/dx²",
    "f'(x)",
    "g(θ)",
    "P(A|B)",
    "E[X]",
    "σ²",
    "μ",
    "‖v‖",
    "det(A)",
    "Aᵀ",
    "λ",
    "∫₀¹",
    "∂L/∂w",
    "ε",
    "δ",
    "θ",
    "ω",
    "sin θ",
    "cos x",
    "tan α",
    "0.5",
    "1.0",
    "π/4",
    "∞",
    "∑",
    "∇f",
]

type Bit = {
    id: number
    x: number
    y: number
    text: string
    delay: number
    duration: number
    drift: number
    size: number
}

const COUNT = 28

const BitField = () => {
    const bits = useMemo<Bit[]>(() => {
        return Array.from({ length: COUNT }, (_, i) => {
            const inTopHalf = Math.random() > 0.5
            const y = inTopHalf
                ? Math.random() * 28
                : 72 + Math.random() * 28
            return {
                id: i,
                x: Math.random() * 100,
                y,
                text: TOKENS[Math.floor(Math.random() * TOKENS.length)],
                delay: Math.random() * 5,
                duration: 4.5 + Math.random() * 4,
                drift: (Math.random() - 0.5) * 36,
                size: Math.random() > 0.7 ? 14 : 11,
            }
        })
    }, [])

    return (
        <div
            aria-hidden
            className="absolute inset-0 pointer-events-none overflow-hidden"
        >
            {bits.map((b) => (
                <motion.span
                    key={b.id}
                    className="absolute font-mono whitespace-nowrap"
                    style={{
                        left: `${b.x}%`,
                        top: `${b.y}%`,
                        fontSize: `${b.size}px`,
                        color: "rgba(212, 212, 212, 0.75)",
                    }}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                        opacity: [0, 0.55, 0.55, 0],
                        y: [0, b.drift * 0.3, b.drift * 0.7, b.drift],
                    }}
                    transition={{
                        duration: b.duration,
                        delay: b.delay,
                        times: [0, 0.25, 0.75, 1],
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    {b.text}
                </motion.span>
            ))}
        </div>
    )
}

export default BitField
