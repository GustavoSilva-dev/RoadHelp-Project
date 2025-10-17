import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from "fs"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    open: true,
    https: {
      key: fs.readFileSync('./localhost+3-key.pem'),
      cert: fs.readFileSync('./localhost+3.pem'),
    }
  },
})
