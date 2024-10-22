import { fileURLToPath, URL } from 'node:url'
import { version } from './package.json'
import { defineConfig } from 'vite'
import { splitVendorChunkPlugin } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), splitVendorChunkPlugin()],
  define: {
    __APP_VERSION__: JSON.stringify(version)
  },
  build: {
    // This is a work around and only hides warnings
    chunkSizeWarningLimit: 1600,
    // Minify option
    // https://vitejs.dev/config/build-options.html#build-minify
    minify: 'esbuild',
    // Rollup Options
    // https://vitejs.dev/config/build-options.html#build-rollupoptions
    rollupOptions: {
      output: {
        // entryFileNames: "[name].[hash].js",
        // chunkFileNames: "[name].[hash].js",
        // assetFileNames: "[name].[hash].[ext]",

        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString()
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
