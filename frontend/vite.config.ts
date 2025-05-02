import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
            '@components': '/src/components',
            '@pages': '/src/pages',
            '@layouts': '/src/layouts',
            '@hooks': '/src/hooks',
            '@api': '/src/api',
            '@utils': '/src/utils',
            '@context': '/src/context',
            '@types': '/src/types',
            '@constants': '/src/constants',
            '@assets': '/src/assets',
            '@routes': '/src/routes'
        }
    }
})
