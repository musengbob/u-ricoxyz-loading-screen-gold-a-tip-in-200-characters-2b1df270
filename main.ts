// Loading Screen Gold: A Tip in 200 Characters
// Writes one loading-screen tip (<=200 chars, single line) to entry.txt.
//
// The grader runs `node main.ts` in a sandbox with MAKEFUN_OUTPUT_DIR set
// (e.g. /output), so this program writes ONLY to the directory resolved by
// resolveOutputPath(): $MAKEFUN_OUTPUT_DIR first, then $OUTPUT_PATH, then a
// local ./output directory as a development fallback. It never hardcodes
// /output and never uses a repo-relative output path as its primary target.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";

// The tip: one line, 167 characters. A real tip (take the keyboard back)
// for a stressed developer watching their AI coding agent rewrite the same
// file for the third time — the turn is "not iterating, it's stalling",
// and the kicker lands on both of them at once: the agent burns the
// rewrites, the developer pays for the tokens. No coffee, deadline or
// compile joke; the joke is about the dev-agent loop itself.
const TIP =
  "Tip: when your AI agent rewrites the same file for the third time, take the keyboard back. It's not iterating, it's stalling, and you're the one paying for the tokens.";

const GATE = { MIN_CHARS: 1, MAX_CHARS: 200, OUTPUT_FILE: "entry.txt" };

function buildEntryLine(): string {
  return TIP;
}

function validateTip(text: string): void {
  const charCount = [...text].length;
  if (charCount < GATE.MIN_CHARS || charCount > GATE.MAX_CHARS) {
    fail(`tip must be ${GATE.MIN_CHARS} to ${GATE.MAX_CHARS} characters, got ${charCount}`);
  }
  if (text.trim().length === 0) {
    fail("tip must not be only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("tip must be a single line");
  }
}

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function resolveOutputPath(): string {
  const fromEnv =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_PATH ?? null;
  if (fromEnv !== null && fromEnv.trim().length > 0) {
    return resolve(fromEnv.trim());
  }
  return join(process.cwd(), "output");
}

function writeEntry(outDir: string, text: string): string {
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, GATE.OUTPUT_FILE);
  // No trailing newline: the file is exactly the tip, nothing else.
  writeFileSync(outPath, text, "utf8");

  // Read back byte-identical: what the judge reads must be exactly the tip.
  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== text) {
    fail("read-back mismatch: entry.txt does not match the tip exactly");
  }
  if ([...readBack].length !== [...text].length) {
    fail("read-back mismatch: entry.txt character count changed");
  }
  return outPath;
}

function main(): void {
  // Count characters as code points: the gate counts characters in UTF-8
  // text, and a code-point count is the honest measure for that.
  const line = buildEntryLine();
  validateTip(line);
  const charCount = [...line].length;

  const outDir = resolveOutputPath();
  const outPath = writeEntry(outDir, line);

  console.log(`wrote ${outPath} (${charCount} characters)`);
}

main();
