import { performance } from "node:perf_hooks";
import { formatWithOptions } from "node:util";

const formatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "2-digit", month: "2-digit", year: "numeric",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
export const timestampPattern = /^\[\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}\]/u;
export function timestamp() {
  return `[${formatter.format(new Date())}]`;
}

// A junction and its real path can load separate copies of this module.
const installed = Symbol.for("dbp.console.timestamps");
if (!globalThis[installed]) {
  globalThis[installed] = true;
  for (const method of ["log", "info", "warn", "error", "debug"]) {
    const original = console[method].bind(console);
    console[method] = (...args) => {
      const output = method === "warn" || method === "error" ? process.stderr : process.stdout;
      const message = formatWithOptions({ colors: Boolean(output.isTTY) }, ...args);
      const prefix = `${timestamp()} [pid=${process.pid}]`;
      original(message.split(/\r?\n/u).map((line) => line && !timestampPattern.test(line) ? `${prefix} ${line}` : line).join("\n"));
    };
  }
}

export function beginStartupStep(label, { background = false, startedAt = performance.now() } = {}) {
  console.log(`[başlangıç] ${label} — ${background ? "arka planda başlatıldı" : "başladı"}`);
  let finished = false;
  return {
    end() {
      if (finished) return;
      finished = true;
      const state = background ? "arka plan görevi sona erdi" : "tamamlandı";
      console.log(`[başlangıç] ${label} — ${state}; süre: ${(performance.now() - startedAt).toFixed(1)} ms`);
    },
    fail(error) {
      if (finished) return;
      finished = true;
      console.error(`[başlangıç] ${label} — hata; süre: ${(performance.now() - startedAt).toFixed(1)} ms; ${error instanceof Error ? error.message : String(error)}`);
    },
  };
}

export function measureStartupSync(label, run) {
  const step = beginStartupStep(label);
  try {
    const result = run();
    step.end();
    return result;
  } catch (error) {
    step.fail(error);
    throw error;
  }
}

export async function measureStartupAsync(label, run) {
  const step = beginStartupStep(label);
  try {
    const result = await run();
    step.end();
    return result;
  } catch (error) {
    step.fail(error);
    throw error;
  }
}

// Observe the existing promise without awaiting it or changing its result.
// Queues may handle their own errors; ending a task does not assert fresh data.
export function observeStartupBackground(label, run) {
  const step = beginStartupStep(label, { background: true });
  try {
    const result = run();
    void Promise.resolve(result).then(() => step.end(), (error) => step.fail(error));
    return result;
  } catch (error) {
    step.fail(error);
    throw error;
  }
}
