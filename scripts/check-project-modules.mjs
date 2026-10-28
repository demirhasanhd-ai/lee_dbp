import { existsSync, readFileSync } from "node:fs";
import { createRequire, isBuiltin } from "node:module";
import * as nodeModule from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export function inspectProjectModules(rootDir, { local = false } = {}) {
  const entries = local
    ? ["server.mjs", "scripts/start-local-dbp.mjs", "scripts/local-dev-renderer.mjs", "vite.config.ts"]
    : ["server.mjs"];
  const pending = entries.map((entry) => ({ file: path.resolve(rootDir, entry), importer: "başlatıcı" }));
  const files = new Set();
  const missingFiles = [];
  const missingPackages = [];
  while (pending.length) {
    const { file, importer } = pending.pop();
    if (files.has(file)) continue;
    files.add(file);
    if (!existsSync(file)) {
      missingFiles.push({ file: path.relative(rootDir, file), importer });
      continue;
    }
    if (!/\.[cm]?[jt]sx?$/u.test(file)) continue;
    const source = readFileSync(file, "utf8");
    // Anchor static declarations so strings such as audit("database.import")
    // and SQL containing FROM cannot be mistaken for module specifiers.
    const specifiers = [...source.matchAll(/^\s*(?:import|export)\s+(?:[^;"']*?\sfrom\s*)?["']([^"'\r\n]+)["']/gm)]
      .map((match) => match[1]);
    if (local) {
      specifiers.push(...[...source.matchAll(/\bimport\(\s*["']([^"'\r\n]+)["']/g)].map((match) => match[1]));
    }
    const require = createRequire(pathToFileURL(file));
    for (const specifier of specifiers) {
      if (specifier.startsWith(".")) {
        pending.push({ file: path.resolve(path.dirname(file), specifier), importer: path.relative(rootDir, file) });
      } else if (!isBuiltin(specifier)) {
        try { require.resolve(specifier); }
        catch (error) {
          // Vite plugins can expose import-only entry points. A require-mode
          // resolution failure must not trigger a reinstall of a healthy ESM package.
          let importOnly = false;
          if (error.code === "ERR_PACKAGE_PATH_NOT_EXPORTED" && nodeModule.findPackageJSON) {
            try { importOnly = existsSync(nodeModule.findPackageJSON(specifier, pathToFileURL(file).href)); } catch {}
          }
          if (!importOnly) missingPackages.push({ specifier, importer: path.relative(rootDir, file) });
        }
      }
    }
  }
  return { files: [...files], missingFiles, missingPackages };
}

export function printModuleProblems(result, log = console.error) {
  for (const item of result.missingFiles) {
    log(`[HATA] Proje dosyası eksik: ${item.file} (çağıran: ${item.importer}).`);
  }
  if (result.missingFiles.length) log("Eksik proje dosyaları npm ile kurulamaz. Proje kopyasını veya Git güncellemesini kontrol edin.");
  for (const item of result.missingPackages) {
    log(`[HATA] Paket yüklenemiyor: ${item.specifier} (çağıran: ${item.importer}).`);
  }
}

if (process.argv[1] && pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url) {
  const rootDir = fileURLToPath(new URL("../", import.meta.url));
  const result = inspectProjectModules(rootDir);
  printModuleProblems(result);
  if (result.missingFiles.length || result.missingPackages.length) process.exitCode = 1;
  else console.log(`[dbp] Çalışma modülleri doğrulandı: ${result.files.length} proje dosyası.`);
}
