/**
 * Rabbit Ear (c) Robby Kraft
 */
export const unique_sorted_integers = (array) => {
  const keys = {};
  array.forEach((int) => { keys[int] = true; });
  return Object.keys(keys).map(n => parseInt(n)).sort((a, b) => a - b);
};
