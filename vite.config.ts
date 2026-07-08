import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'prepiq.svg'],
      workbox: {
        maximumFileSizeToCacheInBytes: 3145728, // 3 MiB
      },
      manifest: {
        name: 'PrepIQ',
        short_name: 'PrepIQ',
        description: 'AI-powered technical interview prep that reverse-engineers job descriptions to find your knowledge gaps.',
        theme_color: '#6366F1',
        background_color: '#0b0f19',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'prepiq.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
})
