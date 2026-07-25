import net from "node:net";

const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || "8081");
const healthUrl = `http://127.0.0.1:${port}/dbp/api/dbp/health`;

function hasListener() {
  return new Promise((resolve) => {
    const socket = net.connect({ host, port });
    socket.setTimeout(800);
    socket.once("connect", () => {
      socket.destroy();
      resolve(true);
    });
    socket.once("timeout", () => {
      socket.destroy();
      resolve(false);
    });
    socket.once("error", () => resolve(false));
  });
}

if (!(await hasListener())) {
  process.exit(1);
}

try {
  const response = await fetch(healthUrl, { signal: AbortSignal.timeout(1500) });
  process.exit(response.ok ? 0 : 2);
} catch {
  process.exit(2);
}
