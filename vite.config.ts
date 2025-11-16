/// <reference types="vitest" />
/// <reference types="vite/client" />

import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
          "@constants": path.join(__dirname, "src/constants/"),
          "@models": path.join(__dirname, "src/models/"),
          "@queries": path.join(__dirname, "src/queries/"),
          "@utils": path.join(__dirname, "src/utils/"),
      }
    },
    test: {
        globals: true,
        environment: "jsdom",
        // this points to the setup file that we created earlier
        setupFiles: "./src/setupTests.ts",
        // you might want to disable the `css: true` line, since we don't have
        // tests that rely on CSS -- and parsing CSS is slow.
        // I'm leaving it in here because often people want to parse CSS in tests.
        css: true,
    },
})
