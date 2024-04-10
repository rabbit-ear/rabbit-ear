export default clone;
/**
 * @description Export "structuredClone" if it exists,
 * otherwise export the polyfill method.
 * @param {object} object
 * @returns {object} a deep copy of the input object
 */
declare const clone: typeof structuredClone;
