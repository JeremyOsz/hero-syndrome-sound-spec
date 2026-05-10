import { fileURLToPath } from "node:url";
import path from "node:path";

/** Absolute path to repo `lexicon/` (parent of `pipeline/`). */
export const LEXICON_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "..",
  "lexicon",
);
