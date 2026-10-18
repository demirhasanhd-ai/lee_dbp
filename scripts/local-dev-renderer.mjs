import { realpathSync } from "node:fs";
import { createServer } from "node:net";

// Keep the existing Node API/SQLite server as the browser's single origin.
// Vite renders pages on a private port; HMR uses the public HTTP server directly.
export async function createLocalDevRenderer({ rootDir, httpServer, port }) {
  // Vite treats port 0 as its default port, so select an available private port.
  const probe = createServer();
  await new Promise((resolve, reject) => {
    probe.once("error", reject);
    probe.listen(0, "127.0.0.1", resolve);
  });
  const privatePort = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    root: realpathSync(rootDir),
    mode: "development",
    server: {
      host: "127.0.0.1",
      port: privatePort,
      strictPort: false,
      hmr: { server: httpServer, clientPort: port },
    },
  });
  try {
    await vite.listen();
  } catch (error) {
    await vite.close();
    throw error;
  }
  const origin = `http://127.0.0.1:${vite.httpServer.address().port}`;
  const basePath = vite.config.base.replace(/\/$/u, "");

  return {
    async fetch(request) {
      const url = new URL(request.url);
      // vinext's home refresh URL is /dbp.rsc; Vite's base middleware only
      // admits /dbp/*. Preserve the root RSC route inside that base prefix.
      if (basePath && url.pathname === `${basePath}.rsc`) url.pathname = `${basePath}/.rsc`;
      const target = new URL(`${url.pathname}${url.search}`, origin);
      const forwarded = new Request(target, request);
      forwarded.headers.set("accept-encoding", "identity");
      return fetch(forwarded, { redirect: "manual" });
    },
    close: () => vite.close(),
  };
}
