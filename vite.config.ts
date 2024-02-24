import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from 'vite-tsconfig-paths';
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        viteCommonjs(),
        viteTsconfigPaths(),
        react()
    ],
    optimizeDeps: {
        include: ['neutron-core'],
    },
    define: {
        'process.env': process.env
    }
  })