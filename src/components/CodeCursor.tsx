import { useCallback, useEffect, useRef, useState } from "react"
import {
    AnimatePresence,
    motion,
    useMotionValue,
    useSpring,
} from "framer-motion"

const FRAGMENTS = [
    "const x",
    "=> {}",
    "i++",
    "&& !null",
    "return",
    "<div/>",
    "await",
    "npm i",
    "if (x)",
    "torch.nn",
    ".backward()",
    "cuda:0",
    "dtype=f16",
    "tensor",
    "grad=None",
    "model.eval()",
    "softmax",
    "np.array",
    ".detach()",
    "0x1f",
    "0b101",
    "null",
    "undefined",
    "[...xs]",
    "{ ok: true }",
    "try { }",
    "async fn",
    ".shape",
]

type Frag = {
    id: number
    text: string
    x: number
    y: number
}

type TrailProps = Frag & { onExpire: (id: number) => void }

const Trail = ({ id, text, x, y, onExpire }: TrailProps) => {
    const [shown, setShown] = useState("")

    useEffect(() => {
        let i = 0
        const typer = window.setInterval(() => {
            i += 1
            setShown(text.slice(0, i))
            if (i >= text.length) window.clearInterval(typer)
        }, 28)
        const expire = window.setTimeout(() => onExpire(id), 1400)
        return () => {
            window.clearInterval(typer)
            window.clearTimeout(expire)
        }
    }, [id, text, onExpire])

    return (
        <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 0.7, y: -10 }}
            exit={{ opacity: 0, y: -18, transition: { duration: 0.4 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="absolute font-mono text-[9px] text-fog-400 whitespace-nowrap select-none"
            style={{ left: x, top: y }}
        >
            {shown}
            {shown.length < text.length && (
                <span className="inline-block w-[3px] h-[9px] ml-[1px] bg-fog-400 align-middle" />
            )}
        </motion.div>
    )
}

const MAX_FRAGS = 18

const CodeCursor = () => {
    const x = useMotionValue(-100)
    const y = useMotionValue(-100)
    const sx = useSpring(x, { stiffness: 500, damping: 30, mass: 0.4 })
    const sy = useSpring(y, { stiffness: 500, damping: 30, mass: 0.4 })

    const [frags, setFrags] = useState<Frag[]>([])
    const nextId = useRef(0)
    const lastSpawn = useRef({ x: -999, y: -999, t: 0 })

    const removeFrag = useCallback((id: number) => {
        setFrags((prev) => prev.filter((f) => f.id !== id))
    }, [])

    useEffect(() => {
        const onMove = (e: MouseEvent) => {
            x.set(e.clientX)
            y.set(e.clientY)

            const dx = e.clientX - lastSpawn.current.x
            const dy = e.clientY - lastSpawn.current.y
            const dist = Math.hypot(dx, dy)
            const now = performance.now()
            if (dist > 45 && now - lastSpawn.current.t > 90) {
                const id = nextId.current++
                const text = FRAGMENTS[Math.floor(Math.random() * FRAGMENTS.length)]
                const offsetX = (Math.random() - 0.5) * 40 + 10
                const offsetY = (Math.random() - 0.5) * 28 - 18
                setFrags((prev) => {
                    const next = [...prev, { id, text, x: e.clientX + offsetX, y: e.clientY + offsetY }]
                    return next.length > MAX_FRAGS ? next.slice(next.length - MAX_FRAGS) : next
                })
                lastSpawn.current = { x: e.clientX, y: e.clientY, t: now }
            }
        }
        window.addEventListener("mousemove", onMove)
        return () => window.removeEventListener("mousemove", onMove)
    }, [x, y])

    return (
        <div className="fixed inset-0 pointer-events-none z-[90]">
            <motion.div
                style={{ x: sx, y: sy, marginLeft: -3, marginTop: -3 }}
                className="absolute top-0 left-0 w-1.5 h-1.5 rounded-full bg-fog-200 shadow-[0_0_8px_rgba(229,229,229,0.6)]"
            />
            <AnimatePresence>
                {frags.map((f) => (
                    <Trail key={f.id} {...f} onExpire={removeFrag} />
                ))}
            </AnimatePresence>
        </div>
    )
}

export default CodeCursor
