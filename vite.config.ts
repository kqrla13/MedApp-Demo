import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    // Preprocesa estos paquetes de FullCalendar para evitar errores de ESM
    include: [
      '@fullcalendar/core',
      '@fullcalendar/react',
      '@fullcalendar/daygrid',
      '@fullcalendar/timegrid',
      '@fullcalendar/interaction'
    ]
  },
  build: {
    rollupOptions: {
      // Generalmente no necesitamos externalizar @fullcalendar/core si usamos optimizeDeps
      external: []
    }
  }
})
