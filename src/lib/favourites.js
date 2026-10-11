// Lists of preset ids: the user's favourite themes and the ones picked last.

export const MAX_FAVOURITES = 60;
export const MAX_RECENT = 8;

const ID = /^[a-z0-9-]{1,40}$/;

// Unknown ids are kept: a newer version on another browser may know them.
export const cleanIds = (list, max) => {
  if (!Array.isArray(list)) return [];
  return [...new Set(list.filter((id) => typeof id === 'string' && ID.test(id)))].slice(0, max);
};

// When the list is full, the oldest entry makes room for the new one.
export const toggleId = (list, id, max = MAX_FAVOURITES) =>
  list.includes(id) ? list.filter((x) => x !== id) : cleanIds([...list, id].slice(-max), max);

export const pushRecent = (list, id, max = MAX_RECENT) => cleanIds([id, ...list.filter((x) => x !== id)], max);
