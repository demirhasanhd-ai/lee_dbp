import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { inspectProjectModules } from "../scripts/check-project-modules.mjs";
import { dockerRuntimeSource } from "./helpers/docker-runtime-files.mjs";

test("the Docker runtime contains the server's complete local static module dependency graph", () => {
  const root = new URL("../", import.meta.url);
  const dockerfile = readFileSync(new URL("Dockerfile", root), "utf8");
  const runtime = dockerfile.split(/^FROM .+ AS runtime\s*$/mi)[1];
  assert.ok(runtime, "Dockerfile runtime stage must exist");
  const { files, missingFiles } = inspectProjectModules(fileURLToPath(root));
  assert.deepEqual(missingFiles, []);
  for (const file of files) {
    const relative = file.slice(fileURLToPath(root).length).replaceAll("\\", "/");
    const target = `/app/${relative}`;
    assert.equal(dockerRuntimeSource(dockerfile, target), file, `${target} is missing from the runtime image`);
  }
});
