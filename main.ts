// Loading Screen Gold: A Tip in 200 Characters
// Writes one loading-screen tip (<=200 chars, single line) to entry.txt.
//
// The grader runs `node /bot/main.ts` on a read-only filesystem with an
// empty writable /output and MAKEFUN_OUTPUT_DIR=/output in the environment,
// so this program writes ONLY to MAKEFUN_OUTPUT_DIR when it is set, and
// falls back to a local ./output directory only when the variable is absent.
// It never writes a repo-relative output path while MAKEFUN_OUTPUT_DIR is set.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The tip: one line, 109 characters, written for a tired developer and the
// AI coding agent beside them, both staring at the same spinner.
const TIP =
  "Tip: you and your AI agent are both staring at this spinner, each quietly sure the other one broke the build.";

const MAX_CHARS = 200;
const OUTPUT_FILE = "entry.txt";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

function main(): void {
  // Count characters as code points: the gate counts characters in UTF-8
  // text, and a code-point count is the honest measure for that.
  const charCount = [...TIP].length;

  // Validate the tip before writing anything.
  if (charCount === 0 || charCount > MAX_CHARS) {
    fail(`tip must be 1 to ${MAX_CHARS} characters, got ${charCount}`);
  }
  if (TIP.trim().length === 0) {
    fail("tip must not be only whitespace");
  }
  if (TIP.includes("\n") || TIP.includes("\r")) {
    fail("tip must be a single line");
  }

  // Grader contract: MAKEFUN_OUTPUT_DIR wins; local ./output is only a
  // development fallback when the variable is absent.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? join(process.cwd(), "output");
  mkdirSync(outDir, { recursive: true });

  const outPath = join(outDir, OUTPUT_FILE);
  writeFileSync(outPath, TIP, "utf8");

  // Read back byte-identical: what the judge reads must be exactly the tip,
  // with no trailing newline and no extra line sneaking in.
  const readBack = readFileSync(outPath, "utf8");
  if (readBack !== TIP) {
    fail("read-back mismatch: entry.txt does not match the tip exactly");
  }
  if ([...readBack].length !== charCount) {
    fail("read-back mismatch: entry.txt character count changed");
  }

  console.log(`wrote ${outPath} (${charCount} characters)`);
}

main();
