// Sorts a chrome.storage error message into what the user can do about it.
//   'quota' - too big; waiting will not help (QUOTA_BYTES, QUOTA_BYTES_PER_ITEM, MAX_ITEMS)
//   'rate'  - too many writes; it clears up by itself (MAX_WRITE_OPERATIONS_PER_*)
//   'other' - anything else; worth retrying
export const classifyStorageError = (message) => {
  const m = String(message || '');
  if (/MAX_WRITE_OPERATIONS/i.test(m)) return 'rate';
  if (/QUOTA_BYTES|MAX_ITEMS/i.test(m)) return 'quota';
  return 'other';
};
