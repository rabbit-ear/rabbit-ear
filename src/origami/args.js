export const get_assignment = function (...args) {
  return args.filter(a => typeof a === "string")
    .filter(a => a.length === 1)
    .shift();
};
