import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: "docs",     // dist 대신 docs 폴더에 빌드 결과물이 생성되도록
    emptyOutDir: true,  // 빌드 전에 docs/ 내부를 비워줌
  }
})
