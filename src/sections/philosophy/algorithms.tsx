import { motion } from "framer-motion"

const STROKE = "rgba(229,229,229,0.75)"
const DIM = "rgba(229,229,229,0.25)"

export const AnimGradient = () => (
    <svg viewBox="0 0 70 44" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {[22, 16, 10, 5].map((r, i) => (
            <ellipse
                key={r}
                cx="50"
                cy="22"
                rx={r}
                ry={r * 0.65}
                fill="none"
                stroke="white"
                strokeOpacity={0.08 + i * 0.04}
                strokeWidth="0.5"
            />
        ))}
        <motion.circle
            r="1.6"
            fill="white"
            animate={{
                cx: [8, 20, 32, 42, 48, 50, 50],
                cy: [40, 32, 26, 23, 22, 22, 22],
                opacity: [0.8, 0.9, 1, 1, 1, 1, 0],
            }}
            transition={{
                duration: 3.8,
                times: [0, 0.2, 0.4, 0.6, 0.8, 0.95, 1],
                repeat: Infinity,
                ease: "easeOut",
            }}
            style={{ filter: "drop-shadow(0 0 2px rgba(255,255,255,0.6))" }}
        />
    </svg>
)

export const AnimTree = () => {
    const nodes = [
        { cx: 35, cy: 10, delay: 0 },
        { cx: 15, cy: 34, delay: 0.7 },
        { cx: 55, cy: 34, delay: 1.4 },
    ]
    return (
        <svg viewBox="0 0 70 44" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            <line x1="35" y1="10" x2="15" y2="34" stroke={DIM} strokeWidth="0.6" />
            <line x1="35" y1="10" x2="55" y2="34" stroke={DIM} strokeWidth="0.6" />
            {nodes.map((n, i) => (
                <motion.circle
                    key={i}
                    cx={n.cx}
                    cy={n.cy}
                    r="2.5"
                    fill="white"
                    animate={{ opacity: [0.2, 1, 0.2] }}
                    transition={{
                        duration: 2.5,
                        delay: n.delay,
                        repeat: Infinity,
                        repeatDelay: 0.3,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </svg>
    )
}

export const AnimSort = () => {
    const heights = [
        [4, 14, 8, 20, 12],
        [18, 6, 22, 10, 16],
        [10, 20, 14, 6, 22],
    ]
    return (
        <svg viewBox="0 0 70 44" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {[0, 1, 2, 3, 4].map((i) => {
                const series = [
                    heights[0][i],
                    heights[1][i],
                    heights[2][i],
                    heights[0][i],
                ]
                return (
                    <motion.rect
                        key={i}
                        x={10 + i * 10}
                        width="6"
                        fill="white"
                        fillOpacity={0.7}
                        animate={{
                            height: series,
                            y: series.map((h) => 40 - h),
                        }}
                        transition={{
                            duration: 3.6,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                )
            })}
        </svg>
    )
}

export const AnimRotation = () => (
    <svg viewBox="0 0 70 44" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <motion.g
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: "35px 22px" }}
        >
            {[0, 60, 120, 180, 240, 300].map((deg) => {
                const rad = (deg * Math.PI) / 180
                const x = 35 + Math.cos(rad) * 14
                const y = 22 + Math.sin(rad) * 14
                return (
                    <line
                        key={deg}
                        x1="35"
                        y1="22"
                        x2={x}
                        y2={y}
                        stroke={STROKE}
                        strokeWidth="0.6"
                        strokeLinecap="round"
                    />
                )
            })}
        </motion.g>
        <circle cx="35" cy="22" r="2" fill="white" />
    </svg>
)

export const AnimWalk = () => (
    <svg viewBox="0 0 70 44" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <motion.polyline
            fill="none"
            stroke={DIM}
            strokeWidth="0.5"
            points="6,20 14,12 22,24 28,18 36,28 42,14 50,22 58,16 64,26"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
        <motion.circle
            r="1.6"
            fill="white"
            animate={{
                cx: [6, 14, 22, 28, 36, 42, 50, 58, 64],
                cy: [20, 12, 24, 18, 28, 14, 22, 16, 26],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
    </svg>
)

export const AnimSigmoid = () => (
    <svg viewBox="0 0 70 44" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <line x1="6" y1="38" x2="64" y2="38" stroke={DIM} strokeWidth="0.4" />
        <line x1="10" y1="6" x2="10" y2="42" stroke={DIM} strokeWidth="0.4" />
        <motion.path
            d="M 10,34 C 26,34 30,28 34,22 C 38,16 44,10 60,10"
            fill="none"
            stroke="white"
            strokeWidth="1"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 1, 0] }}
            transition={{
                duration: 3.6,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.4, 0.85, 1],
            }}
        />
    </svg>
)

export const AnimBall = () => (
    <svg viewBox="0 0 70 44" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        {[0, 1, 2].map((i) => (
            <motion.circle
                key={i}
                cx="35"
                cy="22"
                fill="none"
                stroke="white"
                strokeWidth="0.6"
                animate={{
                    r: [0, 18],
                    opacity: [0.8, 0],
                }}
                transition={{
                    duration: 2.4,
                    delay: i * 0.8,
                    repeat: Infinity,
                    ease: "easeOut",
                }}
            />
        ))}
        <circle cx="35" cy="22" r="2" fill="white" />
    </svg>
)

export const AnimGraph = () => {
    const nodes = [
        { cx: 14, cy: 14 },
        { cx: 56, cy: 14 },
        { cx: 14, cy: 34 },
        { cx: 56, cy: 34 },
        { cx: 35, cy: 24 },
    ]
    const edges = [
        [0, 4, 0],
        [1, 4, 0.3],
        [2, 4, 0.6],
        [3, 4, 0.9],
        [0, 1, 1.2],
        [2, 3, 1.5],
    ]
    return (
        <svg viewBox="0 0 70 44" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
            {edges.map(([a, b, delay], i) => (
                <motion.line
                    key={i}
                    x1={nodes[a].cx}
                    y1={nodes[a].cy}
                    x2={nodes[b].cx}
                    y2={nodes[b].cy}
                    stroke="white"
                    strokeWidth="0.5"
                    animate={{ opacity: [0.1, 0.6, 0.1] }}
                    transition={{
                        duration: 2.4,
                        delay,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                />
            ))}
            {nodes.map((n, i) => (
                <circle
                    key={i}
                    cx={n.cx}
                    cy={n.cy}
                    r={i === 4 ? 2.4 : 1.6}
                    fill="white"
                    fillOpacity={i === 4 ? 0.95 : 0.55}
                />
            ))}
        </svg>
    )
}

export const ALGORITHMS = [
    { id: "gradient", label: "∂L/∂w", name: "descent", Component: AnimGradient },
    { id: "tree", label: "O(log n)", name: "traverse", Component: AnimTree },
    { id: "sort", label: "Σᵢaᵢ", name: "sort", Component: AnimSort },
    { id: "rotation", label: "SO(3)", name: "rotate", Component: AnimRotation },
    { id: "walk", label: "P(xₜ)", name: "walk", Component: AnimWalk },
    { id: "sigmoid", label: "σ(z)", name: "activate", Component: AnimSigmoid },
    { id: "ball", label: "Bε(x)", name: "ε-ball", Component: AnimBall },
    { id: "graph", label: "G=(V,E)", name: "graph", Component: AnimGraph },
] as const
