// Chance that a hand of n cards from a deck of N contains at least one of the
// K copies: 1 - C(N-K, n) / C(N, n), computed as a running product.
export const atLeastOne = (N, K, n) => {
  if (K <= 0 || n <= 0 || N <= 0) return 0;
  if (N - K < n) return 1;
  let miss = 1;
  for (let i = 0; i < n; i++) miss *= (N - K - i) / (N - i);
  return 1 - miss;
};
