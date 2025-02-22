import { defineConfig, loadEnv } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path"

// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // const env = loadEnv(mode, process.cwd(), '');
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: {
      'process.env.PESTO_API_PORT': JSON.stringify(env.PESTO_API_PORT),
      'process.env.PESTO_API_HOST': JSON.stringify(env.PESTO_API_HOST),
      'process.env.PESTO_API_HTTP_SCHEME': JSON.stringify(env.PESTO_API_HTTP_SCHEME)
    },
    server: { // config to use an IP that can be reachable by my private plausible analytics service
      // host: `testwebsite.pokus.io`,
      host: `ui.pesto.io`,
      // port: 5174,
      // host: `0.0.0.0`,
      // origin: `testwebsite.pokus.io`,
      cors: {
        // origin: `testwebsite.pokus.io, github.com`
        origin: `ui.pesto.io, github.com`
      },
    },
    plugins: [preact(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  }
})