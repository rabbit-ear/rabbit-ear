/**
 * @description Capitalize the first letter of a string.
 * @param {string} s a string
 * @returns {string} a copy of the string, capitalized.
 */
export function capitalized(s: string): string;
/**
 * Rabbit Ear (c) Kraft
 */
/**
 * @description make a unique identifier string
 * @returns {string} a unique identifier
 */
export function makeUUID(): string;
/**
 * @description Convert a string into camel case from kebab or snake case.
 * @param {string} s a string in kebab or snake case
 * @returns {string} a string in camel case
 */
export function toCamel(s: string): string;
/**
 * @description Convert a string into kebab case from camel case.
 * Snake case does not work in this method.
 * @param {string} s a string in camel case
 * @returns {string} a string in kebab case
 */
export function toKebab(s: string): string;
