import { defineConfig, Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { createServer } from "./server";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': 'http://localhost:4000',
    },
  },
  build: {
    outDir: "dist/spa",
  },
  plugins: [react()], // Bỏ expressPlugin để proxy hoạt động đúng
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
      "@shared": path.resolve(__dirname, "./shared"),
    },
  },
}));

// function expressPlugin(): Plugin {
//   return {
//     name: "express-plugin",
//     apply: "serve", // Only apply during development (serve mode)
//     configureServer(server) {
//       const app = createServer();
//       // server.middlewares.use(app); // Bỏ dòng này để không override proxy
//     },
//   };
// }
