// Sorts a chrome.storage error message into what the user can do about it.
// Chrome reports e.g. "Resource::kQuotaBytesPerItem quota exceeded"; the docs
// name the same limits QUOTA_BYTES_PER_ITEM etc., so match both spellings.
//   'quota' - too big; waiting will not help (QUOTA_BYTES, QUOTA_BYTES_PER_ITEM, MAX_ITEMS)
//   'rate'  - too many writes; it clears up by itself (MAX_WRITE_OPERATIONS_PER_*)
//   'other' - anything else; worth retrying
export const classifyStorageError = (message) => {
  const m = String(message || '');
  if (/max_?write_?operations/i.test(m)) return 'rate';
  if (/quota_?bytes|max_?items/i.test(m)) return 'quota';
  return 'other';
};
