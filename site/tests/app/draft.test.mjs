// Correctness checks for local draft persistence.
// Run: node apps/ai-writing-editor/draft.test.mjs
import { DRAFT_STORAGE_KEY, loadDraft, saveDraft, clearDraft } from "../../src/lib/editor/draft.js";

let failures = 0;
function check(name, condition) {
  console.log(`${condition ? "✓" : "✗"} ${name}`);
  if (!condition) failures++;
}

class MemoryStorage {
  constructor() {
    this.values = new Map();
  }
  getItem(key) {
    return this.values.get(key) ?? null;
  }
  setItem(key, value) {
    this.values.set(key, String(value));
  }
  removeItem(key) {
    this.values.delete(key);
  }
}

const storage = new MemoryStorage();
const example = "Built-in example text.";

check("empty storage restores an empty draft", loadDraft(storage, example) === "");
check("a real draft saves", saveDraft(storage, "My unfinished article.", example));
check("a real draft restores", loadDraft(storage, example) === "My unfinished article.");
check("the exact example is not saved", !saveDraft(storage, example, example));
check("loading the example preserves the last real draft", loadDraft(storage, example) === "My unfinished article.");
check("an empty edit clears the draft", saveDraft(storage, "", example) && !storage.getItem(DRAFT_STORAGE_KEY));

storage.setItem(DRAFT_STORAGE_KEY, example);
check("a stale saved example is ignored", loadDraft(storage, example) === "");
check("a stale saved example is removed", !storage.getItem(DRAFT_STORAGE_KEY));

saveDraft(storage, "Another draft.", example);
check("clear removes a saved draft", clearDraft(storage) && loadDraft(storage, example) === "");

const brokenStorage = {
  getItem() { throw new Error("blocked"); },
  setItem() { throw new Error("blocked"); },
  removeItem() { throw new Error("blocked"); },
};
check("blocked storage fails safely", loadDraft(brokenStorage, example) === "" && !saveDraft(brokenStorage, "text", example) && !clearDraft(brokenStorage));

console.log(failures ? `\n${failures} FAILED` : "\nAll passed");
process.exit(failures ? 1 : 0);
