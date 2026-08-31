import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import legacy from '@vitejs/plugin-legacy'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // ships modern bundle + legacy bundle with polyfills for old
    // Android WebView / iOS Safari / etc. Browsers pick automatically.
    legacy({
      targets: ['defaults', 'not IE 11', 'iOS >= 12', 'Android >= 6'],
    }),
  ],
  build: {
    target: 'es2018',
    cssTarget: 'chrome80',
    minify: 'terser',
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
  },
})
