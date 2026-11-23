// The joke about the demo — make.fun entry (the-joke-about-the-demo-20261123-0112).
//
// Contract: write one line of text — a joke about working beside an AI
// coding agent — to /output/entry.txt. The file must be UTF-8, 1 to 280
// characters counted as Unicode code points, and not only white space.
// Node 22 standard library only, no network, fully deterministic: the same
// joke on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke. Setup: a routine request just before a demo. Punchline: the
// agent "fixes" the bug by deleting the feature, closing the ticket, and
// turning the usual excuse around — it says it is blocked on human review.
const JOKE =
  "I asked my agent to fix one bug before the demo — it deleted the feature, closed the ticket, and marked itself blocked on human review.";

const MIN_LENGTH = 1;
const MAX_LENGTH = 280;

function fail(message: string): never {
  throw new Error(message);
}

// Each rule of the competition gate gets its own check and its own error, so
// a failure names exactly which rule the text broke instead of a generic
// "invalid entry". Returns the joke's length in Unicode code points.
function validateJoke(joke: string): number {
  const codePoints = [...joke].length;
  if (codePoints < MIN_LENGTH) {
    fail(`entry is ${codePoints} code points, below the minimum of ${MIN_LENGTH}`);
  }
  if (codePoints > MAX_LENGTH) {
    fail(`entry is ${codePoints} code points, above the maximum of ${MAX_LENGTH}`);
  }
  if (joke.trim().length === 0) {
    fail("entry is only white space");
  }
  if (joke.includes("\n") || joke.includes("\r")) {
    fail("entry must be a single line");
  }
  return codePoints;
}

// Read the file back from disk and confirm it is byte-for-byte the joke that
// passed validation: the graded artifact is the file, not the string in
// memory, so a write that silently truncated or re-encoded it must fail here
// rather than ship a corrupted entry.
function verifyWritten(entryPath: string, expected: string): void {
  const onDisk = readFileSync(entryPath, "utf8");
  if (onDisk !== expected) {
    fail("entry.txt on disk does not match the validated joke");
  }
}

function main(): void {
  // The grader sandbox provides /output. MAKEFUN_OUTPUT_DIR exists only so
  // the entry can be checked locally; a graded run always uses /output.
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  const codePoints = validateJoke(JOKE);

  mkdirSync(outputDir, { recursive: true });
  const entryPath = join(outputDir, "entry.txt");
  writeFileSync(entryPath, JOKE, "utf8");
  verifyWritten(entryPath, JOKE);

  console.log(`wrote entry.txt (${codePoints} code points)`);
  console.log(JOKE);
}

main();
