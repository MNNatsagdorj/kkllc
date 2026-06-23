import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // 개발 중 /api 요청을 백엔드로 프록시. 백엔드 포트(application.yml server.port)와 일치시킬 것.
      // 다른 값으로 띄웠다면 VITE_API_TARGET 환경변수로 덮어쓰기 가능.
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:8085',
        changeOrigin: true,
      },
    },
  },
})
