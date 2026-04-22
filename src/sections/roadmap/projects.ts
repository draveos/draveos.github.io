export type Project = {
    id: string
    period: string
    title: string
    repo: string
    description: string
    stack: string[]
    media?: { type: "image" | "video"; src: string }
    link?: string
}

export const PROJECTS: Project[] = [
    {
        id: "algo-viz",
        period: "2023",
        title: "algorithm_visualizer",
        repo: "draveos/algorithm_visualizer",
        description:
            "JavaScript sandbox for visualizing algorithm behavior step by step. Early experiments in teaching through motion.",
        stack: ["JavaScript"],
        media: { type: "image", src: "/media/algo_viz.png" },
        link: "https://github.com/draveos/algorithm_visualizer",
    },
    {
        id: "mario-rl",
        period: "2024",
        title: "mario_RL",
        repo: "draveos/mario_RL",
        description:
            "Super Mario agent trained with Double DQN. Reward shaping, exploration tuning, and watching an agent learn to jump.",
        stack: ["Python", "PyTorch", "DDQN"],
        media: { type: "image", src: "/media/mario.png" },
        link: "https://github.com/draveos/mario_RL",
    },
    {
        id: "gat-gcn",
        period: "2024",
        title: "GAT-GCN-Pubmed",
        repo: "draveos/GAT-GCN-Pubmed",
        description:
            "Graph neural network experiments on PubMed citation data. GAT vs GCN — attention vs convolution on graphs.",
        stack: ["Python", "PyG", "GNN"],
        link: "https://github.com/draveos/GAT-GCN-Pubmed",
    },
    {
        id: "exaone",
        period: "2025",
        title: "LGAimers-EXAONE",
        repo: "draveos/LGAimers-EXAONE-Experiment",
        description:
            "Layer-by-layer probing of EXAONE. Where does which information live, and what happens when you prune by slice.",
        stack: ["Python", "PyTorch", "LLM"],
        link: "https://github.com/draveos/LGAimers-EXAONE-Experiment",
    },
    {
        id: "cau-portal",
        period: "2025",
        title: "CAU_Portal_Renewal",
        repo: "draveos/CAU_Portal_Renewal",
        description:
            "UI/UX redesign proposal for Chung-Ang University's student portal. Information hierarchy, navigation flow, visual system.",
        stack: ["TypeScript", "React", "Figma"],
        media: { type: "image", src: "/media/cau_portal.png" },
        link: "https://github.com/draveos/CAU_Portal_Renewal",
    },
    {
        id: "ai-resume",
        period: "2025",
        title: "AI Resume Master",
        repo: "draveos/AI_Resume_Project",
        description:
            "AI-powered resume and cover letter draft generator. Live editing, template filling, polished export.",
        stack: ["TypeScript", "React", "OpenAI"],
        media: { type: "image", src: "/media/resume_1.gif" },
        link: "https://github.com/draveos/AI_Resume_Project",
    },
    {
        id: "node-for-ai",
        period: "2025 —",
        title: "Node for AI",
        repo: "CAS-korea/NodeFrontend",
        description:
            "Connection project for the AI department — built with CAS. A platform to share, discuss, and link AI study content between students.",
        stack: ["TypeScript", "React", "Three.js"],
        media: { type: "image", src: "/media/node_for_ai.png" },
        link: "https://node-for-ai.vercel.app/",
    },
    {
        id: "linker",
        period: "2026",
        title: "VibeCoding Hackathon",
        repo: "draveos/v0-linker",
        description:
            "VibeCoded Project for IT Korea Hackathon— with a theme of LMS using AI. Main Features involve Graph generation, analysis reports, chat service.",
        stack: ["TypeScript", "Next.js", "v0"],
        media: { type: "video", src: "/media/v0_graph.mp4" },
        link: "https://project-linker.vercel.app/",
    },
]
