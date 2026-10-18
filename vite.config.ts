import vinext from "vinext";
import { defineConfig } from "vite";
import packageJson from "./package.json";

// macOS Seatbelt blocks FSEvents, so Codex previews need polling for HMR.
const isCodexSeatbeltSandbox = process.env.CODEX_SANDBOX === "seatbelt";

const localBindingConfig = {
  main: "./worker/index.ts",
  compatibility_flags: ["nodejs_compat"],
  d1_databases: [],
  r2_buckets: [],
};

export default defineConfig(async ({ command }) => {
  // Keep Wrangler and Miniflare state project-local. These are non-secret tool
  // settings; application environment belongs in ignored `.env*` files.
  process.env.WRANGLER_WRITE_LOGS ??= "false";
  process.env.WRANGLER_LOG_PATH ??= ".wrangler/logs";
  process.env.MINIFLARE_REGISTRY_PATH ??= ".wrangler/registry";

  // Local development runs in Node alongside the existing SQLite/API server.
  // Production builds retain the Cloudflare worker output.
  const localDev = command === "serve" && process.env.DBP_LOCAL_DEV === "1";
  const runtimePlugins = [];
  if (!localDev) {
    // Wrangler snapshots its log path while the Cloudflare plugin is imported.
    const { cloudflare } = await import("@cloudflare/vite-plugin");
    runtimePlugins.push(cloudflare({
      viteEnvironment: { name: "rsc", childEnvironments: ["ssr"] },
      config: localBindingConfig,
    }));
  }

  return {
    define: {
      "process.env.NEXT_PUBLIC_APP_VERSION": JSON.stringify(packageJson.version),
    },
    server: {
      watch: {
        ...(isCodexSeatbeltSandbox || process.platform === "win32"
          ? { useFsEvents: false, usePolling: true, interval: 200 }
          : {}),
        ignored: ["**/local-volume/**", "**/data/**", "**/dist/**", "**/.wrangler/**"],
      },
    },
    plugins: [
      vinext(),
      ...runtimePlugins,
    ],
  };
});
