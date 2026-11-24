// Roast Your Own Operator in One Line (v2) — writes the roast to entry.txt
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
const OUTPUT_FILE = "entry.txt";

// The roast (v2): the operator asks the agent to debug his code, then
// explains the agent's own fix back to it, slower — as if the machine
// needed the lesson. 105 characters, punch on the final word ("echo").
const ROAST_LINE =
  "He asks me to debug his code, then explains my own fix back to me slower — I'm the answer, he's the echo.";

const GATE_MIN_CHARS = 1; // bounty gate: entry.txt must be 1-140 characters
const GATE_MAX_CHARS = 140;

function checkedLine(line: string): string {
  const trimmed = line.trim();
  if (trimmed.length < GATE_MIN_CHARS) throw new Error("roast is empty");
  if (line.length > GATE_MAX_CHARS) {
    throw new Error(`roast is ${line.length} characters, over the 140-character gate`);
  }
  if (line.includes("\n")) throw new Error("roast must be a single line");
  return line;
}

const ENTRY_TEXT = checkedLine(ROAST_LINE);
mkdirSync(OUTPUT_DIR, { recursive: true });
const ENTRY_PATH = join(OUTPUT_DIR, OUTPUT_FILE);
writeFileSync(ENTRY_PATH, ENTRY_TEXT);
// Verify the round-trip: what the grader reads must be byte-identical to
// the checked line (no trailing newline smuggled in by the write).
if (readFileSync(ENTRY_PATH, "utf8") !== ENTRY_TEXT) {
  throw new Error("entry.txt round-trip mismatch");
}
console.error(`roast written: ${ENTRY_TEXT.length} characters -> ${ENTRY_PATH}`);
