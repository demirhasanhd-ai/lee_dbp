import { defineConfig } from "vite";

export default defineConfig({
  root: "./local-preview",
  publicDir: "../public",
  server: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
});
