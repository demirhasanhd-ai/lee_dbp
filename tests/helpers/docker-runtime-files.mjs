import { statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = fileURLToPath(new URL("../../", import.meta.url));

export function dockerRuntimeSource(dockerfile, destination) {
  const runtime = dockerfile.split(/^FROM .+ AS runtime\s*$/mi)[1] || "";
  for (const [, source, target] of runtime.matchAll(/^COPY\s+(\S+)\s+(\S+)\s*$/gm)) {
    if (source.includes("*")) continue;
    const local = path.resolve(rootDir, source);
    const targetPath = path.posix.resolve("/app", target);
    if (statSync(local).isDirectory()) {
      if (destination === targetPath || destination.startsWith(`${targetPath}/`)) {
        return path.join(local, path.posix.relative(targetPath, destination));
      }
    } else if (destination === (target.endsWith("/") ? path.posix.join(targetPath, path.basename(source)) : targetPath)) {
      return local;
    }
  }
  return null;
}
