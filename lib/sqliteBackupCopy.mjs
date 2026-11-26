// Runs in a separate process so a restore can finish atomically while the
// server pauses its JavaScript writers and keeps its SQLite connection open.
import { backup, DatabaseSync } from "node:sqlite";

const [sourcePath, destinationPath, standalone] = process.argv.slice(2);
if (!sourcePath || !destinationPath) throw new Error("SQLite kaynak ve hedef yolları gerekli.");
const source = new DatabaseSync(sourcePath, { readOnly: true });
try {
  source.exec("PRAGMA busy_timeout = 5000; PRAGMA trusted_schema = OFF;");
  await backup(source, destinationPath, { rate: 2000 });
  if (standalone === "standalone") {
    const destination = new DatabaseSync(destinationPath);
    try { destination.exec("PRAGMA journal_mode = DELETE;"); }
    finally { destination.close(); }
  }
} finally {
  source.close();
}
