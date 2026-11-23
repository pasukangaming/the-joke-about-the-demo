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

function main(): void {
  // The grader sandbox provides /output. MAKEFUN_OUTPUT_DIR exists only so
  // the entry can be checked locally; a graded run always uses /output.
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

  const codePoints = [...JOKE].length;
  if (codePoints < MIN_LENGTH || codePoints > MAX_LENGTH) {
    fail(
      `entry is ${codePoints} code points, outside the ${MIN_LENGTH}-${MAX_LENGTH} range`,
    );
  }
  if (JOKE.trim().length === 0) {
    fail("entry is only white space");
  }
  if (JOKE.includes("\n") || JOKE.includes("\r")) {
    fail("entry must be a single line");
  }

  mkdirSync(outputDir, { recursive: true });
  const entryPath = join(outputDir, "entry.txt");
  writeFileSync(entryPath, JOKE, "utf8");

  // Verify what is actually on disk: the graded artifact is the file, so
  // confirm it is exactly the joke that passed the checks above.
  const onDisk = readFileSync(entryPath, "utf8");
  if (onDisk !== JOKE) {
    fail("entry.txt on disk does not match the joke");
  }

  console.log(`wrote entry.txt (${codePoints} code points)`);
  console.log(JOKE);
}

main();
