import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import BootLoader from "./sections/BootLoader"
import Hero from "./sections/Hero"
import Thesis from "./sections/Thesis"
import Roadmap from "./sections/Roadmap"
import Philosophy from "./sections/Philosophy"
import Outro from "./sections/Outro"
import CodeCursor from "./components/CodeCursor"

function App() {
    const [booted, setBooted] = useState(false)

    return (
        <main className="bg-ink-950 text-fog-200">
            <AnimatePresence mode="wait">
                {!booted && <BootLoader key="boot" onDone={() => setBooted(true)} />}
            </AnimatePresence>

            {booted && (
                <>
                    <CodeCursor />
                    <Hero />
                    <Thesis />
                    <Roadmap />
                    <Philosophy />
                    <Outro />
                </>
            )}
        </main>
    )
}

export default App
