// A stored value only counts when it has the same shape as the default, so a
// damaged entry (a number where text belongs, an array where an object
// belongs) cannot crash the panel.
export const sameShape = (v, initial) =>
  initial === undefined ||
  (Array.isArray(initial)
    ? Array.isArray(v)
    : typeof v === typeof initial && (v === null) === (initial === null) && !Array.isArray(v));
