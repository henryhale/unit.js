import { resolve } from "node:path";
import { defineConfig } from "vite";
import defineUnitPlugin from "./unit.js/vite-plugin-unit";

export default defineConfig({
    plugins: [defineUnitPlugin()],
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),
                about: resolve(__dirname, "about/index.html")
            }    
        }
    }
});