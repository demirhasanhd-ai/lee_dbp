import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { statSync, watch } from "node:fs";
import path from "node:path";

const formatter = new Intl.DateTimeFormat("tr-TR", {
  timeZone: "Europe/Istanbul",
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

function writeLine(output, line) {
  const alreadyStamped = /^\[\d{2}\.\d{2}\.\d{4} \d{2}:\d{2}:\d{2}\]/u.test(line);
  output.write(line.trim() ? `${alreadyStamped ? "" : `[${formatter.format(new Date())}] `}${line}\n` : "\n");
}

const [command, ...args] = process.argv.slice(2);
if (command === "--message") {
  writeLine(process.stdout, args.join(" "));
} else if (!command) {
  writeLine(process.stderr, "[HATA] Calistirilacak komut belirtilmedi.");
  process.exitCode = 1;
} else {
  const child = spawn(command, args, {
    stdio: ["inherit", "pipe", "pipe"],
    windowsHide: true,
  });

  // These observers only report filesystem events. Node's existing watcher
  // remains responsible for deciding when to restart the application.
  const observers = [];
  if (args.includes("--watch")) {
    const watchPaths = args.flatMap((arg, index) => arg.startsWith("--watch-path=")
      ? [arg.slice("--watch-path=".length)]
      : arg === "--watch-path" && args[index + 1] ? [args[index + 1]] : []);
    for (const watched of watchPaths) {
      try {
        const absolute = path.resolve(watched);
        const directory = statSync(absolute).isDirectory();
        const observer = watch(absolute, { recursive: true }, (event, filename) => {
          const target = directory && filename ? path.resolve(absolute, filename) : absolute;
          writeLine(process.stdout, `[izleyici pid=${child.pid}] Dosya olayi: ${event}; yol: ${JSON.stringify(target)}`);
        });
        observer.on("error", (error) => writeLine(process.stderr, `[izleyici pid=${child.pid}] Gozlem hatasi: ${error.message}`));
        observer.unref();
        observers.push(observer);
      } catch (error) {
        writeLine(process.stderr, `[izleyici pid=${child.pid}] Gozlem baslatilamadi: ${error.message}`);
      }
    }
  }

  for (const [input, output] of [[child.stdout, process.stdout], [child.stderr, process.stderr]]) {
    const lines = createInterface({ input, crlfDelay: Infinity });
    lines.on("line", (line) => writeLine(output, line));
  }

  // Windows delivers Ctrl+C to the child and its watcher too. Keep this
  // wrapper alive until they have shut down and their final output is read.
  const onInterrupt = () => {
    if (process.platform !== "win32") child.kill("SIGINT");
  };
  process.on("SIGINT", onInterrupt);
  child.once("error", (error) => {
    writeLine(process.stderr, `[HATA] Komut baslatilamadi: ${error.message}`);
    process.exitCode = 1;
  });
  child.once("close", (code, signal) => {
    for (const observer of observers) observer.close();
    process.removeListener("SIGINT", onInterrupt);
    process.exitCode ??= code ?? (signal === "SIGINT" ? 130 : 1);
  });
}
