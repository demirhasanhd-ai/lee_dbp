import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import path from "node:path";
import test from "node:test";

test("the Docker runtime contains the server's complete local static module dependency graph", () => {
  const root = new URL("../", import.meta.url);
  const dockerfile = readFileSync(new URL("Dockerfile", root), "utf8");
  const runtime = dockerfile.split(/^FROM .+ AS runtime\s*$/mi)[1];
  assert.ok(runtime, "Dockerfile runtime stage must exist");
  const copies = new Map([...runtime.matchAll(/^COPY\s+(\S+)\s+(\S+)\s*$/gm)]
    .map(([, source, destination]) => [path.posix.resolve("/app", destination), source]));
  const pending = ["/app/server.mjs"];
  const visited = new Set();
  while (pending.length) {
    const module = pending.pop();
    if (visited.has(module)) continue;
    visited.add(module);
    const source = copies.get(module);
    assert.ok(source, `${module} is required by the server but missing from Docker runtime COPY instructions`);
    const content = readFileSync(new URL(source, root), "utf8");
    for (const [, specifier] of content.matchAll(/(?:\bfrom\s*|\bimport\s*)["'](\.[^"']+)["']/g)) {
      pending.push(path.posix.resolve(path.posix.dirname(module), specifier));
    }
  }
});
