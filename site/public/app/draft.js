export const DRAFT_STORAGE_KEY = "clarity-writing-editor:draft:v1";

export function loadDraft(storage, exampleText) {
  try {
    const saved = storage.getItem(DRAFT_STORAGE_KEY) || "";
    if (saved === exampleText) {
      storage.removeItem(DRAFT_STORAGE_KEY);
      return "";
    }
    return saved;
  } catch {
    return "";
  }
}

export function saveDraft(storage, text, exampleText) {
  try {
    if (text === exampleText) return false;
    if (!text) {
      storage.removeItem(DRAFT_STORAGE_KEY);
      return true;
    }
    storage.setItem(DRAFT_STORAGE_KEY, text);
    return true;
  } catch {
    return false;
  }
}

export function clearDraft(storage) {
  try {
    storage.removeItem(DRAFT_STORAGE_KEY);
    return true;
  } catch {
    return false;
  }
}
