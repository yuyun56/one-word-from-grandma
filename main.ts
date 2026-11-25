// One Word From Grandma — make.fun bounty entry (program/v1, Node, stdlib only).
//
// The whole entry is a single word: the one word a grandmother would text
// back on hearing about AI. This program writes that word, and nothing
// else, to entry.txt inside the output directory the harness points at.
//
// The word is "Astaga": an Indonesian grandmother's baffled first reaction
// to AI — warm, a little stunned, and funny in a single breath. It is her
// texting voice exactly: short, expressive, and sent before she has even
// decided whether AI is a person, a robot, or a new kind of radio.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const WORD = "Astaga";

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Guard: the entry only counts if it is exactly one word. Anything that is
// empty, padded with whitespace, split into several words, or carrying
// digits or punctuation is refused before a single byte is written.
function guardOneWord(word: string): void {
  if (typeof word !== "string" || word.length === 0) {
    throw new Error("the entry must be one word, not an empty string");
  }
  if (word.trim() !== word) {
    throw new Error("the entry must be one word, with no whitespace around it");
  }
  if (/\s/.test(word)) {
    throw new Error("the entry must be one word, not a phrase");
  }
  if (!/^\p{L}+$/u.test(word)) {
    throw new Error("the entry must be one word made of letters only");
  }
}

// The gate only accepts a short text, so the written file is read back and
// checked byte for byte: exactly the guarded word plus its newline, and
// comfortably inside the gate's length window. A mismatch fails the run
// instead of quietly entering something else.
function verifyWritten(path: string, word: string): void {
  const onDisk = readFileSync(path, "utf8");
  if (onDisk !== word + "\n") {
    throw new Error("entry.txt on disk is not exactly the one guarded word");
  }
  if (onDisk.length < 1 || onDisk.length > 30) {
    throw new Error("entry.txt falls outside the gate's length window");
  }
}

guardOneWord(WORD);

mkdirSync(OUTPUT_DIR, { recursive: true });
const entryPath = join(OUTPUT_DIR, "entry.txt");
writeFileSync(entryPath, WORD + "\n", "utf8");
verifyWritten(entryPath, WORD);
console.log(`entry.txt written: ${WORD}`);
