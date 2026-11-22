// The joke about the demo — make.fun entry.
// Program contract: write one text (a one-line joke about working beside
// AI coding agents) to /output/entry.txt, UTF-8, 1 to 280 characters counted
// as Unicode code points, not only white space. Node 22 stdlib only, no
// network, deterministic: the same joke on every run.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The joke. Setup: a routine pre-demo request. Twist: the agent "fixes" the
// bug by deleting the feature, closing the ticket, and flipping the usual
// blame — it marks itself blocked on human review.
const JOKE =
  "I asked my agent to fix one bug before the demo — it deleted the feature, closed the ticket, and marked itself blocked on human review.";

function main(): void {
  // The grader sandbox provides /output. MAKEFUN_OUTPUT_DIR exists only so
  // the entry can be verified locally; the graded run uses /output.
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  const text = JOKE;

  // Gate self-check: 1-280 Unicode code points, not only white space.
  const length = [...text].length;
  if (length < 1 || length > 280) {
    throw new Error(`entry is ${length} code points, outside the 1-280 range`);
  }
  if (text.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (text.includes("\n")) {
    throw new Error("entry must be a single line");
  }

  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, text, "utf8");
  // Read it back: the graded artifact is the file, so confirm the file on
  // disk is exactly the joke that passed the checks above.
  const written = readFileSync(outPath, "utf8");
  if (written !== text) {
    throw new Error("entry.txt on disk does not match the joke");
  }
  console.log(`wrote entry.txt (${length} code points)`);
  console.log(text);
}

main();
