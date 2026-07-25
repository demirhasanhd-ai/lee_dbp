import { defineConfig } from "vite";
import { readFile } from "node:fs/promises";

const packageJsonUrl = new URL("./package.json", import.meta.url);

export default defineConfig({
  root: "./local-preview",
  publicDir: "../public",
  plugins: [
    {
      name: "dbp-local-app-version",
      configureServer(server) {
        server.middlewares.use("/app-version.json", async (_req, res, next) => {
          try {
            const packageJson = JSON.parse(await readFile(packageJsonUrl, "utf8"));
            res.setHeader("Content-Type", "application/json; charset=utf-8");
            res.setHeader("Cache-Control", "no-store");
            res.end(JSON.stringify({ version: packageJson.version || "" }));
          } catch (error) {
            next(error);
          }
        });
      },
    },
  ],
  server: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
});
