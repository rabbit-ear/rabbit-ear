/**
 * common functions that get reused, especially inside of map/reduce etc...
 */

export const fn_and = (a, b) => a && b;
export const fn_cat = (a, b) => a.concat(b);
export const fn_def = a => a !== undefined;
